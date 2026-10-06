export type Id = string;

export type ColorFamily =
  | 'pink'
  | 'red'
  | 'white'
  | 'yellow'
  | 'purple'
  | 'blue'
  | 'orange'
  | 'green'
  | 'cream';

export type FlowerRole = 'focal' | 'secondary' | 'filler' | 'foliage';

export type MoodTag =
  | 'romantic'
  | 'gentle'
  | 'cheerful'
  | 'elegant'
  | 'warm'
  | 'fresh'
  | 'grateful'
  | 'supportive'
  | 'playful';

export interface FlowerDefinition {
  id: Id;
  nameVi: string;
  basePrice: number;
  colors: ColorFamily[];
  tags: MoodTag[];
  role: FlowerRole;
  assetId: Id;
  unlockReputation?: number;
}

export interface MaterialDefinition {
  id: Id;
  type: 'wrap' | 'ribbon' | 'card';
  nameVi: string;
  price: number;
  colors: ColorFamily[];
  tagModifiers?: Partial<Record<MoodTag, number>>;
  assetId: Id;
}
