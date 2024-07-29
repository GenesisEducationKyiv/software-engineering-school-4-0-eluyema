import { Injectable } from "@nestjs/common";
import { Counter, collectDefaultMetrics, register } from "prom-client";

import { MetricsService } from "./interfaces/metrics.service.interface";

@Injectable()
export class PrometheusMetricsServiceImpl implements MetricsService {
  private counters: Map<string, Counter<string>> = new Map();
  private metricsHandlers: Map<string, () => Promise<string>> = new Map();

  private onModuleInit(): void {
    collectDefaultMetrics();
  }

  public addMetricHandler(name: string, callback: () => Promise<string>) {
    this.metricsHandlers.set(name, callback);
  }

  public removeMetricHandler(name: string) {
    this.metricsHandlers.delete(name);
  }

  public async getMetrics(): Promise<string> {
    const callbackPromises: Promise<string>[] = [];

    for (const callback of this.metricsHandlers.values()) {
      callbackPromises.push(callback());
    }

    const metricsStrArray = await Promise.all([
      register.metrics(),
      ...callbackPromises,
    ]);

    return metricsStrArray.join();
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
