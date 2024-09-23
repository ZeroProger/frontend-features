export interface State {
  isSubmitting: boolean;
  isSuccess: boolean | null;
  isRedirected: boolean | null;
  baseUrl: string;
  token: string | undefined;
  headers?: HeadersInit;
  redirect?: RequestRedirect;
  data: null | any;
}

export interface FetchWrapperInit {
  baseUrl: string;
  headers?: HeadersInit;
  token?: string;
  redirect?: RequestRedirect;
}

export enum FetchMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export type ErrorItem = {
  code: number;
  message: string;
};

export type BaseResponse<T> = {
  data: T;
  success: boolean;
  errors: ErrorItem[];
};

export type WithoutId<T> = Omit<T, "id">;

export interface ApiMethods {
  get: <TResponse>(path: string) => Promise<FetchWrapperResponse<TResponse>>;
  post: <TBody extends WithoutId<TBody>, TResponse>(
    path: string,
    data?: TBody
  ) => Promise<FetchWrapperResponse<TResponse>>;
  patch: <TBody, TResponse>(
    path: string,
    data: Partial<TBody>
  ) => Promise<FetchWrapperResponse<TResponse>>;
  put: <TBody, TResponse>(
    path: string,
    data: Partial<TBody>
  ) => Promise<FetchWrapperResponse<TResponse>>;
  delete: <TBody, TResponse>(
    path: string,
    data?: TBody
  ) => Promise<FetchWrapperResponse<TResponse>>;
}

export interface FetchWrapperResponse<T> {
  success: boolean;
  status: number;
  data: BaseResponse<T> | null;
  statusText: string;
}
