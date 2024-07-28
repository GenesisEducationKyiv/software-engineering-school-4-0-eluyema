export interface MetricsService {
  incrementCounter(name: string, tags: Record<string, string>): void;
  getMetrics(): Promise<string>;
}
