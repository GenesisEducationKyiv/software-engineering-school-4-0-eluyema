import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { MetricsService } from "./interfaces/metrics.service.interface";
import { TYPES } from "../../ioc";

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "http_request",
      "HTTP request to microservice",
      ["method", "path", "statusCode"],
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url } = request;

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode.toString();
        this.metricsService.incrementCounter("http_request", {
          method,
          path: url,
          statusCode,
        });
      }),
    );
  }
}
