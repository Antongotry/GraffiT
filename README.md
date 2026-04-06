# GraffiT WordPress Theme

Starter theme for the GraffiT website.

## Structure

- `functions.php` + `inc/setup.php` bootstrap the theme and frontend assets.
- `page-services.php` renders the static `/services/` page.
- `template-parts/` contains reusable layout, section, and component partials.
- `assets/scss/` follows the layered structure from the reference project.

## Sizing Rules

- Desktop: translate design pixels to `vw` relative to `1440`.
- Mobile up to `1024px`: translate design pixels to `vw` relative to `375`.
- Technical values such as `1px` borders can remain in `px`.

## Scripts

```bash
npm install
npm run dev
```

