# SPEC — Scenario 1 "Refined" with theme presets

Chosen by the user on 2026-11-17 among three redesign scenarios. Mock-up: `design/mockups/restyle/` (screens) and
`design/mockups/restyle/themes.js` (theme presets). This spec maps it onto the real front end in `src-ui/`.

Goal: same structure, routes, screens and behaviour as today; a new visual language (type, icons, colours,
spacing, controls) and a per-user choice of five theme presets in Settings. Nothing is removed: the existing
dark-mode and theme-colour settings keep working and combine with the preset.

## 1. Navigation and routes

No change. Every route in `src-ui/src/app/app-routing.module.ts` keeps its path, component and guards; the sidebar
keeps its items, order, "hidden items" and slim mode. Old route → new route is the identity, so nothing is lost
(the 72 features in `design/mockups/shared/features.js` all stay where they are today).

## 2. Settings: the new "Theme" control

Settings → General → Appearance (`src-ui/src/app/components/admin/settings/settings.component.html`, the rows
"Dark mode" and "Theme Color", ~lines 134–157):

| Today                                                | After                                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| —                                                    | **Theme**: a radio group of five cards (preview swatch, name, one-line note)      |
| Dark mode: "Use system settings", "Enable dark mode" | unchanged (shown as today; label stays "Dark mode")                               |
| "Invert thumbnails in dark mode"                     | unchanged                                                                         |
| Theme Color + Reset                                  | unchanged; label "Theme Color" kept, help text: overrides the theme's main colour |

- New UI setting key `SETTINGS_KEYS.THEME_PRESET = 'general-settings:theme:preset'` in
  `src-ui/src/app/data/ui-settings.ts`, type `string`, values `refined | classic | slate | paper | contrast`,
  **default `refined`**. Unknown values fall back to `refined`.
- Stored like every other UI setting, in the user's `UiSettings.settings` JSON (`src/documents/models.py:831`): no
  back-end change, no migration [verified: `settings = models.JSONField(null=True)`]. Being per user, the personal
  and the company account can use different themes.
- Live preview before saving, exactly like dark mode and colour today: the form's `valueChanges` subscription in
  `settings.component.ts` (~line 458) passes the preset to `SettingsService.updateAppearanceSettings`, and the
  "unsaved changes → revert on leave" path (~line 488) restores it.
- New component `pngx-theme-picker` (`src-ui/src/app/components/common/input/theme-picker/`), a
  `ControlValueAccessor` like the other `pngx-input-*` controls: keyboard-operable radio group
  (`role="radiogroup"`, arrow keys), the swatch drawn with CSS from the preset's tokens (no images).

## 3. Applying a theme

`SettingsService.updateAppearanceSettings(darkModeUseSystem, darkModeEnabled, themeColor, themePreset)`
(`src-ui/src/app/services/settings.service.ts:460`) gains a fourth parameter (defaulting to the stored setting) and
sets `data-pngx-theme="<preset>"` on `<html>`, next to the existing `data-bs-theme`. It also exposes the current
preset as a signal (`themePreset`) for the icon component (§5).

Order of precedence, unchanged in spirit: preset tokens → dark/light values of that preset → the user's Theme
Color (still applied as inline `--pngx-primary` / `--pngx-primary-lightness` on `<html>`, which beats the
attribute selectors) → `primary-light` / `primary-dark` contrast classes, as today.

Before Angular has loaded the settings, `<html>` has no `data-pngx-theme`: the default look (`refined`) applies, so
there is no flash for most users; a `classic` user sees the new look for a moment, then today's.

## 4. Design tokens → theme files

New folder `src-ui/src/themes/`, loaded by **one** line at the end of `src-ui/src/styles.scss`
(`@include meta.load-css("themes/index")`), so upstream changes to `theme.scss` / `styles.scss` merge cleanly.

- `themes/_presets.scss`: one map per preset with light and dark values, and a mixin that emits, for each preset,
  `[data-pngx-theme=X]`, `[data-pngx-theme=X][data-bs-theme=dark]` and the
  `[data-bs-theme=auto]` + `prefers-color-scheme: dark` variant (the same three cases `theme.scss` handles today).
  Tokens set per preset: `--pngx-primary` (H, S) and `--pngx-primary-lightness`, `--bs-body-bg`, `--bs-body-color`,
  `--bs-secondary-color`, `--bs-border-color`, `--pngx-bg-alt`, `--pngx-bg-alt2`, `--pngx-bg-darker`,
  `--bs-tertiary-bg`, `--bs-light`, `--bs-body-font-family`, new `--pngx-heading-font-family`,
  new `--pngx-navbar-bg` / `--pngx-navbar-color`, `--bs-border-radius` (+ `-sm`, `-lg`), new `--pngx-radius-control`,
  `--pngx-radius-pill`, new `--pngx-shadow-card`, `--bs-body-font-size` (contrast only). The `*-rgb` twins
  Bootstrap needs are written next to each colour.
  Values: those of `design/mockups/restyle/themes.js` (source of truth for colours, fonts and radii).
- `themes/_refined.scss`: the visual language of the mock-up (`design/mockups/restyle/style.css`), written as
  overrides of Bootstrap/Paperless classes and **scoped to `:root:not([data-pngx-theme="classic"])`**, so the
  Classic preset is byte-for-byte today's look:
  - navbar: `.navbar.bg-primary` uses `--pngx-navbar-bg` / `--pngx-navbar-color` (light bar in Refined and Paper,
    dark in Slate, black in High contrast); global search field pill-shaped; Upload button = primary pill;
  - sidebar (`app-frame.component.*`): items as rounded pills, active item = surface + shadow + primary text;
    section headings 10.5 px uppercase with letter-spacing;
  - cards (`.card`): no border, `--pngx-shadow-card`, `--bs-border-radius-lg`; dashboard widgets the same;
  - tables: uppercase 11 px header, row hover, selected row in primary-soft; links in titles inherit text colour;
  - buttons and inputs: `--pngx-radius-control`; `.btn-group` / `.nav-tabs` / `.nav-pills` as segmented controls;
  - tags (`pngx-tag`): pill badge with a colour dot, tinted background from the tag colour (`color-mix`);
  - headings use `--pngx-heading-font-family`; base size 14.5 px (15.5 px in High contrast);
  - High contrast extra: underlined links, 1.5 px borders, 3 px focus ring.
- Hard-coded colours in component styles that would fight the presets — `app-frame.component.scss` (12),
  `global-search.component.scss` (8), `pdf-viewer.component.scss` (5), `tag.component.scss` (2), four files with
  one each [verified by grep] — are replaced by tokens only where a preset needs it; the default values of the new
  tokens equal today's colours, so Classic is unchanged.
- `print.scss` untouched (print stays as today).

Fonts, self-hosted (no requests to external hosts; the app is self-hosted and may run offline):
`@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/fraunces`,
`@fontsource-variable/instrument-sans` (OFL-1.1 [verified on npm]), Latin subset only, imported in
`themes/_fonts.scss`. Browsers only download the faces a preset actually uses. Pin versions published at least two
weeks before the install.

## 5. Icons

`pngx-bs-icon` (`src-ui/src/app/components/common/bootstrap-icon/`) stays the only icon component and keeps its
selector and inputs, so no template changes. It renders from the **line set** for every preset except Classic, which
keeps Bootstrap Icons.

- New registry `icons-line.ts` beside `icons.ts`: for each of the 156 names registered today, the matching
  `lucide-static` SVG (ISC [verified on npm]); imports use the existing `.svg: text` loader (`angular.json`).
- Names with no good Lucide match fall back to the Bootstrap icon (logged once in dev mode, not per render).
- The component reads `SettingsService.themePreset` (signal) and picks the registry; the `effect` already re-renders
  on input change and will also re-run on preset change.
- Lucide uses `stroke="currentColor"` on a 24 px box; the component sets `stroke-width: 1.75` via CSS and keeps the
  width/height inputs, so sizes match today's.
- Bundle: the two registries are both in the initial bundle (~156 small SVG strings each); check the production
  build stays under the existing budget (`angular.json`: warning 2 MB).

## 6. Screens

Every screen keeps its components; only global styles and the components below change.

| Component                                                              | Reuse / change / new                               |
| ---------------------------------------------------------------------- | -------------------------------------------------- |
| `app-frame` (navbar, sidebar)                                          | change: styles via tokens; markup unchanged        |
| `global-search`                                                        | change: styles via tokens                          |
| dashboard + widgets                                                    | reuse; restyled by global card rules               |
| document list, cards (small/large), table, bulk editor, filter editor  | reuse; global rules                                |
| document detail (tabs, preview, metadata, notes, history, permissions) | reuse; global rules                                |
| `pngx-tag`                                                             | change: pill + dot style under non-Classic presets |
| `pngx-bs-icon`                                                         | change: icon set chosen by preset                  |
| settings component                                                     | change: Theme row + form control + live preview    |
| `pngx-theme-picker`                                                    | new                                                |
| all admin, management and dialog components                            | reuse; global rules                                |

## 7. States

- Loading: the existing loading states and spinners, restyled by tokens only.
- Empty: unchanged texts and layouts.
- Error: toast colours come from the preset (`--pngx-toast-*` defined per preset in light/dark); error red keeps
  sufficient contrast in every preset (WCAG AA 4.5:1 for text — checked for each preset's light and dark values).
- Settings not yet loaded: default preset `refined` (§3).
- Unknown preset in stored settings (e.g. a later downgrade): treated as `refined`.

## 8. Behaviour that changes

Only the appearance, plus one new UI setting. No API, model, permission, routing or workflow change. Existing users
get the Refined look on upgrade; Classic restores today's look.

## 9. Tests and checks

- Jest: `ui-settings` default; `SettingsService.updateAppearanceSettings` sets `data-pngx-theme` and falls back on
  unknown values; settings component live preview and revert; `pngx-theme-picker` value + keyboard; icon component
  picks the line set, falls back to Bootstrap for unmapped names, re-renders on preset change.
- Playwright e2e (`src-ui/e2e/`): open Settings, pick each preset, assert the attribute and a computed colour.
- Visual check: run the app, screenshot dashboard, document list, document detail and settings in every preset,
  light and dark, desktop and 390 px; compare with the mock-up.
- `pnpm test`, `pnpm lint`, production build within budget.

## 10. Out of scope

- Structural changes (scenarios 2 and 3).
- Per-preset icon sets beyond "line" vs "Bootstrap"; user-defined themes beyond the existing accent colour.
- Back-end and email templates, the Django admin, the login page served by Django (`src/documents/templates/`)
  — they keep today's look [verified: `paperless-ngx/base.html` loads `bootstrap.min.css` and `base.css`, not the Angular styles].
- Translations: new strings go through the normal i18n extraction; Italian comes from Crowdin as today.

## Upstream impact

Small, deliberate surface: one line in `styles.scss`, a new `src/themes/` folder, a new registry and a few lines in
`pngx-bs-icon`, the settings component and service (one row, one key, one parameter), token substitutions in a
handful of component SCSS files, four font packages and `lucide-static` in `package.json`. Upstream edits to
templates and components merge without conflicts unless they touch these lines.
