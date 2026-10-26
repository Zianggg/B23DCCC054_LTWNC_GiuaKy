import { isApiFailure, isApiSuccess } from '../types/api';
import { API_DELAY_MS, fetchBooksApi } from './booksApi';

describe('fetchBooksApi', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('trả về { ok: true, data } sau 500ms', async () => {
    const promise = fetchBooksApi();
    jest.advanceTimersByTime(API_DELAY_MS);
    const res = await promise;

    expect(isApiSuccess(res)).toBe(true);
    if (isApiSuccess(res)) expect(res.data.length).toBeGreaterThan(0);
  });

  it('trả về { ok: false, error } khi shouldFail = true', async () => {
    const promise = fetchBooksApi({ shouldFail: true });
    jest.advanceTimersByTime(API_DELAY_MS);
    const res = await promise;

    expect(isApiFailure(res)).toBe(true);
    if (isApiFailure(res)) expect(res.error).toMatch(/không thể tải/i);
  });
});
