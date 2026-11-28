# Bruggeman Digital — Design System (`DESIGN.md`)

## Brand Identity & Positioning
- **Brand:** Bruggeman Digital (`https://www.bruggemandigital.nl`)
- **Positioning:** Praktische AI & automatisering (hoofdaanbod), procesverbetering, maatwerksoftware/webtools, websites en data-overzicht voor Nederlandse ondernemers, ZZP'ers en het MKB — technologie-neutraal, offerte op basis van scope, eigendom waar van toepassing, en geen verplicht onderhoudsabonnement.
- **Aesthetic Direction:** Dutch digital craftsmanship — crisp editorial hierarchy, generous whitespace, visual-first product cards & bento UI previews, zero AI buzzword fluff or neon gradients.
- **Language:** Dutch (`nl`), direct, grounded, practical tone.

## Color Palette
- **Primary Deep Navy:** `#13294B` (`--navy`, dark section surfaces `#0B1B33` / `#081426`, subtle tint `#EEF3F9` with border `#D5E0EE`)
- **Primary Accent Orange:** `#FF6A2B` (`--orange` decorative accents), `#C2410C` (`--orange-cta`, WCAG 2.1 AA interactive buttons & links), `#9A3412` (hover), `#FFF4EE` (light tint), `#FF9E6D` (accent on dark navy)
- **Neutrals:** Page background `#F7F8FA`, surface cards `#FFFFFF`, primary ink `#14181F`, muted secondary ink `#525B68`, borders `#E2E6EE` / `#CBD3E1`
- **Status / Confirmation:** Emerald `#047857`, soft background `#ECFDF5`, border `#A7F3D0`

## Typography
- **Display & Headings (`--font-sans`):** `Plus Jakarta Sans` (`700–800`, tight tracking `-0.025em`, `line-height: 1.2`, `text-wrap: balance`)
- **Body Copy (`--font-body`):** `Inter` (`400–600`, `1rem`, `line-height: 1.65`)
- **Technical Labels / Metrics (`--font-mono`):** `JetBrains Mono` (`0.72rem–0.8rem`, uppercase overlines with `0.09em` tracking)
- All fonts are self-hosted WOFF2 (zero external Google Fonts requests).

## Layout, Spacing & Elevation
- **Max Container Width:** `1120px` with responsive horizontal padding `clamp(1.25rem, 4vw, 2rem)`.
- **Border Radii:** `8px` (`--radius-sm` inputs/tags), `12px` (`--radius-md` buttons/inner UI rows), `16px` (`--radius-lg` cards), `20px` (`--radius-xl` hero stage & showcase containers).
- **Shadows:** Soft navy-tinted elevation (`0 12px 28px -6px rgba(19, 41, 75, 0.08)` for cards; `0 4px 12px rgba(194, 65, 12, 0.22)` for primary orange CTAs).
- **Section Rhythm:** Alternate clean light (`#F7F8FA`), pure white (`#FFFFFF`), and deep navy (`#13294B`) bands to create visual breathing room and minimize walls of text.

## Core UI Components
- **Sticky Header:** Translucent white (`rgba(255,255,255,0.95)`, `backdrop-filter: blur(12px)`), 72px height, wordmark + 6 concise nav links + single primary orange CTA.
- **Interactive Product Stage (Hero):** Tabbed dark-navy showcase card demonstrating illustrative examples (`AI & Flows`, `Software & Web`, `Data-overzicht`) with explicit demo/illustrative labels and founder trust bar.
- **Visual Bento Cards:** 2×2 grid pairing a crisp mini UI mockup at the top with a numbered title (`01`–`04`), 1–2 line description, and 3 concise pill tags.
- **Example Cards:** Split browser/app wireframe preview paired with 3 qualitative summary boxes and 1 action link.
- **Offer Cards:** 3-column grid highlighting the primary `AI & automatisering` card in Deep Navy with orange CTA (scope-based quotes, no fixed public prices).
- **Accessibility & Privacy Rules:** WCAG 2.1 AA contrast, full keyboard navigation & focus rings (`2px solid #C2410C`), zero tracking cookies, and public location always shown as `Hoek van Holland, Nederland` (never street or postal code).
