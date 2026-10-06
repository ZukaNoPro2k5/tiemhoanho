import type { Id } from '../../domain/catalog';

/** Temporary flat flower heads, drawn in a 100x100 box centered at 50,50. */
function Petals({
  count,
  rx,
  ry,
  distance,
  className,
}: {
  count: number;
  rx: number;
  ry: number;
  distance: number;
  className: string;
}) {
  return (
    <g className={className}>
      {Array.from({ length: count }, (_, index) => (
        <ellipse
          key={index}
          cx="50"
          cy={50 - distance}
          rx={rx}
          ry={ry}
          transform={`rotate(${(360 / count) * index} 50 50)`}
        />
      ))}
    </g>
  );
}

const art: Record<Id, () => React.JSX.Element> = {
  'flower-red-rose': () => (
    <>
      <Petals count={6} rx={16} ry={20} distance={14} className="art-red" />
      <circle cx="50" cy="50" r="18" className="art-red-deep" />
      <path d="M41 50Q50 38 59 50Q50 60 41 50Z" className="art-red" />
    </>
  ),
  'flower-pink-tulip': () => (
    <>
      <path d="M30 34Q50 22 70 34L66 70Q50 80 34 70Z" className="art-pink" />
      <path d="M36 30L44 46L50 26L56 46L64 30" className="art-pink-deep" />
    </>
  ),
  'flower-sunflower': () => (
    <>
      <Petals count={14} rx={7} ry={16} distance={26} className="art-yellow" />
      <circle cx="50" cy="50" r="20" className="art-seed" />
    </>
  ),
  'flower-daisy': () => (
    <>
      <Petals count={12} rx={6} ry={15} distance={22} className="art-white" />
      <circle cx="50" cy="50" r="11" className="art-yellow" />
    </>
  ),
  'flower-babys-breath': () => (
    <g className="art-white">
      {[
        [50, 30],
        [34, 44],
        [66, 44],
        [42, 62],
        [58, 62],
        [50, 48],
        [26, 60],
        [74, 60],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" />
      ))}
    </g>
  ),
  'flower-eucalyptus': () => (
    <g className="art-leaf">
      {[18, 36, 54, 72].map((cy, index) => (
        <ellipse
          key={cy}
          cx={index % 2 === 0 ? 40 : 60}
          cy={cy}
          rx="13"
          ry="9"
        />
      ))}
    </g>
  ),
};

export function FlowerArt({ assetId }: { assetId: Id }) {
  const Art = art[assetId];
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {Art ? <Art /> : <circle cx="50" cy="50" r="30" className="art-pink" />}
    </svg>
  );
}
