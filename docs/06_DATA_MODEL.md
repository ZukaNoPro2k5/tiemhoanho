# Data Model

These interfaces are conceptual contracts. Agents may refine naming, but changes that alter semantics must update this document.

```ts
type Id = string;

type ColorFamily =
  | 'pink'
  | 'red'
  | 'white'
  | 'yellow'
  | 'purple'
  | 'blue'
  | 'orange'
  | 'green'
  | 'cream';

type FlowerRole = 'focal' | 'secondary' | 'filler' | 'foliage';

type MoodTag =
  | 'romantic'
  | 'gentle'
  | 'cheerful'
  | 'elegant'
  | 'warm'
  | 'fresh'
  | 'grateful'
  | 'supportive'
  | 'playful';

interface FlowerDefinition {
  id: Id;
  nameVi: string;
  basePrice: number;
  colors: ColorFamily[];
  tags: MoodTag[];
  role: FlowerRole;
  assetId: Id;
  unlockReputation?: number;
}

interface InventoryStack {
  flowerId: Id;
  quantity: number;
  freshness: 0 | 1 | 2 | 3;
}

interface MaterialDefinition {
  id: Id;
  type: 'wrap' | 'ribbon' | 'card';
  nameVi: string;
  price: number;
  colors: ColorFamily[];
  tagModifiers?: Partial<Record<MoodTag, number>>;
  assetId: Id;
}

interface CustomerDefinition {
  id: Id;
  nameVi: string;
  avatarAssetId: Id;
  personalityTags: string[];
  favoriteFlowerIds?: Id[];
  favoriteColors?: ColorFamily[];
}

interface OrderRequest {
  id: Id;
  customerId: Id;
  occasion: string;
  budgetMin: number;
  budgetMax: number;
  desiredTags: MoodTag[];
  preferredColors: ColorFamily[];
  avoidTags?: MoodTag[];
  customerLine: string;
}

interface PlacedStem {
  instanceId: Id;
  flowerId: Id;
  x: number;
  y: number;
  rotationDeg: number;
  scale: number;
  size: 'small' | 'medium' | 'large';
  zIndex: number;
  freshnessAtUse: 0 | 1 | 2 | 3;
}

interface BouquetDraft {
  arrangementStyle: 'bouquet' | 'basket';
  nextStemSeq: number;
  stems: PlacedStem[];
  wrapId?: Id;
  ribbonId?: Id;
  cardId?: Id;
}

interface ScoreBreakdown {
  total: number;
  tags: number;
  colors: number;
  budget: number;
  freshness: number;
  structure: number;
  reasonsVi: string[];
}

interface BouquetRecord {
  id: Id;
  day: number;
  createdAt: string;
  order: OrderRequest;
  bouquet: BouquetDraft;
  price: number;
  score: ScoreBreakdown;
  reactionTier: 'delighted' | 'happy' | 'okay' | 'disappointed';
}

interface DayStats {
  day: number;
  revenue: number;
  costs: number;
  profit: number;
  averageScore: number;
  completedOrders: number;
  bestBouquetId?: Id;
}

interface GameState {
  schemaVersion: number;
  day: number;
  cash: number;
  reputation: number;
  inventory: InventoryStack[];
  currentOrderIndex: number;
  todayOrderIds: Id[];
  currentDraft: BouquetDraft;
  diary: BouquetRecord[];
  dayHistory: DayStats[];
  tutorialCompleted: boolean;
}
```

Milestone 1 implements these contracts in `src/domain/catalog.ts` and `src/domain/bouquet/types.ts`. `PlacedStem.x/y` is the flower-head position on a 4:5 plane; stems are drawn from the head to the style anchor and are not stored. `instanceId` is `flowerId#seq`. `freshnessAtUse` is always 3 until inventory exists.

## Derived data

Do not persist when it can be safely derived:

- current bouquet total price;
- computed tag weights;
- average freshness;
- satisfaction preview unless intentionally part of UX;
- unlocked item lists if they derive directly from reputation.
