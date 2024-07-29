export interface MetricsService {
  initCounter(name: string, helpText: string, labelNames?: string[]): void;
  incrementCounter(
    name: string,
    labels?: Record<string, string>,
    value?: number,
  ): void;
  getMetrics(): Promise<string>;
  getMetricsContentType(): string;
}
