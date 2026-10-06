import type { FlowerDefinition, Id } from '../domain/catalog';

/** Milestone 1 prototype set. Prices are provisional balance values. */
export const flowers: readonly FlowerDefinition[] = [
  {
    id: 'red-rose',
    nameVi: 'Hồng đỏ',
    basePrice: 30000,
    colors: ['red'],
    tags: ['romantic', 'warm'],
    role: 'focal',
    assetId: 'flower-red-rose',
  },
  {
    id: 'pink-tulip',
    nameVi: 'Tulip hồng',
    basePrice: 28000,
    colors: ['pink'],
    tags: ['gentle', 'romantic'],
    role: 'focal',
    assetId: 'flower-pink-tulip',
  },
  {
    id: 'sunflower',
    nameVi: 'Hướng dương',
    basePrice: 35000,
    colors: ['yellow'],
    tags: ['cheerful', 'supportive', 'warm'],
    role: 'focal',
    assetId: 'flower-sunflower',
  },
  {
    id: 'daisy',
    nameVi: 'Cúc họa mi',
    basePrice: 15000,
    colors: ['white', 'yellow'],
    tags: ['fresh', 'gentle', 'cheerful'],
    role: 'secondary',
    assetId: 'flower-daisy',
  },
  {
    id: 'babys-breath',
    nameVi: "Baby's breath",
    basePrice: 12000,
    colors: ['white'],
    tags: ['gentle', 'fresh'],
    role: 'filler',
    assetId: 'flower-babys-breath',
  },
  {
    id: 'eucalyptus',
    nameVi: 'Eucalyptus',
    basePrice: 10000,
    colors: ['green'],
    tags: ['fresh', 'elegant'],
    role: 'foliage',
    assetId: 'flower-eucalyptus',
  },
];

export const flowersById: Readonly<Record<Id, FlowerDefinition>> =
  Object.fromEntries(flowers.map((flower) => [flower.id, flower]));
