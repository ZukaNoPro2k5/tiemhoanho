import type { MaterialDefinition } from '../domain/catalog';

/** Bó wraps for Milestone 1. Lẵng uses a single basket drawn as style art. */
export const wraps: readonly MaterialDefinition[] = [
  {
    id: 'wrap-cream',
    type: 'wrap',
    nameVi: 'Giấy kem',
    price: 15000,
    colors: ['cream'],
    assetId: 'wrap-cream',
  },
  {
    id: 'wrap-blush',
    type: 'wrap',
    nameVi: 'Giấy hồng phấn',
    price: 15000,
    colors: ['pink'],
    assetId: 'wrap-blush',
  },
  {
    id: 'wrap-kraft',
    type: 'wrap',
    nameVi: 'Giấy kraft',
    price: 12000,
    colors: ['cream'],
    assetId: 'wrap-kraft',
  },
];

export const defaultWrapId = 'wrap-cream';
