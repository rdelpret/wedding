# Design: Dress Code Page, Travel Update, Homepage Announcement Popup

Date: 2026-07-19
Status: Approved by Robbie (conversation)

## Goal

Add new guest-facing information to dianaandrobbie.com:
1. A dress code page (Black Tie Preferred)
2. Updated hotel/accommodation info on the travel page
3. A popup modal on the homepage announcing the new info

## 1. New page: `dresscode.html`

Built from the same template as `travel.html` / `schedule.html` (same nav, Cormorant
Garamond / Josefin Sans fonts, #f5f0e6 background, #3d3d3d text, #c4b59d accents,
dividers).

Content:
- Page title: "Dress Code"; subtitle: "Black Tie Preferred"
- Explanation section: what Black Tie Preferred means —
  - Men: tuxedo preferred; a dark formal suit with tie is welcome
  - Women: evening gown, or an elegant formal midi/cocktail dress
  - Tone: guests should feel elegant, not stressed — no need to buy a tux
- Practical tips box:
  - Porto in early June: warm days, mild evenings — bring a light layer
  - The palácio has cobblestones and outdoor terraces — block heels or wedges
    recommended over stilettos

### Stylized CSS graphics

Elegant, modern illustrations of the attire built entirely with HTML/CSS shapes
(no image files, no external libraries):
- A pair of hero silhouettes side by side: a tuxedo figure (lapels, bow tie,
  shirt studs) and a gown figure (flowing A-line silhouette) — minimalist,
  art-deco-leaning line/shape style in the site palette (#3d3d3d shapes,
  #c4b59d accents on #f5f0e6)
- Small accent glyphs for the tips section (e.g., a strappy block heel, a
  folded wrap/layer) in the same style
- Graphics are decorative (aria-hidden) with the text carrying the information
- Responsive: scale down gracefully at the 480px breakpoint

Navigation: add "Dress Code" link to the nav on **all pages** (index, our-story,
photo-gallery, venue, city, travel, schedule, dresscode), placed between
"The City" and "Travel".

## 2. Travel page update (`travel.html`)

Replace the "Please Do Not Book Yet" notice box content:
- New title: "Hotel Booking — Coming August 2026"
- New text: European hotels don't open reservations this far in advance; booking
  for our dates opens around August 2026. Details and booking info will be posted
  here as soon as available — please hold off until then.

Add below the notice (same visual language, new box or section):
- "Available Now": **Pestana Douro Riverside** — a less expensive option near the
  venue that guests can book today. Link to the hotel's official page.

## 3. Homepage announcement popup (`index.html`)

- Shows on **every** homepage load (no localStorage suppression — real updates
  expected again in a few weeks), after a ~1 second delay
- Reuses existing `.modal-overlay` / `.modal-content` styles (parchment card,
  serif type, × close button)
- Dismiss via ×, click outside, or Escape (hook into existing Escape handler)
- Content:
  - Heading: "New Updates!"
  - Item 1: ✨ Dress code is up — Black Tie Preferred → links to dresscode.html
  - Item 2: 🏨 Hotel news — booking opens ~August 2026; Pestana Douro Riverside
    bookable now as a budget-friendlier option → links to travel.html
- Must not interfere with the easter-egg hunt/admin modals (unique element IDs;
  hunt tab behavior unchanged; if a hunt modal is opened, the announcement modal
  should already be dismissible/independent)

## Out of scope

- Actual hotel block details (arrive ~August 2026)
- Any changes to easter egg system, galleries, or other pages beyond the nav link

## Testing

Manual, via local server (`python3 -m http.server 8000`):
- dresscode.html renders correctly at mobile (≤480px), tablet, desktop widths
- Nav on every page shows Dress Code and links correctly
- Travel page shows new notice + Douro Riverside section
- Homepage popup appears after delay, dismisses via ×/outside-click/Escape,
  links work, easter egg modals still function
