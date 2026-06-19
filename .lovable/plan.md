## Plan: Final checks + publish

1. **Backend health check** — run `supabase--cloud_status` to confirm Lovable Cloud is healthy, and confirm the `signups` table is reachable with a quick read.
2. **Signup smoke test** — submit a test entry via the live `/join` form (or directly invoke the server function) and confirm it landed in the `signups` table. Delete the test row afterward.
3. **Mobile check** — open the preview at mobile viewport (390×844), scroll through the landing journey, story section, and Join form. Screenshot anything that looks off; fix obvious issues (overflow, text sizing, tap targets).
4. **Security scan** — run a security scan and confirm no critical findings before publishing.
5. **Publish** — call `preview_ui--publish` with the metadata preflight (title, description, OG tags, favicon, og:image already in place).

I'll report mobile findings and the test-signup result before hitting publish, and stop if anything looks broken.