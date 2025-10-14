/**
 * Design constants — single source of truth for desktop / mobile values.
 * These map directly to Figma specs and are referenced by CSS custom properties.
 *
 * Format: [mobile, desktop] in px unless noted otherwise.
 */

const design = {
  typography: {
    hero:    { mobile: 54, desktop: 96 },
    h2:     { mobile: 48, desktop: 58 },
    h3:     { mobile: 36, desktop: 36 },
    h4:     { mobile: 20, desktop: 30 },
    h5:     { mobile: 18, desktop: 22 },
    body:   { mobile: 14, desktop: 18 },
    body2:  { mobile: 16, desktop: 18 },
    body3:  { mobile: 16, desktop: 16 },
    bodySm: { mobile: 13, desktop: 16 },
    caption:{ mobile: 11, desktop: 14 },
    btn:    { mobile: 10, desktop: 12 },
    ticker: { mobile: 28, desktop: 96 },
  },
}

export default design
