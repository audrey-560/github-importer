## Revert wordmark to original styled text

Go back to the original CSS-styled "Girls Gotta Golf" text wordmark (white, original smaller size) and keep only two small art accents.

### Changes

1. **`src/components/GirlsGottaGolfWordmark.tsx`** — replace the current PNG-mask implementation with the original three-span text version:
   - `<h1 class="ggg-wordmark">` containing three `<span>` words: "Girls", "Gotta", "Golf".
   - In "Girls": replace the dot on the "i" with a small golf ball (white circle with subtle dimple shading) absolutely positioned above the "i".
   - In "Gotta": plain text (drop the previous golf-club-in-G treatment).
   - In "Golf": replace the final "f" with an "f" whose top hook is styled as a small triangular flag (keep the vertical stroke as the pole, add a flag shape via pseudo-element or inline SVG).
   - Keep an `sr-only` "Girls Gotta Golf" for accessibility.

2. **`src/styles.css`** — restore the original `.ggg-wordmark` typography rules:
   - Color: solid `#ffffff` (pure white, not cream).
   - Size: original `clamp()` values from the first version (smaller than current, so it no longer covers the model's head).
   - Re-add `.ggg-ball` and `.ggg-flag` helper classes for the two accents.
   - Remove the `.ggg-wordmark-mask`, `mask-image`, and cream-color rules added for the PNG approach.
   - Remove the `.ggg-club` rule (no longer used).

3. **Assets cleanup (optional, not blocking)** — `src/assets/ggg-wordmark.png.asset.json` becomes unused. Leave it in place for now; can be deleted later if you confirm.

### Out of scope
- No layout, hero image, or other section changes.
- No copy changes elsewhere on the page.

Want me to proceed?
