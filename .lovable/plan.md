## Plan

### 1. Update founder story on home page
Replace the current founder quote in `src/routes/index.tsx` with your exact text:
> “I picked up golf in 2022 and quickly realized how hard it was to find girlfriends to play with. Girls Gotta Golf is my way of building the community I wish I had when I started. A place to learn the game, meet other women, and complete the perfect weekend plan.”

### 2. Add back-to-home link on Join page
Insert a small “← Back to home” text link above the form heading in `src/routes/join.tsx`.

### 3. Generate favicon & OG image
- Create a favicon from your existing logo (`public/assets/stills/logo-green.png`)
- Create a branded `og:image` (1200×630) for social sharing
- Wire both into `src/routes/__root.tsx` via `head()` links/meta tags

### 4. Verify signup form end-to-end
- Confirm the `signups` table, RLS policy, and GRANTs are in place (migration already exists)
- Submit a test entry to ensure the server function and insert work

### 5. Mobile smoke test
- Scroll through the landing journey and confirm readability
- Test the Join form on a narrow viewport

### 6. Publish the website
Once steps 1–5 pass, publish to make the site live.

---

**Open question for you:**
Do you want the founder quote to be in quotation marks (as a direct quote from you) or plain paragraph text? I can style it either way.