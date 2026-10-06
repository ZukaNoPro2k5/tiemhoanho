import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BouquetDesigner } from './BouquetDesigner';

function setup() {
  render(<BouquetDesigner onBack={vi.fn()} />);
  const tray = screen.getByRole('list', { name: 'Khay hoa' });
  const plane = screen.getByRole('group', { name: 'Khung xếp hoa' });
  const addFlower = (name: string) =>
    fireEvent.click(
      within(tray).getByRole('button', { name: new RegExp(name) }),
    );
  const stems = () => within(plane).queryAllByRole('button');
  return { tray, plane, addFlower, stems };
}

describe('Bouquet Designer', () => {
  it('starts empty with a hint and the wrap picker', () => {
    const { stems } = setup();
    expect(stems()).toHaveLength(0);
    expect(
      screen.getByText('Chạm một bông hoa bên dưới để bắt đầu'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: /Giấy kem/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('0/9 cành')).toBeVisible();
  });

  it('adds stems from the tray and shows the used count', () => {
    const { addFlower, stems, tray } = setup();
    addFlower('Tulip hồng');
    addFlower('Tulip hồng');
    expect(stems().map((stem) => stem.getAttribute('aria-label'))).toEqual([
      'Tulip hồng, cành 1',
      'Tulip hồng, cành 2',
    ]);
    expect(within(tray).getByText('×2')).toBeVisible();
    expect(screen.getByText('2/9 cành')).toBeVisible();
  });

  it('stops at nine stems even under rapid taps and says why', () => {
    const { addFlower, stems, tray } = setup();
    for (let index = 0; index < 12; index += 1) addFlower('Hồng đỏ');
    expect(stems()).toHaveLength(9);
    for (const card of within(tray).getAllByRole('button')) {
      expect(card).toBeDisabled();
    }
    expect(screen.getByRole('status')).toHaveTextContent('Bó đã đủ 9 cành');
  });

  it('selects a stem, shows its tools and removes it', () => {
    const { addFlower, stems } = setup();
    addFlower('Cúc họa mi');
    const [stem] = stems();
    fireEvent.click(stem!);
    expect(stem).toHaveAttribute('aria-pressed', 'true');
    const toolbar = screen.getByRole('toolbar', {
      name: 'Chỉnh bông đang chọn',
    });
    fireEvent.click(within(toolbar).getByRole('button', { name: 'Xoá' }));
    expect(stems()).toHaveLength(0);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Giấy kem/ })).toBeVisible();
  });

  it('brings a removed stem back with undo, unselected', () => {
    const { addFlower, stems } = setup();
    addFlower('Cúc họa mi');
    fireEvent.click(stems()[0]!);
    fireEvent.click(screen.getByRole('button', { name: 'Xoá' }));
    fireEvent.click(screen.getByRole('button', { name: /Hoàn tác/ }));
    expect(stems()).toHaveLength(1);
    expect(stems()[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('deselects when the empty plane is tapped', () => {
    const { addFlower, plane, stems } = setup();
    addFlower('Cúc họa mi');
    fireEvent.click(stems()[0]!);
    fireEvent.click(plane);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('switches to Lẵng, hides the wrap picker and announces the re-layout', () => {
    const { addFlower } = setup();
    addFlower('Hồng đỏ');
    fireEvent.click(screen.getByRole('button', { name: 'Lẵng' }));
    expect(screen.getByRole('button', { name: 'Lẵng' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.queryByRole('button', { name: /Giấy kem/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Đã xếp lại theo dáng lẵng',
    );
  });

  it('moves the selected stem with arrow keys', () => {
    const { addFlower, stems } = setup();
    addFlower('Cúc họa mi');
    const stem = stems()[0]!;
    const before = stem.style.left;
    fireEvent.keyDown(stem, { key: 'ArrowRight' });
    expect(stems()[0]!.style.left).not.toBe(before);
  });

  it('ignores a second finger while the first one drags', () => {
    const { addFlower, plane, stems } = setup();
    addFlower('Cúc họa mi');
    plane.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 320, height: 400 }) as DOMRect;
    const stem = stems()[0]!;
    const left = stem.style.left;
    fireEvent.pointerDown(stem, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerDown(stem, { pointerId: 2, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(stem, { pointerId: 2, clientX: 300, clientY: 300 });
    fireEvent.pointerUp(stem, { pointerId: 2, clientX: 300, clientY: 300 });
    expect(stems()[0]!.style.left).toBe(left);
    fireEvent.pointerMove(stem, { pointerId: 1, clientX: 80, clientY: 100 });
    fireEvent.pointerUp(stem, { pointerId: 1, clientX: 80, clientY: 100 });
    expect(stems()[0]!.style.left).not.toBe(left);
    expect(stems()[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects on the next tap after a touch drag that fired no click', () => {
    const { addFlower, plane, stems } = setup();
    addFlower('Cúc họa mi');
    plane.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 320, height: 400 }) as DOMRect;
    const stem = stems()[0]!;
    fireEvent.pointerDown(stem, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(stem, { pointerId: 1, clientX: 70, clientY: 100 });
    fireEvent.pointerUp(stem, { pointerId: 1, clientX: 70, clientY: 100 });
    fireEvent.pointerDown(stem, { pointerId: 2, clientX: 70, clientY: 100 });
    fireEvent.pointerUp(stem, { pointerId: 2, clientX: 70, clientY: 100 });
    fireEvent.click(stem);
    expect(stems()[0]).toHaveAttribute('aria-pressed', 'true');
  });
});
