// TransitionPanel — the 80px seam used at every section boundary. 7 equal
// columns, each split into 3 stacked cells; cells are Onyx-1 at one of three
// flat opacities (0 / 0.05 / 1), arranged into a dithered mosaic edge (no
// gradients — a quantized approximation of one, per the flat-color rule).
// Static for now; the motion pass animates the dither later.
//
// NOTE: the exact per-cell pattern isn't pixel-sourced from Figma yet — this
// is a placeholder dither (diagonal reveal, transparent -> solid) built from
// only the three permitted opacity values. Swap MATRIX for the real export
// when available; every consumer of TransitionPanel updates automatically.
const COLS = 7
const MATRIX = [
  [0, 0, 0, 0, 0.05, 0.05, 1], // top row
  [0, 0, 0.05, 0.05, 1, 1, 1], // middle row
  [0.05, 0.05, 0.05, 1, 1, 1, 1], // bottom row
]

export default function TransitionPanel({ className = '' }) {
  return (
    <div className={`transition-panel ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: COLS }, (_, col) => (
        <div className="transition-panel__col" key={col}>
          {MATRIX.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="transition-panel__cell"
              style={{ opacity: row[col] }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
