# Dress Code Mood Board Popup — Design Spec

**Date:** 2026-07-19
**Page:** `dresscode.html`
**Goal:** Give guests visual inspiration for "Formal, Black Tie Preferred" via a popup mood board gallery, without putting photos on the page itself.

## Overview

A "View Mood Board" trigger on the dress code page opens a modal containing a responsive grid of 12 inspiration photos. Clicking a photo opens it full size in a lightbox. The page keeps its illustrated look; photos appear only inside the popup.

## Trigger

- Text button placed directly after the "Color and patterns are encouraged!" note and color swatches.
- Styled like the site's understated links: Josefin Sans, uppercase, letter-spaced, gold (#c4b59d) underline, hover darkens to #3d3d3d.
- Label: `View Our Mood Board`.

## Popup (mood board modal)

- Same overlay pattern as index.html's announcement modal: fixed full-screen backdrop `rgba(61,61,61,0.35)`, centered cream (#f5f0e6) card, `&times;` close button top-right.
- Card: max-width 720px desktop, 92vw mobile; max-height 85vh with internal vertical scroll (`overflow-y: auto`).
- Header: "Mood Board" section-title style + gold divider.
- Grid: CSS grid of thumbnails, 3 columns at >=769px, 2 columns below. Gap ~10px. Thumbnails cropped square-ish via `aspect-ratio: 3/4` and `object-fit: cover` (all source photos are portrait).
- Close: &times; click, backdrop click, Escape key.

## Lightbox (full-size view)

- Clicking a thumbnail opens a second overlay above the modal (higher z-index) showing the full-size image, `max-width: 92vw; max-height: 90vh; object-fit: contain`.
- Close: click anywhere on the lightbox or Escape (Escape closes lightbox first, then modal on second press). Mirrors photo-gallery.html's lightbox interaction.

## Images and processing

- Source: 12 photos currently in `dresscode-gallery/` as `IMG_*.jpeg` (669–1051px wide, 100–350KB).
- Rename to `mood-01.jpg` … `mood-12.jpg`.
- Full-size versions capped at 900px width (they are already close; only resize larger ones).
- Thumbnails generated into `dresscode-gallery/thumbs/` at 400px width for the grid.
- Filenames hardcoded in dresscode.html (no build system). Adding a photo later = add file + thumb + one `<img>` line.
- Thumbnails use `loading="lazy"`; images only load when present in DOM (acceptable for 12 thumbs).

## Copy rules

- No em dashes anywhere; use commas.

## Out of scope

- No captions or credits on photos.
- No changes to other pages.
- No push to GitHub until Robbie approves the local preview.
