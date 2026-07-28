// Canonical radial-label geometry, shared by ChallengeCloud and the faded echo
// in StructureReveal. Pure functions — no DOM, no React — so they're trivially
// testable and reusable.

// For N labels, return one spoke descriptor per label. Render each inside a
// <g transform={`translate(cx,cy)`}> so rotations are about the origin.
//   A            angle in degrees, SVG-clockwise, i=0 at 12 o'clock
//   flip         left half → would be upside-down, so rotate 180 + anchor end
//   anchor       text-anchor ("start" | "end")
//   textTransform transform to place the label at the rim, upright, reading outward
export function radialSpokes(labels, rText) {
  const N = labels.length
  return labels.map((label, i) => {
    const A = -90 + (360 / N) * i
    const Anorm = ((A % 360) + 360) % 360
    const flip = Anorm > 90 && Anorm < 270
    const anchor = flip ? 'end' : 'start'
    const textTransform = flip
      ? `translate(${rText},0) rotate(180)`
      : `translate(${rText},0)`
    return { label, i, A, flip, anchor, textTransform }
  })
}

// Greedy word-wrap into <= maxChars-per-line lines, for manual SVG tspan breaks.
export function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let cur = ''
  for (const w of words) {
    if (!cur) cur = w
    else if ((cur + ' ' + w).length <= maxChars) cur += ' ' + w
    else { lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  return lines
}
