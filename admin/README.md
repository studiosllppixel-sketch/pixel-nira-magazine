# Editorial Studio setup

This admin UI is kept separate from the public magazine navigation.

## Included
- Supabase email/password sign-in.
- Separate Nira Editorial and Pixel Studios page drafts.
- Click-to-select and drag-position text/images; width and X/Y controls.
- Fonts, type size, text colour, image URL, crop fit, focal point, scale and filters.
- Desktop/mobile preview, layout presets, undo history, draft save and explicit publish.
- Brand-scoped media uploads and media library.

## Required before end-to-end use
1. Create a NEW Supabase project for this repository. Do not point it at the old pixel project's database.
2. Apply supabase/migrations/202610110001_magazine_editor.sql.
3. Create your admin user in Supabase Auth and assign app_metadata role = admin through a trusted admin/server interface. Never use editable user_metadata for authorization.
4. Create a PRIVATE Storage bucket named editorial-media.
5. Add the new project's URL and publishable/anon key to admin/config.js. Never expose a service-role/secret key in browser code.
6. Connect this repository to a separate Vercel project when ready; deployment is not performed automatically.

## Important
- Public pages must query only published rows and render published_content, never draft_content.
- Media previews use signed URLs for the private bucket. Signed URLs expire; generate fresh ones when loading assets.
- The homepage is still a static concept until it is connected to this database. Publishing from the admin saves the published content but does not magically update the static homepage.
- Add upload size/type validation and test row-level security before production use.
