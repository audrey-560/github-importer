## Plan: Replace wordmark with uploaded logo image

Swap the custom-built `GirlsGottaGolfWordmark` SVG/HTML component for the uploaded PNG logo, recolored to match the current cream/white wordmark color so it sits naturally on the dark hero frame.

### Steps

1. **Upload the logo as a Lovable Asset**
   - Register `user-uploads://hf_20260617_191545_...png` via `lovable-assets create` into `src/assets/ggg-wordmark.png.asset.json`. Keeps the binary off the repo.

2. **Rewrite `src/components/GirlsGottaGolfWordmark.tsx`**
   - Replace the SVG/spans implementation with a single `<h1>` containing a masked `<span>`:
     - `mask-image: url(<asset url>)`, `-webkit-mask-image` fallback
     - `mask-size: contain`, `mask-repeat: no-repeat`, `mask-position: center`
     - `background-color: var(--cream)` (the existing wordmark color)
     - `aspect-ratio` matching the uploaded image (~1920×820 → ~2.34)
     - Width responsive via existing `clamp()` sizing used today
   - Include an accessible `<span class="sr-only">Girls Gotta Golf</span>` for screen readers.
   - Keep the component's exported name and props signature so `GolfJourney.tsx` doesn't need changes.

3. **Trim `src/styles.css`**
   - Remove the now-unused `.ggg-ball`, `.ggg-club`, `.ggg-flag` rules.
   - Keep `.ggg-wordmark` but repurpose it to size/layout the masked element.

### Technical notes
- CSS `mask-image` with `background-color` is the cleanest way to recolor a PNG to a design token without generating new image variants — works in all modern browsers (Chrome/Safari/Firefox via `mask-image` + `-webkit-mask-image`).
- No change to copy, layout, or the rest of the hero composition.
- No data/business-logic changes.