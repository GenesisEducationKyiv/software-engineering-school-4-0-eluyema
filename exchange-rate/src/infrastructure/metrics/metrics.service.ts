import { Injectable } from "@nestjs/common";
import { Counter, collectDefaultMetrics, register } from "prom-client";

import { MetricsService } from "./interfaces/metrics.service.interface";

@Injectable()
export class PrometheusMetricsService implements MetricsService {
  private counters: Map<string, Counter<string>> = new Map();

  private onModuleInit(): void {
    collectDefaultMetrics({ prefix: "exchange_rate" });
  }

  public async getMetrics(): Promise<string> {
    return register.metrics();
  }

  public getMetricsContentType() {
    return register.contentType;
  }

  public incrementCounter(
    name: string,
    tags: Record<string, string> = {},
  ): void {
    let counter = this.counters.get(name);
    if (!counter) {
      counter = new Counter({
        name,
        help: `Counts the number of calls to ${name}`,
        labelNames: Object.keys(tags),
      });
      this.counters.set(name, counter);
    }
    counter.inc(tags);
  }
}
