import { shellCopy } from '../content/shell';

/** Decorative foundation art only; no bouquet data or composition logic. */
export function ShopScene() {
  return (
    <svg
      className="shop-art"
      viewBox="0 0 342 334"
      role="img"
      aria-label={shellCopy.sceneLabel}
    >
      <defs>
        <g id="shop-flower">
          <path
            d="M0 0V38M0 22Q-17 7-17 18Q-10 31 0 25M0 29Q15 13 16 22Q13 34 0 33"
            className="scene-stem"
          />
          <g className="scene-rose">
            <ellipse cy="-7" rx="5" ry="9" />
            <ellipse cy="-7" rx="5" ry="9" transform="rotate(72)" />
            <ellipse cy="-7" rx="5" ry="9" transform="rotate(144)" />
            <ellipse cy="-7" rx="5" ry="9" transform="rotate(216)" />
            <ellipse cy="-7" rx="5" ry="9" transform="rotate(288)" />
          </g>
          <circle r="4" className="scene-butter" />
        </g>
        <clipPath id="shop-window">
          <path d="M59 133Q59 89 107 89Q155 89 155 133V224H59Z" />
        </clipPath>
      </defs>
      <path
        d="M16 300C12 284 21 269 27 250V90C27 33 79 13 157 17C248 4 315 41 318 98V262C339 289 326 307 302 310H44Z"
        className="scene-cream"
      />
      <ellipse
        cx="172"
        cy="308"
        rx="144"
        ry="10"
        className="scene-sage"
        opacity="0.45"
      />
      <path d="M36 102V291H306V102" className="scene-paper" />
      <path d="M36 102V291H306V102" className="scene-line" />
      <rect
        x="75"
        y="28"
        width="192"
        height="44"
        rx="5"
        className="scene-paper"
      />
      <rect
        x="75"
        y="28"
        width="192"
        height="44"
        rx="5"
        className="scene-line"
      />
      <path d="M87 35H255M87 65H255" className="scene-line" opacity="0.4" />
      <text
        x="171"
        y="56"
        fontSize="21"
        textAnchor="middle"
        className="scene-lettering"
      >
        {shellCopy.shopSign}
      </text>
      <path d="M32 81H310L321 105H21Z" className="scene-rose" />
      <path
        d="M57 81H82L77 105H50ZM108 81H133L131 105H105ZM159 81H184V105H158ZM210 81H235L240 105H213ZM261 81H286L297 105H270Z"
        className="scene-paper"
      />
      <path
        d="M21 105H321V113Q308 132 296 113Q282 132 269 113Q255 132 242 113Q228 132 215 113Q201 132 188 113Q174 132 161 113Q147 132 134 113Q120 132 107 113Q93 132 80 113Q66 132 53 113Q36 132 21 113Z"
        className="scene-rose"
      />
      <path d="M21 105H321" className="scene-line" />
      <path
        d="M59 133Q59 89 107 89Q155 89 155 133V224H59Z"
        className="scene-sage"
      />
      <g clipPath="url(#shop-window)">
        <path
          d="M62 94L123 230H156L89 90Z"
          className="scene-paper"
          opacity="0.4"
        />
        <path d="M49 153H161M107 99V224" className="scene-line" />
        <path
          d="M63 153Q78 168 90 153M124 153Q140 168 151 153"
          className="scene-line"
        />
      </g>
      <path
        d="M59 133Q59 89 107 89Q155 89 155 133V224H59Z"
        className="scene-line"
      />
      <rect
        x="51"
        y="222"
        width="112"
        height="8"
        rx="2"
        className="scene-peach"
      />
      <path
        d="M190 286V146Q190 123 232 123Q274 123 274 146V286Z"
        className="scene-leaf"
      />
      <path
        d="M201 207V147Q201 133 232 133Q263 133 263 147V207Z"
        className="scene-sage"
      />
      <path
        d="M201 207V147Q201 133 232 133Q263 133 263 147V207ZM201 222H263V275H201Z"
        className="scene-line"
      />
      <path
        d="M218 139L246 203H259L231 134Z"
        className="scene-paper"
        opacity="0.35"
      />
      <circle cx="260" cy="216" r="3" className="scene-butter" />
      <path d="M179 289H285L293 299H171Z" className="scene-peach" />
      <path d="M177 299H287" className="scene-line" />
      <rect
        x="63"
        y="160"
        width="88"
        height="28"
        rx="2"
        className="scene-paper"
        transform="rotate(-4 107 174)"
      />
      <text
        x="107"
        y="177"
        fontSize="7.7"
        textAnchor="middle"
        className="scene-lettering"
        transform="rotate(-4 107 174)"
      >
        {shellCopy.windowNote}
      </text>
      <path
        d="M46 281H152V288H46ZM55 252H145V260H55Z"
        className="scene-peach"
      />
      <path d="M52 260V302M146 260V302" className="scene-line" />
      <use href="#shop-flower" x="71" y="216" />
      <use href="#shop-flower" x="92" y="205" />
      <use href="#shop-flower" x="112" y="219" />
      <path d="M67 238H115L109 254H73Z" className="scene-sage" />
      <path
        d="M124 246Q114 224 125 212Q140 223 131 246M128 244Q139 221 147 225Q152 239 128 244"
        className="scene-leaf"
      />
      <path d="M118 244H141L137 254H122Z" className="scene-rose" />
      <use href="#shop-flower" x="60" y="263" transform="rotate(-8 60 263)" />
      <use href="#shop-flower" x="85" y="260" />
      <path d="M49 278H92L87 299H55Z" className="scene-peach" />
      <path
        d="M289 283Q271 249 289 228Q307 247 291 282M291 278Q305 252 317 255Q325 273 291 283"
        className="scene-leaf"
      />
      <path d="M275 278H308L303 301H280Z" className="scene-rose-deep" />
      <path d="M280 283H303M62 284H83" className="scene-line" />
      <path
        d="M19 231Q11 220 18 214Q26 218 19 231M22 242Q35 229 38 237Q34 246 22 242"
        className="scene-sage"
      />
      <path d="M20 250L19 231" className="scene-stem" />
    </svg>
  );
}
