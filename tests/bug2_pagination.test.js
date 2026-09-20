import { describe, it, expect } from 'vitest';
import { paginate } from '../src/utils/pagination';

describe('Bug 2: Pagination Page Slicing', () => {
  const mockItems = Array.from({ length: 18 }, (_, i) => ({
    id: `item-${i + 1}`,
    title: `Item Number ${i + 1}`
  }));

  it('returns the full pageSize count of items on full pages without omitting the last item', () => {
    const pageSize = 6;
    const page1 = paginate(mockItems, 1, pageSize);

    // Page 1 should contain exactly 6 items (item-1 through item-6)
    expect(page1.items).toHaveLength(6);
    expect(page1.items[0].id).toBe('item-1');
    expect(page1.items[5].id).toBe('item-6');
  });

  it('correctly partitions consecutive pages without skipping items between page transitions', () => {
    const pageSize = 6;
    const page1 = paginate(mockItems, 1, pageSize);
    const page2 = paginate(mockItems, 2, pageSize);

    // item-6 must be the last element of page 1
    expect(page1.items.map((i) => i.id)).toEqual([
      'item-1',
      'item-2',
      'item-3',
      'item-4',
      'item-5',
      'item-6'
    ]);

    // item-7 must immediately follow as the first element of page 2
    expect(page2.items.map((i) => i.id)).toEqual([
      'item-7',
      'item-8',
      'item-9',
      'item-10',
      'item-11',
      'item-12'
    ]);
  });
});
