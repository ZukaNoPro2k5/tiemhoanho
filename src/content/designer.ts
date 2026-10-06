import type { ArrangementStyle } from '../domain/bouquet/types';

export const designerCopy = {
  enter: 'Vào xếp hoa',
  back: 'Quay lại',
  title: 'Xếp hoa',
  styleGroupLabel: 'Kiểu dáng',
  styles: { bouquet: 'Bó', basket: 'Lẵng' } satisfies Record<
    ArrangementStyle,
    string
  >,
  restyled: {
    bouquet: 'Đã xếp lại theo dáng bó',
    basket: 'Đã xếp lại theo dáng lẵng',
  } satisfies Record<ArrangementStyle, string>,
  planeLabel: 'Khung xếp hoa',
  emptyHint: 'Chạm một bông hoa bên dưới để bắt đầu',
  full: (max: number) =>
    `Bó đã đủ ${max} cành — chọn một bông để xoá nếu muốn đổi.`,
  stemCount: (count: number, max: number) => `${count}/${max} cành`,
  stemLabel: (name: string, position: number) => `${name}, cành ${position}`,
  usedCount: (count: number) => `×${count}`,
  trayLabel: 'Khay hoa',
  wrapLabel: 'Giấy gói',
  /** Short visible swatch names; the full nameVi stays the accessible name. */
  wrapShort: {
    'wrap-cream': 'Kem',
    'wrap-blush': 'Hồng phấn',
    'wrap-kraft': 'Kraft',
  } as Record<string, string>,
  undo: 'Hoàn tác',
  clear: 'Làm lại',
  actionsLabel: 'Chỉnh bông đang chọn',
  actions: {
    rotateLeft: 'Xoay trái',
    rotateRight: 'Xoay phải',
    smaller: 'Nhỏ lại',
    larger: 'To lên',
    forward: 'Lên trước',
    backward: 'Ra sau',
    remove: 'Xoá',
  },
} as const;
