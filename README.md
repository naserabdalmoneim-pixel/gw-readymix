# Muhajir AlMuttahida Company For Contracting static site

Static site export for Muhajir AlMuttahida Company For Contracting.

## Structure

- `index.html` - homepage served by GitHub Pages.
- `index.php/` - static page paths exported from the original WordPress site.
- `wp-content/` and `wp-includes/` - frontend assets required by the exported pages.
- `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll` - publishing and crawler support files.

## Maintenance Notes

- This repository is a static export, so directory names and relative paths should be changed carefully.
- Contact email addresses and phone numbers are preserved intentionally and should not be changed unless requested explicitly.
- Media that is not used by the live pages is archived under `wp-content/uploads/archive-unused/` instead of being deleted permanently.
