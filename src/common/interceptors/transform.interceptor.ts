import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const http = context.switchToHttp();
        const response = http.getResponse();
        const statusCode = response?.statusCode ?? 200;

        const body: ResponseDto<T> = {
          success: true,
          code: statusCode,
          message: '요청이 성공적으로 처리되었습니다.',
          result: data,
        };
        return body;
      }),
    );
  }
}
