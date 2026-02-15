# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static wedding website for Diana & Robbie's wedding (June 4, 2027) deployed via GitHub Pages to dianaandrobbie.com.

## Development

**No build system** - This is vanilla HTML/CSS/JavaScript. All code is inline within HTML files.

- Open `.html` files directly in browser to test
- Use a local dev server for live reload (e.g., `python3 -m http.server 8000`)
- External dependencies loaded from CDN: Tone.js (audio synthesis), Google Fonts

**Deployment:**
```bash
git add . && git commit -m "message" && git push origin main
# Auto-deploys to GitHub Pages
```

**Image processing tools available:**
```bash
sips -g pixelWidth -g pixelHeight <image>  # Get dimensions (macOS)
magick convert <input> -resize <size> <output>  # ImageMagick resize
```

## Architecture

**Pages:**
- `index.html` - Main landing page with save-the-date, wedding details, and easter egg system
- `our-story.html` - Couple's story with photo timeline
- `photo-gallery.html` - Engagement photo gallery with lightbox
- `venue.html` - Pestana Palácio Freixo venue info
- `city.html` - Porto city guide with rotating hero carousel

**Image directories:**
- `photogallery/` - Engagement photos (with `thumbs/` subdirectory)
- `our-story-gallery/` - Story timeline photos
- `venue-gallery/` - Venue photos
- `city-gallery/` - Porto city photos

## Key Implementation Details

**Responsive breakpoints:** 480px (mobile), 769px (tablet/desktop)

**Typography:** Cormorant Garamond (serif body), Josefin Sans (sans-serif headers)

**Color palette:** #f5f0e6 (background), #3d3d3d (text), #c4b59d (accents)

**Easter egg system (index.html):**
- Keyword-triggered audio/visual effects using Tone.js synthesis
- Hunt modal with hints (toggle via left-edge tab)
- Admin modal shows all keywords
- Mobile: 7-tap pattern reveals all emojis
- Effects: falling emojis, spirals, custom synth melodies

All easter egg functions and keywords are defined inline in index.html's `<script>` tag.
