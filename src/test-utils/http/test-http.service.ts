import {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { Observable, from, of } from 'rxjs';

class TestHttpService {
  instance: AxiosInstance;

  constructor(instance?: AxiosInstance) {
    this.instance = instance || jest.requireMock('axios').create();
  }

  get axiosRef(): AxiosInstance {
    return this.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request<T = unknown>(_config: AxiosRequestConfig) {
    const axiosResponse: AxiosResponse<T> = {
      data: {} as T,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };
    return of(axiosResponse);
  }

  get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  head<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: 'HEAD' });
  }

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: 'PATCH', data });
  }

  protected makeObservable<T>(
    axios: (...args: unknown[]) => AxiosPromise<T>,
    ...args: unknown[]
  ): Observable<AxiosResponse<T>> {
    return from(axios(...args));
  }
}

export default TestHttpService;
