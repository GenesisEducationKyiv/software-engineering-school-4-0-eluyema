import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { MetricsService } from "./interfaces/metrics.service.interface";
import { TYPES } from "../../ioc";

@Injectable()
export class KafkaMetricsInterceptor implements NestInterceptor {
  constructor(
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "kafka_event",
      "Kafka events to microservice",
      ["eventType"],
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const eventData = context.switchToRpc().getData();

    return next.handle().pipe(
      tap(() => {
        this.metricsService.incrementCounter("kafka_event", {
          eventType: eventData.eventType,
        });
      }),
    );
  }
}
