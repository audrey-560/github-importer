### What to change

1. **src/components/GolfJourney.tsx** — Replace the current `<svg>` inside `<h1>` with the exact SVG code you provided:
   - Text fill: `#f9f2ea` (cream)
   - Ball gradient: `#ffffff` → `#f9f2ea` → `#e7dccd`
   - Ball dimples: `#cdbfa9` at opacity `0.6`
   - No flag element

2. **src/styles.css** — No change needed. The `.beat h1 .wordmark` rule is already present at line 217 with the exact sizing you specified:
   ```css
   .beat h1 .wordmark {
     display: block;
     width: clamp(320px, 78vw, 1020px);
     height: auto;
     margin: 0 auto;
     overflow: visible;
   }
   ```