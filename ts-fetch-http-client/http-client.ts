import type {
  ApiMethods,
  BaseResponse,
  FetchWrapperInit,
  FetchWrapperResponse,
  WithoutId,
} from "./types";
import { FetchMethods } from "./types";

export class HttpClient implements ApiMethods {
  private baseUrl: string;
  private headers?: HeadersInit;
  private redirect?: RequestRedirect = "follow";
  public token?: string;

  constructor(init: FetchWrapperInit) {
    this.baseUrl = init.baseUrl;
    this.token = init.token;
    this.headers = init.headers;
    this.redirect = init.redirect;
  }

  private async http<TBody, TResponse>(
    url: string,
    config: Omit<RequestInit, "body"> & { body?: TBody | null }
  ): Promise<FetchWrapperResponse<TResponse>> {
    const request = new Request(url, {
      ...config,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${this.token ? this.token : ""}`,
        ...this.headers,
        ...config.headers,
      },
      body: config.body && config.method !== "GET" ? JSON.stringify(config.body) : null,
    });
    const response = await fetch(request);

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: (await response.json()) as unknown as BaseResponse<TResponse>,
    };
  }

  private getPath(path: string): string {
    return `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  async get<TResponse>(path: string): Promise<FetchWrapperResponse<TResponse>> {
    return this.http<unknown, TResponse>(this.getPath(path), {
      method: FetchMethods.GET,
    });
  }

  async post<TBody, TResponse>(
    path: string,
    data?: WithoutId<TBody>
  ): Promise<FetchWrapperResponse<TResponse>> {
    return this.http<WithoutId<TBody>, TResponse>(this.getPath(path), {
      method: FetchMethods.POST,
      body: data,
    });
  }

  async patch<TBody, TResponse>(
    path: string,
    data: Partial<TBody>
  ): Promise<FetchWrapperResponse<TResponse>> {
    return this.http<Partial<TBody>, TResponse>(this.getPath(path), {
      method: FetchMethods.PATCH,
      body: data,
    });
  }

  async put<TBody, TResponse>(
    path: string,
    data: Partial<TBody>
  ): Promise<FetchWrapperResponse<TResponse>> {
    return this.http<Partial<TBody>, TResponse>(this.getPath(path), {
      method: FetchMethods.PUT,
      body: data,
    });
  }

  async delete<TResponse>(path: string): Promise<FetchWrapperResponse<TResponse>> {
    return this.http<unknown, TResponse>(this.getPath(path), {
      method: FetchMethods.DELETE,
    });
  }
}
