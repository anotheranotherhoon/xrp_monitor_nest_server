import { ConfigService } from '@nestjs/config';
import { mkdtemp, rm } from 'fs/promises';
import { ObjectStorageClient } from 'oci-objectstorage';
import { tmpdir } from 'os';
import { join } from 'path';
import { Readable } from 'stream';
import { ObjectStorageService } from './object-storage.service';

describe('ObjectStorageService local driver', () => {
  let storagePath: string;
  let service: ObjectStorageService;

  beforeEach(async () => {
    storagePath = await mkdtemp(join(tmpdir(), 'xrp-popup-storage-'));
    const values: Record<string, string> = {
      OBJECT_STORAGE_DRIVER: 'local',
      LOCAL_STORAGE_PATH: storagePath,
    };
    const configService = {
      get: jest.fn((key: string) => values[key]),
    } as unknown as ConfigService;
    service = new ObjectStorageService(configService);
  });

  afterEach(async () => {
    await rm(storagePath, { recursive: true, force: true });
  });

  it('uploads, reads, and deletes a popup image locally', async () => {
    const file = {
      originalname: 'popup.png',
      mimetype: 'image/png',
      size: 4,
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const objectName = await service.uploadPopupImage(file);
    const object = await service.getObject(objectName);

    expect(objectName).toMatch(/^popups\/.+\.png$/);
    expect(object.contentType).toBe('image/png');
    expect((await readStream(object.value as Readable)).toString()).toBe(
      'test',
    );

    await service.deleteObject(objectName);
    const missingObject = await service.getObject(objectName);
    await expect(
      readStream(missingObject.value as Readable),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });
});

describe('ObjectStorageService OCI driver', () => {
  it('discovers and caches the namespace when it is not configured', async () => {
    const values: Record<string, string> = {
      OBJECT_STORAGE_DRIVER: 'oci',
      OCI_OBJECT_STORAGE_BUCKET: 'xrp-monitor-popup',
    };
    const configService = {
      get: jest.fn((key: string) => values[key]),
    } as unknown as ConfigService;
    const client = {
      getNamespace: jest
        .fn()
        .mockResolvedValue({ value: 'resolved-namespace' }),
      putObject: jest.fn().mockResolvedValue({}),
      close: jest.fn(),
    } as unknown as ObjectStorageClient;
    const service = new ObjectStorageService(configService);
    jest
      .spyOn(
        service as unknown as { getClient: () => Promise<ObjectStorageClient> },
        'getClient',
      )
      .mockResolvedValue(client);
    const file = {
      originalname: 'popup.jpg',
      mimetype: 'image/jpeg',
      size: 4,
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    await service.uploadPopupImage(file);
    await service.uploadPopupImage(file);

    expect(client.getNamespace).toHaveBeenCalledTimes(1);
    expect(client.putObject).toHaveBeenCalledTimes(2);
    expect(client.putObject).toHaveBeenCalledWith(
      expect.objectContaining({
        namespaceName: 'resolved-namespace',
        bucketName: 'xrp-monitor-popup',
      }),
    );
  });
});

async function readStream(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
