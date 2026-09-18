/** The masthead's chart glyph, reused so the admin is visibly the same site. */
export default function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" width={size} height={size}>
      <path
        d="M3 23h3.5v-5h5v8h4.5V13h4v7h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
