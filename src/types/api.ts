/** Kết quả API dạng generic: thành công thì có `data`, thất bại thì có `error`. */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/** Type guard: thu hẹp ApiResponse<T> về ApiSuccess<T>. */
export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.ok === true;
}

export function isApiFailure<T>(res: ApiResponse<T>): res is ApiFailure {
  return res.ok === false;
}
