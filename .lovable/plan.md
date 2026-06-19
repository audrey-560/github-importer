## Goal
Replace the current `GirlsGottaGolfWordmark` component on the landing page with an inline SVG wordmark that the user provided, sized and styled exactly as specified.

## Changes

### 1. `src/components/GolfJourney.tsx`
Replace the existing `<h1><GirlsGottaGolfWordmark /></h1>` block with the user's SVG wordmark.
- Text fill: `#ffffff` (pure white) per user confirmation — not the cream `#f9f2ea` from the original SVG snippet.
- Ball highlight dots and flag stroke/fill also updated to `#ffffff`.
- Keep `role="img"`, `aria-label="Girls Gotta Golf"`, and `className="wordmark"`.
- Remove the import for `GirlsGottaGolfWordmark`.

### 2. `src/styles.css`
Add the `.beat h1 .wordmark` rule immediately after the `.beat h1 { … }` block:
```css
.beat h1 .wordmark {
  display: block;
  width: clamp(320px, 78vw, 1020px);
  height: auto;
  margin: 0 auto;
  overflow: visible;
}
```

### 3. Cleanup
- Delete `src/components/GirlsGottaGolfWordmark.tsx` — no longer used anywhere in the codebase.
- Remove all `.ggg-*` CSS rules from `src/styles.css` (`.ggg-wordmark`, `.ggg-word`, `.ggg-i`, `.ggg-i-stem`, `.ggg-ball`, `.ggg-f`, `.ggg-flag`).
