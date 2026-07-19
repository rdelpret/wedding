# Dress Code Page, Travel Update & Announcement Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Black Tie Preferred dress code page with CSS-shape attire illustrations, update the travel page's hotel info, and add a homepage popup announcing both.

**Architecture:** Vanilla HTML/CSS/JS static site, all code inline per page. New `dresscode.html` clones the travel-page template. The popup is a new centered modal on `index.html` with its own classes so it can't collide with the left-anchored easter-egg modals.

**Tech Stack:** Vanilla HTML/CSS/JS. No build system, no new dependencies. CSS graphics use only divs, clip-path, borders, border-radius.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-19-dresscode-travel-popup-design.md`
- Palette: background `#f5f0e6`, text `#3d3d3d`/`#4a4a4a`, accents `#c4b59d`
- Fonts: Cormorant Garamond (serif body), Josefin Sans (sans headers) via Google Fonts
- Breakpoints: `@media (max-width: 480px)` mobile, `@media (min-width: 769px)` desktop
- Nav order on every page: Home, Our Story, Photo Gallery, The Venue, The City, **Dress Code**, Travel, Schedule
- Verification is manual in-browser (`python3 -m http.server 8000`); no test framework exists
- Commit after each task. **Do NOT `git push`** — user previews locally first
- CSS graphics are decorative: `aria-hidden="true"` on illustration containers

---

### Task 1: Create `dresscode.html`

**Files:**
- Create: `dresscode.html`

**Interfaces:**
- Produces: `dresscode.html` at site root — Task 2 links to it as `dresscode.html`; Task 4's popup links to it

- [ ] **Step 1: Write the complete file**

Create `dresscode.html` with exactly this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dress Code | Diana &amp; Robbie</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            overflow-y: auto;
            overscroll-behavior: none;
        }

        body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100%;
        }

        body {
            font-family: 'Josefin Sans', sans-serif;
            background-color: #f5f0e6;
            min-height: 100vh;
            padding: 100px 20px 60px;
        }

        .container {
            text-align: center;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .page-title {
            font-family: 'Josefin Sans', sans-serif;
            font-weight: 300;
            font-size: 1.8rem;
            letter-spacing: 8px;
            text-transform: uppercase;
            color: #3d3d3d;
            margin-bottom: 10px;
        }

        .page-subtitle {
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            font-size: 1.2rem;
            color: #6a6a6a;
            margin-bottom: 40px;
        }

        .divider {
            width: 40px;
            height: 1px;
            background-color: #c4c4c4;
            margin: 40px auto;
        }

        .section-title {
            font-family: 'Josefin Sans', sans-serif;
            font-weight: 300;
            font-size: 1rem;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #3d3d3d;
            margin-bottom: 25px;
        }

        .content-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.2rem;
            line-height: 1.9;
            color: #4a4a4a;
            text-align: left;
            margin-bottom: 30px;
        }

        .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: 15px 10px;
            text-align: center;
            background-color: #f5f0e6;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px 25px;
            z-index: 100;
        }

        .nav a {
            font-family: 'Josefin Sans', sans-serif;
            font-weight: 300;
            font-size: 0.75rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #5a5a5a;
            text-decoration: underline;
            text-decoration-color: #c4b59d;
            text-underline-offset: 3px;
        }

        .nav a:hover {
            color: #3d3d3d;
            text-decoration-color: #3d3d3d;
        }

        /* ---- Attire illustrations (decorative) ---- */

        .attire-row {
            display: flex;
            justify-content: center;
            gap: 60px;
            margin: 40px 0 10px;
        }

        .attire-figure {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
        }

        .attire-canvas {
            width: 150px;
            height: 210px;
            position: relative;
        }

        .attire-label {
            font-family: 'Josefin Sans', sans-serif;
            font-weight: 300;
            font-size: 0.7rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #5a5a5a;
        }

        /* Tuxedo: shirt, two jacket panels with lapels, bow tie, studs */
        .tux-shirt {
            position: absolute;
            left: 50%;
            top: 30px;
            transform: translateX(-50%);
            width: 44px;
            height: 150px;
            background: #fdfbf6;
            clip-path: polygon(0 0, 100% 0, 88% 100%, 12% 100%);
        }

        .tux-jacket-left,
        .tux-jacket-right {
            position: absolute;
            top: 22px;
            width: 62px;
            height: 168px;
            background: #3d3d3d;
        }

        .tux-jacket-left {
            left: 14px;
            clip-path: polygon(30% 0, 100% 18%, 78% 45%, 100% 42%, 92% 100%, 0 100%, 0 14%);
        }

        .tux-jacket-right {
            right: 14px;
            transform: scaleX(-1);
            clip-path: polygon(30% 0, 100% 18%, 78% 45%, 100% 42%, 92% 100%, 0 100%, 0 14%);
        }

        .tux-bowtie {
            position: absolute;
            left: 50%;
            top: 34px;
            transform: translateX(-50%);
            width: 30px;
            height: 12px;
            background: #3d3d3d;
            clip-path: polygon(0 0, 40% 50%, 0 100%, 0 85%, 0 15%);
        }

        .tux-bowtie::before,
        .tux-bowtie::after {
            content: '';
            position: absolute;
            top: 0;
            width: 12px;
            height: 12px;
            background: #3d3d3d;
        }

        .tux-bowtie::before {
            left: 0;
            clip-path: polygon(0 0, 100% 40%, 100% 60%, 0 100%);
        }

        .tux-bowtie::after {
            right: 0;
            clip-path: polygon(100% 0, 0 40%, 0 60%, 100% 100%);
        }

        .tux-knot {
            position: absolute;
            left: 50%;
            top: 36px;
            transform: translateX(-50%);
            width: 7px;
            height: 8px;
            background: #c4b59d;
            border-radius: 2px;
            z-index: 2;
        }

        .tux-stud {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #c4b59d;
        }

        .tux-stud:nth-of-type(5) { top: 62px; }
        .tux-stud:nth-of-type(6) { top: 82px; }
        .tux-stud:nth-of-type(7) { top: 102px; }

        /* Gown: straps, bodice, gold waistband, A-line skirt */
        .gown-strap-left,
        .gown-strap-right {
            position: absolute;
            top: 18px;
            width: 2px;
            height: 26px;
            background: #3d3d3d;
        }

        .gown-strap-left { left: 58px; transform: rotate(14deg); }
        .gown-strap-right { right: 58px; transform: rotate(-14deg); }

        .gown-bodice {
            position: absolute;
            left: 50%;
            top: 42px;
            transform: translateX(-50%);
            width: 52px;
            height: 46px;
            background: #3d3d3d;
            clip-path: polygon(6% 0, 94% 0, 78% 100%, 22% 100%);
        }

        .gown-waist {
            position: absolute;
            left: 50%;
            top: 86px;
            transform: translateX(-50%);
            width: 34px;
            height: 5px;
            background: #c4b59d;
        }

        .gown-skirt {
            position: absolute;
            left: 50%;
            top: 90px;
            transform: translateX(-50%);
            width: 120px;
            height: 112px;
            background: #3d3d3d;
            clip-path: polygon(38% 0, 62% 0, 100% 94%, 88% 100%, 50% 96%, 12% 100%, 0 94%);
        }

        /* Tips box + glyphs */
        .tips-box {
            background-color: rgba(196, 181, 157, 0.15);
            border: 1px solid #c4b59d;
            padding: 30px;
            margin: 30px 0;
            text-align: left;
        }

        .tips-box .section-title {
            text-align: center;
            margin-bottom: 25px;
        }

        .tip-item {
            display: flex;
            align-items: center;
            gap: 22px;
            margin-bottom: 22px;
        }

        .tip-item:last-child {
            margin-bottom: 0;
        }

        .tip-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.15rem;
            line-height: 1.7;
            color: #4a4a4a;
        }

        .tip-glyph {
            flex-shrink: 0;
            width: 44px;
            height: 44px;
            position: relative;
        }

        /* Block heel glyph: sole line, chunky heel, ankle strap */
        .heel-sole {
            position: absolute;
            left: 4px;
            bottom: 10px;
            width: 34px;
            height: 3px;
            background: #3d3d3d;
            transform: rotate(-12deg);
        }

        .heel-block {
            position: absolute;
            right: 6px;
            bottom: 2px;
            width: 9px;
            height: 13px;
            background: #c4b59d;
        }

        .heel-strap {
            position: absolute;
            right: 4px;
            bottom: 16px;
            width: 12px;
            height: 12px;
            border: 2px solid #3d3d3d;
            border-bottom: none;
            border-radius: 10px 10px 0 0;
        }

        /* Wrap/layer glyph: folded shawl */
        .wrap-fold-back {
            position: absolute;
            left: 6px;
            top: 10px;
            width: 32px;
            height: 22px;
            background: #c4b59d;
            clip-path: polygon(0 0, 100% 0, 86% 100%, 14% 100%);
            opacity: 0.5;
        }

        .wrap-fold-front {
            position: absolute;
            left: 10px;
            top: 16px;
            width: 24px;
            height: 20px;
            background: #3d3d3d;
            clip-path: polygon(0 0, 100% 0, 78% 100%, 22% 100%);
        }

        /* Mobile */
        @media (max-width: 480px) {
            body {
                padding: 80px 15px 40px;
            }

            .page-title {
                font-size: 1.3rem;
                letter-spacing: 5px;
            }

            .page-subtitle {
                font-size: 1rem;
            }

            .section-title {
                font-size: 0.85rem;
                letter-spacing: 4px;
            }

            .content-text {
                font-size: 1.1rem;
            }

            .attire-row {
                gap: 30px;
            }

            .attire-canvas {
                transform: scale(0.8);
                transform-origin: top center;
                margin-bottom: -42px;
            }

            .nav {
                gap: 10px 15px;
                padding: 12px 8px;
            }

            .nav a {
                font-size: 0.6rem;
                letter-spacing: 2px;
            }
        }

        /* Desktop */
        @media (min-width: 769px) {
            .page-title {
                font-size: 2rem;
                letter-spacing: 10px;
            }

            .page-subtitle {
                font-size: 1.4rem;
            }

            .section-title {
                font-size: 1.1rem;
                letter-spacing: 6px;
            }

            .content-text {
                font-size: 1.3rem;
            }
        }
    </style>
</head>
<body>
    <nav class="nav">
        <a href="index.html">Home</a>
        <a href="our-story.html">Our Story</a>
        <a href="photo-gallery.html">Photo Gallery</a>
        <a href="venue.html">The Venue</a>
        <a href="city.html">The City</a>
        <a href="dresscode.html">Dress Code</a>
        <a href="travel.html">Travel</a>
        <a href="schedule.html">Schedule</a>
    </nav>
    <div class="container">
        <h1 class="page-title">Dress Code</h1>
        <p class="page-subtitle">Black Tie Preferred</p>

        <div class="attire-row" aria-hidden="true">
            <div class="attire-figure">
                <div class="attire-canvas">
                    <div class="tux-shirt"></div>
                    <div class="tux-jacket-left"></div>
                    <div class="tux-jacket-right"></div>
                    <div class="tux-bowtie"></div>
                    <div class="tux-knot"></div>
                    <div class="tux-stud"></div>
                    <div class="tux-stud"></div>
                    <div class="tux-stud"></div>
                </div>
                <span class="attire-label">Tuxedo</span>
            </div>
            <div class="attire-figure">
                <div class="attire-canvas">
                    <div class="gown-strap-left"></div>
                    <div class="gown-strap-right"></div>
                    <div class="gown-bodice"></div>
                    <div class="gown-skirt"></div>
                    <div class="gown-waist"></div>
                </div>
                <span class="attire-label">Evening Gown</span>
            </div>
        </div>

        <div class="divider"></div>

        <p class="content-text">
            We would love to see everyone dressed to the nines for our evening at the pal&aacute;cio. Black tie is preferred &mdash; for gentlemen, that means a tuxedo, though a dark formal suit with a tie is most welcome. For ladies, an evening gown or an elegant formal midi or cocktail dress is perfect.
        </p>
        <p class="content-text">
            Above all, we want you to feel wonderful. If a tuxedo isn't in your closet, please don't rush out to buy one &mdash; come elegant, comfortable, and ready to celebrate.
        </p>

        <div class="divider"></div>

        <div class="tips-box">
            <h2 class="section-title">A Few Practical Notes</h2>
            <div class="tip-item">
                <div class="tip-glyph" aria-hidden="true">
                    <div class="wrap-fold-back"></div>
                    <div class="wrap-fold-front"></div>
                </div>
                <p class="tip-text">Porto in early June brings warm days and mild evenings &mdash; a light wrap or jacket is a lovely idea for after sunset.</p>
            </div>
            <div class="tip-item">
                <div class="tip-glyph" aria-hidden="true">
                    <div class="heel-sole"></div>
                    <div class="heel-block"></div>
                    <div class="heel-strap"></div>
                </div>
                <p class="tip-text">The pal&aacute;cio has cobblestones and outdoor terraces &mdash; block heels or wedges will treat you far better than stilettos.</p>
            </div>
        </div>

        <div class="divider"></div>
    </div>
</body>
</html>
```

- [ ] **Step 2: Verify it renders**

Run: `python3 -m http.server 8000` (background, from repo root) and open `http://localhost:8000/dresscode.html` in a browser (or take a screenshot via browser tooling).

Expected: page renders with title, two silhouettes side by side (charcoal tux with gold studs/knot, charcoal gown with gold waistband), tips box with the two glyphs. No horizontal scrollbar. Check ~375px width too: silhouettes shrink, nothing overflows.

Note: the CSS-shape illustrations are the one part of this plan where visual tuning is expected — if a clip-path renders awkwardly, adjust coordinates until it looks elegant, keeping the palette and structure.

- [ ] **Step 3: Commit**

```bash
git add dresscode.html
git commit -m "Add dress code page with CSS attire illustrations"
```

---

### Task 2: Add Dress Code link to every nav

**Files:**
- Modify: `index.html:598-599`, `our-story.html:156-157`, `photo-gallery.html:261-262`, `venue.html:326-327`, `city.html:346-347`, `travel.html:260-261`, `schedule.html:224-225`

**Interfaces:**
- Consumes: `dresscode.html` from Task 1

- [ ] **Step 1: Insert the nav link in all 7 existing pages**

In each file listed above, the nav contains this exact block:

```html
        <a href="city.html">The City</a>
        <a href="travel.html">Travel</a>
```

Replace it in every file with:

```html
        <a href="city.html">The City</a>
        <a href="dresscode.html">Dress Code</a>
        <a href="travel.html">Travel</a>
```

- [ ] **Step 2: Verify**

Run: `grep -c 'dresscode.html' index.html our-story.html photo-gallery.html venue.html city.html travel.html schedule.html`

Expected: every file reports at least 1 (index.html will report more after Task 4). Spot-check one page in the browser: nav shows Dress Code between The City and Travel, link navigates to the new page.

- [ ] **Step 3: Commit**

```bash
git add index.html our-story.html photo-gallery.html venue.html city.html travel.html schedule.html
git commit -m "Add Dress Code to navigation on all pages"
```

---

### Task 3: Update travel page hotel info

**Files:**
- Modify: `travel.html:270-273` (notice box), plus new section below it

**Interfaces:**
- Consumes: nothing new
- Produces: travel.html content the Task 4 popup links to

- [ ] **Step 1: Replace the notice box and add the Douro Riverside section**

In `travel.html`, replace:

```html
        <div class="notice-box">
            <p class="notice-title">Please Do Not Book Yet</p>
            <p class="notice-text">We are still finalizing travel and accommodation details for our guests. Please check back soon for booking information and special rates.</p>
        </div>
```

with:

```html
        <div class="notice-box">
            <p class="notice-title">Hotel Booking &mdash; Coming August 2026</p>
            <p class="notice-text">European hotels don't open reservations this far in advance &mdash; booking for our dates opens around August 2026. We'll post hotel details and booking information right here as soon as it's available, so please hold off until then.</p>
        </div>

        <div class="concierge-box">
            <h2 class="section-title">Available Now</h2>
            <p class="concierge-text">
                Looking for a less expensive option? <a href="https://www.pestana.com/en/hotel/pestana-douro" target="_blank" rel="noopener">Pestana Douro Riverside</a> sits on the river near the venue and is already taking reservations for our dates.
            </p>
        </div>
```

Note: `.concierge-text` has no `a` styling in travel.html's CSS — add link styling by extending the existing rule. In the `<style>` block, replace:

```css
        .concierge-email a {
            color: #4a4a4a;
            text-decoration: underline;
            text-decoration-color: #c4b59d;
            text-underline-offset: 3px;
        }

        .concierge-email a:hover {
            color: #3d3d3d;
            text-decoration-color: #3d3d3d;
        }
```

with:

```css
        .concierge-email a,
        .concierge-text a {
            color: #4a4a4a;
            text-decoration: underline;
            text-decoration-color: #c4b59d;
            text-underline-offset: 3px;
        }

        .concierge-email a:hover,
        .concierge-text a:hover {
            color: #3d3d3d;
            text-decoration-color: #3d3d3d;
        }
```

- [ ] **Step 2: Verify**

Open `http://localhost:8000/travel.html`.

Expected: notice box reads "Hotel Booking — Coming August 2026"; below it an "Available Now" section with a working link to the Pestana Douro Riverside page (verify the URL resolves to the hotel's official page; if Pestana's site uses a different slug, correct the href to the real official page for Pestana Douro Riverside, Porto/Gaia).

- [ ] **Step 3: Commit**

```bash
git add travel.html
git commit -m "Update travel page: booking opens August 2026, add Pestana Douro Riverside option"
```

---

### Task 4: Homepage announcement popup

**Files:**
- Modify: `index.html` — CSS in `<style>` (after the `.modal-close:hover` rule ending at line ~370), HTML just before the closing `</body>` scripts region (next to the existing modals at lines ~681-707), JS near the existing modal close handlers (lines ~947-966)

**Interfaces:**
- Consumes: `dresscode.html` (Task 1), updated `travel.html` (Task 3)

- [ ] **Step 1: Add popup CSS**

In `index.html`'s `<style>` block, immediately after the `.modal-close:hover { ... }` rule, add:

```css
        .announce-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background-color: rgba(61, 61, 61, 0.35);
            z-index: 600;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .announce-overlay.active {
            display: flex;
        }

        .announce-card {
            background-color: #f5f0e6;
            border: 1px solid #c4b59d;
            padding: 40px 35px 35px;
            max-width: 420px;
            width: 100%;
            text-align: center;
            position: relative;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .announce-close {
            position: absolute;
            top: 10px;
            right: 16px;
            font-size: 1.3rem;
            color: #5a5a5a;
            cursor: pointer;
            font-family: 'Josefin Sans', sans-serif;
            font-weight: 300;
        }

        .announce-close:hover {
            color: #3d3d3d;
        }

        .announce-title {
            font-family: 'Josefin Sans', sans-serif;
            font-weight: 300;
            font-size: 1rem;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #3d3d3d;
            margin-bottom: 8px;
        }

        .announce-divider {
            width: 30px;
            height: 1px;
            background-color: #c4b59d;
            margin: 18px auto;
        }

        .announce-item {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.1rem;
            line-height: 1.7;
            color: #4a4a4a;
            margin-bottom: 16px;
        }

        .announce-item a {
            color: #3d3d3d;
            text-decoration: underline;
            text-decoration-color: #c4b59d;
            text-underline-offset: 3px;
        }

        .announce-item a:hover {
            text-decoration-color: #3d3d3d;
        }
```

- [ ] **Step 2: Add popup HTML**

In `index.html`, directly after the closing `</div>` of the hunt modal (`id="huntModal"` block, ends around line 740 — find `id="huntModal"` and its matching `</div></div>`), add:

```html
    <div class="announce-overlay" id="announceModal">
        <div class="announce-card">
            <span class="announce-close" id="announceClose">&times;</span>
            <h2 class="announce-title">New Updates!</h2>
            <div class="announce-divider"></div>
            <p class="announce-item">&#10024; The dress code is up &mdash; <a href="dresscode.html">Black Tie Preferred</a></p>
            <p class="announce-item">&#127976; Hotel booking opens around August 2026 &mdash; and Pestana Douro Riverside is <a href="travel.html">bookable now</a> as a budget-friendlier option</p>
        </div>
    </div>
```

- [ ] **Step 3: Add popup JS**

In `index.html`'s script, immediately after the existing "Modal close handlers" block (after the `huntTab` click handler, before the Escape handler comment at ~line 959), add:

```javascript
        // Announcement popup: shows on every visit
        setTimeout(() => {
            document.getElementById('announceModal').classList.add('active');
        }, 1000);
        document.getElementById('announceClose').addEventListener('click', () => {
            document.getElementById('announceModal').classList.remove('active');
        });
        document.getElementById('announceModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('announceModal')) {
                document.getElementById('announceModal').classList.remove('active');
            }
        });
```

Then extend the existing Escape handler — replace:

```javascript
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('adminModal').classList.remove('active');
                document.getElementById('huntModal').classList.remove('active');
                document.getElementById('huntTab').style.display = 'block';
            }
        });
```

with:

```javascript
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('adminModal').classList.remove('active');
                document.getElementById('huntModal').classList.remove('active');
                document.getElementById('announceModal').classList.remove('active');
                document.getElementById('huntTab').style.display = 'block';
            }
        });
```

- [ ] **Step 4: Verify**

Open `http://localhost:8000/index.html`.

Expected: after ~1s the centered announcement card fades in over a dimmed page. Both links navigate correctly. × closes it; reload, click the dimmed backdrop — closes; reload, press Escape — closes. Then verify easter eggs still work: hunt tab opens hunt modal; typing `hunt` opens it; Escape still closes hunt/admin modals. Check at ~375px width: card fits with margins, no overflow.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add announcement popup for dress code and hotel updates"
```

---

### Task 5: Full local review with the user (gate before push)

**Files:** none (verification only)

- [ ] **Step 1: Serve the site locally**

Run from repo root: `python3 -m http.server 8000` (background).

- [ ] **Step 2: Walk every changed surface**

- `http://localhost:8000/` — popup appears, links work, easter eggs unaffected
- `http://localhost:8000/dresscode.html` — desktop + mobile widths
- `http://localhost:8000/travel.html` — new notice + Available Now section
- Every other page — nav shows Dress Code

Capture screenshots (desktop and ~375px mobile) of the popup, dress code page, and travel page for the user.

- [ ] **Step 3: User approval gate**

Show the user the local preview (URL + screenshots). **Do not `git push`** until the user approves. After approval: `git push origin main` (auto-deploys to GitHub Pages).
