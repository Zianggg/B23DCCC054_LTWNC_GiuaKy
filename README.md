# Mini Library — LTWNC Kiểm tra giữa kỳ

**Sinh viên:** B23DCCC054

Ứng dụng tra cứu và mượn/trả sách cho thư viện khoa: tìm sách, lọc theo thể loại, mượn tối đa 3 cuốn cùng lúc, xem thống kê.

**Công nghệ:** React 19 + TypeScript + Vite · Redux Toolkit · Zustand · React Router · Jest + React Testing Library

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # chạy toàn bộ test
npm run build    # kiểm tra type + build production
```

Giả lập API lỗi: mở `http://localhost:5173/?fail` → hiện thông báo lỗi kèm nút "Thử lại".

## Cấu trúc thư mục (feature-based)

```
src/
├── api/
│   ├── booksApi.ts               # API giả lập: Promise + setTimeout 500ms, tham số shouldFail
│   └── mockBooks.ts              # dữ liệu mẫu (13 đầu sách)
├── app/
│   ├── store.ts                  # configureStore + borrowLimitMiddleware
│   └── hooks.ts                  # useAppDispatch / useAppSelector
├── types/api.ts                  # ApiResponse<T>, type guard isApiSuccess / isApiFailure
├── hooks/useDebounce.ts          # custom hook generic useDebounce<T>
├── features/
│   ├── books/
│   │   ├── types.ts              # Book, Category, BooksState + utility types
│   │   ├── booksSlice.ts         # createSlice + createAsyncThunk fetchBooks + selectors
│   │   ├── borrowLimitMiddleware.ts  # middleware tự viết: giới hạn 3 cuốn
│   │   ├── filterBooks.ts        # hàm lọc thuần
│   │   └── components/           # BookItem (React.memo), BookList, BorrowedPanel, ...
│   ├── filters/                  # Zustand store (từ khoá, thể loại), SearchBar, CategoryFilterBar
│   ├── theme/                    # ThemeContext, ThemeProvider (useMemo value), useTheme
│   └── stats/                    # StatsPage (lazy load), statsUtils
├── pages/LibraryPage.tsx
├── components/                   # Header, Icon
└── test/test-utils.tsx           # renderWithProviders, makeBook
```

## Đối chiếu yêu cầu

### Chức năng

| # | Yêu cầu | Vị trí |
| --- | --- | --- |
| 1 | Tải sách từ API (500ms), "Đang tải...", báo lỗi | `App.tsx`, `BooksStatusGate.tsx` |
| 2 | Hiển thị tên, tác giả, thể loại, năm, số bản còn | `BookItem.tsx` |
| 3 | Tìm theo tên/tác giả, không phân biệt hoa thường, debounce 300ms | `SearchBar.tsx`, `filterBooks.ts` |
| 4 | Lọc thể loại Tất cả / CNTT / Kinh tế / Ngoại ngữ | `CategoryFilterBar.tsx` |
| 5 | Mượn: giảm 1 bản, nút vô hiệu hoá khi hết | `booksSlice.ts` (`borrowBook`), `BookItem.tsx` |
| 6 | Trả: nút "Trả" cho sách đang mượn, tăng 1 bản | `booksSlice.ts` (`returnBook`), `BorrowedPanel.tsx` |
| 7 | Tối đa 3 cuốn, vượt thì chặn + cảnh báo | `borrowLimitMiddleware.ts`, `WarningBanner.tsx` |
| 8 | Chuyển sáng / tối | `features/theme/*`, `ThemeToggle.tsx` |
| 9 | Trang `/stats`: số đầu sách theo thể loại, số sách đang mượn | `features/stats/StatsPage.tsx` |

### Kỹ thuật

| # | Yêu cầu | Cách làm |
| --- | --- | --- |
| 1 | Type đầy đủ, API generic, type guard, ≥ 2 utility type, không `any` | `ApiResponse<T>` + `isApiSuccess`; `Pick` (BorrowedBook), `Omit` (BookDraft), `Record` (CategoryStats, CATEGORY_TONE), `Partial`, `Readonly`/`ReadonlyArray`; type guard `isCategory` |
| 2 | Redux Toolkit: createSlice, createAsyncThunk 3 trạng thái, typed hooks, feature-based | `booksSlice.ts` (pending/fulfilled/rejected + `rejectWithValue`), `app/hooks.ts` |
| 3 | Giới hạn 3 cuốn bằng middleware tự viết | `borrowLimitMiddleware.ts` chặn `books/borrowBook`, dispatch `borrowRejected` |
| 4 | Bộ lọc bằng Zustand; theme bằng Context + useMemo + `useTheme` | `useFilterStore.ts`; `ThemeProvider.tsx`, `useTheme.ts` |
| 5 | `useDebounce<T>` | `hooks/useDebounce.ts` |
| 6 | useMemo danh sách lọc, React.memo, useCallback, key không dùng index, lazy load /stats | `BookList.tsx`, `BookItem.tsx`, `App.tsx` (`React.lazy` + `Suspense`) |
| 7 | Test | xem bảng dưới |
| 8 | API giả lập trong `src/api/booksApi.ts` | `fetchBooksApi({ shouldFail, delay })` |

## Test (`npm test`)

| File | Nội dung |
| --- | --- |
| `booksSlice.test.ts` | 12 test reducer: state đầu, fetch pending/fulfilled/rejected, mượn (giảm bản, hết bản, mượn trùng, id sai), trả, cảnh báo, selector |
| `BookItem.test.tsx` | 4 test RTL + userEvent: hiển thị thông tin, click "Mượn" gọi `onBorrow` đúng id, nút disabled khi hết bản, nút "Trả" |
| `useDebounce.test.ts` | fake timers: giá trị chỉ đổi sau 300ms kể từ lần đổi cuối |
| `borrowLimitMiddleware.test.ts` | cho mượn 3 cuốn, chặn cuốn thứ 4, trả bớt thì mượn tiếp |
| `filterBooks.test.ts` | lọc theo tên, tác giả, thể loại |
| `booksApi.test.ts` | API trả `{ ok: true, data }` và `{ ok: false, error }` |
| `App.test.tsx` | tích hợp: loading → danh sách, debounce tìm kiếm, chặn mượn quá 3, lazy load `/stats` |
