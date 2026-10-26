import { CATEGORIES, type CategoryFilter } from '../books/types';
import { useFilterStore } from './useFilterStore';

const OPTIONS: ReadonlyArray<{ value: CategoryFilter; label: string }> = [
  { value: 'ALL', label: 'Tất cả' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function CategoryFilterBar() {
  const category = useFilterStore((s) => s.category);
  const setCategory = useFilterStore((s) => s.setCategory);

  return (
    <div className="segmented" role="group" aria-label="Lọc theo thể loại">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={category === opt.value ? 'is-active' : undefined}
          aria-pressed={category === opt.value}
          onClick={() => setCategory(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
