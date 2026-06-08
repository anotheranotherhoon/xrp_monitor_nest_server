import {
  InternalServerErrorException,
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConfigFileAuthenticationDetailsProvider,
  InstancePrincipalsAuthenticationDetailsProviderBuilder,
} from 'oci-common';
import { ObjectStorageClient } from 'oci-objectstorage';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { dirname, extname, resolve, sep } from 'path';

@Injectable()
export class ObjectStorageService implements OnModuleDestroy {
  private clientPromise?: Promise<ObjectStorageClient>;

  constructor(private readonly configService: ConfigService) {}

  async uploadPopupImage(file: Express.Multer.File): Promise<string> {
    const objectName = `popups/${randomUUID()}${this.extensionFor(file)}`;
    if (this.usesLocalStorage) {
      const filePath = this.localObjectPath(objectName);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, file.buffer);
      return objectName;
    }

    const client = await this.getClient();

    await client.putObject({
      namespaceName: this.requiredConfig('OCI_OBJECT_STORAGE_NAMESPACE'),
      bucketName: this.requiredConfig('OCI_OBJECT_STORAGE_BUCKET'),
      objectName,
      contentLength: file.size,
      contentType: file.mimetype,
      cacheControl: 'public, max-age=86400',
      putObjectBody: file.buffer,
    });

    return objectName;
  }

  async getObject(objectName: string) {
    if (this.usesLocalStorage) {
      return {
        contentType: this.contentTypeFor(objectName),
        cacheControl: 'no-cache',
        value: createReadStream(this.localObjectPath(objectName)),
      };
    }

    const client = await this.getClient();
    return client.getObject({
      namespaceName: this.requiredConfig('OCI_OBJECT_STORAGE_NAMESPACE'),
      bucketName: this.requiredConfig('OCI_OBJECT_STORAGE_BUCKET'),
      objectName,
    });
  }

  async deleteObject(objectName: string): Promise<void> {
    if (!objectName) return;
    if (this.usesLocalStorage) {
      try {
        await unlink(this.localObjectPath(objectName));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
      return;
    }

    const client = await this.getClient();
    await client.deleteObject({
      namespaceName: this.requiredConfig('OCI_OBJECT_STORAGE_NAMESPACE'),
      bucketName: this.requiredConfig('OCI_OBJECT_STORAGE_BUCKET'),
      objectName,
    });
  }

  onModuleDestroy(): void {
    void this.clientPromise?.then((client) => client.close());
  }

  private get usesLocalStorage(): boolean {
    const configuredDriver = this.configService.get<string>(
      'OBJECT_STORAGE_DRIVER',
    );
    return configuredDriver
      ? configuredDriver === 'local'
      : this.configService.get<string>('NODE_ENV') !== 'production';
  }

  private localObjectPath(objectName: string): string {
    const baseDirectory = resolve(
      this.configService.get<string>('LOCAL_STORAGE_PATH') ?? '.local-storage',
    );
    const objectPath = resolve(baseDirectory, objectName);
    if (!objectPath.startsWith(`${baseDirectory}${sep}`)) {
      throw new InternalServerErrorException('잘못된 로컬 객체 경로입니다.');
    }
    return objectPath;
  }

  private getClient(): Promise<ObjectStorageClient> {
    this.clientPromise ??= this.createClient();
    return this.clientPromise;
  }

  private async createClient(): Promise<ObjectStorageClient> {
    const authMode =
      this.configService.get<string>('OCI_AUTH_MODE') ?? 'config';
    const provider =
      authMode === 'instance_principal'
        ? await new InstancePrincipalsAuthenticationDetailsProviderBuilder().build()
        : new ConfigFileAuthenticationDetailsProvider(
            this.configService.get<string>('OCI_CONFIG_FILE'),
            this.configService.get<string>('OCI_CONFIG_PROFILE') ?? 'DEFAULT',
          );

    const client = new ObjectStorageClient({
      authenticationDetailsProvider: provider,
    });
    const region = this.configService.get<string>('OCI_REGION');
    if (region) client.regionId = region;
    return client;
  }

  private requiredConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new InternalServerErrorException(
        `${key} 환경변수가 설정되지 않았습니다.`,
      );
    }
    return value;
  }

  private extensionFor(file: Express.Multer.File): string {
    const extension = extname(file.originalname).toLowerCase();
    if (extension) return extension;
    if (file.mimetype === 'image/png') return '.png';
    if (file.mimetype === 'image/webp') return '.webp';
    return '.jpg';
  }

  private contentTypeFor(objectName: string): string {
    switch (extname(objectName).toLowerCase()) {
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }
}
