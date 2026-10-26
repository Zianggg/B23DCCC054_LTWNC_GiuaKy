import type { Category } from './types';

type Tone = 'blue' | 'orange' | 'purple';

/** Màu tag cho từng thể loại. */
export const CATEGORY_TONE: Record<Category, Tone> = {
  CNTT: 'blue',
  'Kinh tế': 'orange',
  'Ngoại ngữ': 'purple',
};
