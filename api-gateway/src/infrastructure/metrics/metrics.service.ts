import { Injectable } from "@nestjs/common";
import { Counter, collectDefaultMetrics, register } from "prom-client";

import { MetricsService } from "./interfaces/metrics.service.interface";

@Injectable()
export class PrometheusMetricsServiceImpl implements MetricsService {
  private counters: Map<string, Counter<string>> = new Map();

  private onModuleInit(): void {
    collectDefaultMetrics({ prefix: "exchange_rate_" });
  }

  public async getMetrics(): Promise<string> {
    return register.metrics();
  }

  public getMetricsContentType() {
    return register.contentType;
  }

  public initCounter(
    name: string,
    helpText: string,
    labelNames: string[] = [],
  ) {
    let counter = this.counters.get(name);

    if (counter) {
      return;
    }

    counter = new Counter({
      name,
      help: helpText,
      labelNames: labelNames,
    });
    this.counters.set(name, counter);
  }

  public incrementCounter(
    name: string,
    labels: Record<string, string> = {},
    value = 1,
  ): void {
    const counter = this.counters.get(name);

    if (!counter) {
      throw new Error(`Counter ${name} not found`);
    }

    counter.inc(labels, value);
  }
}
