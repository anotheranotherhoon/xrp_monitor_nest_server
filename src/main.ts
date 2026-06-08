import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = new Set([
    ...configuredOrigins,
    'http://xrp-admin.p-e.kr',
    'https://xrp-admin.p-e.kr',
  ]);

  app.enableCors({
    origin: (origin, callback) => {
      const isLocalOrigin =
        origin === undefined ||
        /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(origin);
      callback(
        isLocalOrigin || allowedOrigins.has(origin)
          ? null
          : new Error(`CORS origin is not allowed: ${origin}`),
        isLocalOrigin || allowedOrigins.has(origin),
      );
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러 발생 (Body에만 적용)
      transform: true, // 요청 데이터를 DTO 타입으로 자동 변환
      skipMissingProperties: false, // 필수 속성 누락 시 에러 발생
      skipNullProperties: false, // null 값 속성도 검증
      skipUndefinedProperties: false, // undefined 값 속성도 검증
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('XRP Monitor API')
    .setDescription('XRP Monitor 서비스 API 문서')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
