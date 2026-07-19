# Dress Code Mood Board Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "View Our Mood Board" trigger to dresscode.html that opens a popup grid of 12 inspiration photos with a full-size lightbox.

**Architecture:** Vanilla HTML/CSS/JS inline in dresscode.html, matching the announcement-modal pattern from index.html and the lightbox pattern from photo-gallery.html. Images live in `dresscode-gallery/` with a `thumbs/` subfolder, processed with sips/ImageMagick.

**Tech Stack:** Static HTML/CSS/JS, no build system. macOS `sips` + `magick` for image processing. Playwright MCP + local `python3 -m http.server 8000` for verification.

## Global Constraints

- No em dashes in any copy; use commas.
- Palette: #f5f0e6 background, #3d3d3d text, #c4b59d gold accents.
- Fonts: Cormorant Garamond (serif), Josefin Sans (sans). Breakpoints 480px / 769px.
- Do NOT `git push`; commits stay local until Robbie approves the preview.
- A pre-commit hook bumps the site version automatically; this is expected noise in commits.

---

### Task 1: Process mood board images

**Files:**
- Modify: `dresscode-gallery/IMG_*.jpeg` (rename to `mood-01.jpg` … `mood-12.jpg`)
- Create: `dresscode-gallery/thumbs/mood-01.jpg` … `mood-12.jpg`

**Interfaces:**
- Produces: full images at `dresscode-gallery/mood-NN.jpg` (max 900px wide) and grid thumbs at `dresscode-gallery/thumbs/mood-NN.jpg` (400px wide), NN = 01–12. Task 2 hardcodes these paths.

- [ ] **Step 1: Rename sequentially**

```bash
cd /Users/robbiedelprete/github.com/rdelpret/wedding/dresscode-gallery
i=1; for f in IMG_*.jpeg; do mv "$f" "$(printf 'mood-%02d.jpg' $i)"; i=$((i+1)); done
ls
```

Expected: `mood-01.jpg` through `mood-12.jpg`, no `IMG_*` left.

- [ ] **Step 2: Cap full-size width at 900px**

```bash
cd /Users/robbiedelprete/github.com/rdelpret/wedding/dresscode-gallery
for f in mood-*.jpg; do
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  if [ "$w" -gt 900 ]; then sips --resampleWidth 900 "$f" >/dev/null; fi
done
```

Expected: only mood images previously wider than 900px (IMG_1193 at 1051px, IMG_1201 at 956px) shrink; the rest untouched.

- [ ] **Step 3: Generate 400px-wide thumbs**

```bash
cd /Users/robbiedelprete/github.com/rdelpret/wedding/dresscode-gallery
mkdir -p thumbs
for f in mood-*.jpg; do sips --resampleWidth 400 "$f" --out "thumbs/$f" >/dev/null; done
ls thumbs | wc -l
```

Expected: `12`.

- [ ] **Step 4: Commit**

```bash
cd /Users/robbiedelprete/github.com/rdelpret/wedding
git add dresscode-gallery
git commit -m "feat: add mood board images with thumbnails"
```

---

### Task 2: Mood board popup, lightbox, and trigger on dresscode.html

**Files:**
- Modify: `dresscode.html` (CSS in `<style>`, HTML after `.color-swatches` and before `</div></body>`, new `<script>` before `</body>`)

**Interfaces:**
- Consumes: `dresscode-gallery/thumbs/mood-NN.jpg` (grid) and `dresscode-gallery/mood-NN.jpg` (lightbox), NN = 01–12, from Task 1.

- [ ] **Step 1: Add CSS before the `/* Mobile */` block (after `.rental-email a:hover` rule)**

```css
        /* Mood board trigger + modal + lightbox */
        .mood-trigger {
            display: inline-block;
            font-family: 'Josefin Sans', sans-serif;
            font-weight: 300;
            font-size: 0.8rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #5a5a5a;
            text-decoration: underline;
            text-decoration-color: #c4b59d;
            text-underline-offset: 4px;
            background: none;
            border: none;
            cursor: pointer;
            margin-bottom: 30px;
        }

        .mood-trigger:hover {
            color: #3d3d3d;
            text-decoration-color: #3d3d3d;
        }

        .mood-overlay {
            position: fixed;
            inset: 0;
            background: rgba(61, 61, 61, 0.35);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 600;
            padding: 20px;
        }

        .mood-overlay.active {
            display: flex;
        }

        .mood-card {
            position: relative;
            background: #f5f0e6;
            max-width: 720px;
            width: 100%;
            max-height: 85vh;
            overflow-y: auto;
            padding: 40px 35px 35px;
            box-shadow: 0 10px 40px rgba(61, 61, 61, 0.25);
            text-align: center;
        }

        .mood-close {
            position: absolute;
            top: 12px;
            right: 18px;
            font-family: 'Josefin Sans', sans-serif;
            font-size: 1.5rem;
            font-weight: 300;
            color: #5a5a5a;
            cursor: pointer;
            line-height: 1;
        }

        .mood-close:hover {
            color: #3d3d3d;
        }

        .mood-card .section-title {
            margin-bottom: 15px;
        }

        .mood-divider {
            width: 40px;
            height: 1px;
            background-color: #c4b59d;
            margin: 0 auto 25px;
        }

        .mood-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        .mood-grid img {
            width: 100%;
            aspect-ratio: 3 / 4;
            object-fit: cover;
            display: block;
            cursor: pointer;
        }

        .mood-lightbox {
            position: fixed;
            inset: 0;
            background: rgba(61, 61, 61, 0.75);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 700;
            cursor: pointer;
            padding: 20px;
        }

        .mood-lightbox.active {
            display: flex;
        }

        .mood-lightbox img {
            max-width: 92vw;
            max-height: 90vh;
            object-fit: contain;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }
```

And inside the existing `@media (min-width: 769px)` block append:

```css
            .mood-grid {
                grid-template-columns: repeat(3, 1fr);
            }
```

- [ ] **Step 2: Add the trigger button after `.color-swatches` div (before the second `.content-text` paragraph)**

```html
        <button class="mood-trigger" id="moodTrigger" type="button">View Our Mood Board</button>
```

- [ ] **Step 3: Add modal + lightbox HTML before `</body>` (after the closing `</div>` of `.container`)**

```html
    <div class="mood-overlay" id="moodModal">
        <div class="mood-card">
            <span class="mood-close" id="moodClose">&times;</span>
            <h2 class="section-title">Mood Board</h2>
            <div class="mood-divider"></div>
            <div class="mood-grid" id="moodGrid">
                <img src="dresscode-gallery/thumbs/mood-01.jpg" data-full="dresscode-gallery/mood-01.jpg" alt="Dress code inspiration 1" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-02.jpg" data-full="dresscode-gallery/mood-02.jpg" alt="Dress code inspiration 2" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-03.jpg" data-full="dresscode-gallery/mood-03.jpg" alt="Dress code inspiration 3" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-04.jpg" data-full="dresscode-gallery/mood-04.jpg" alt="Dress code inspiration 4" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-05.jpg" data-full="dresscode-gallery/mood-05.jpg" alt="Dress code inspiration 5" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-06.jpg" data-full="dresscode-gallery/mood-06.jpg" alt="Dress code inspiration 6" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-07.jpg" data-full="dresscode-gallery/mood-07.jpg" alt="Dress code inspiration 7" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-08.jpg" data-full="dresscode-gallery/mood-08.jpg" alt="Dress code inspiration 8" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-09.jpg" data-full="dresscode-gallery/mood-09.jpg" alt="Dress code inspiration 9" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-10.jpg" data-full="dresscode-gallery/mood-10.jpg" alt="Dress code inspiration 10" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-11.jpg" data-full="dresscode-gallery/mood-11.jpg" alt="Dress code inspiration 11" loading="lazy">
                <img src="dresscode-gallery/thumbs/mood-12.jpg" data-full="dresscode-gallery/mood-12.jpg" alt="Dress code inspiration 12" loading="lazy">
            </div>
        </div>
    </div>

    <div class="mood-lightbox" id="moodLightbox">
        <img src="" alt="Dress code inspiration, full size" id="moodLightboxImg">
    </div>

    <script>
        (function () {
            var trigger = document.getElementById('moodTrigger');
            var modal = document.getElementById('moodModal');
            var closeBtn = document.getElementById('moodClose');
            var grid = document.getElementById('moodGrid');
            var lightbox = document.getElementById('moodLightbox');
            var lightboxImg = document.getElementById('moodLightboxImg');

            trigger.addEventListener('click', function () {
                modal.classList.add('active');
            });

            closeBtn.addEventListener('click', function () {
                modal.classList.remove('active');
            });

            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });

            grid.addEventListener('click', function (e) {
                if (e.target.tagName === 'IMG') {
                    lightboxImg.src = e.target.getAttribute('data-full');
                    lightbox.classList.add('active');
                }
            });

            lightbox.addEventListener('click', function () {
                lightbox.classList.remove('active');
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    if (lightbox.classList.contains('active')) {
                        lightbox.classList.remove('active');
                    } else {
                        modal.classList.remove('active');
                    }
                }
            });
        })();
    </script>
```

- [ ] **Step 4: Verify in browser (dev server already running at localhost:8000, background task b3ahd5636; restart with `python3 -m http.server 8000` if dead)**

Navigate Playwright to `http://localhost:8000/dresscode.html?fresh=2` and run browser_evaluate:

```js
async () => {
  const r = {};
  document.getElementById('moodTrigger').click();
  r.modalOpens = document.getElementById('moodModal').classList.contains('active');
  r.thumbCount = document.querySelectorAll('#moodGrid img').length;
  const imgs = [...document.querySelectorAll('#moodGrid img')];
  await new Promise(res => setTimeout(res, 800));
  r.allThumbsLoaded = imgs.every(i => i.complete && i.naturalWidth > 0);
  imgs[0].click();
  r.lightboxOpens = document.getElementById('moodLightbox').classList.contains('active');
  document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
  r.escClosesLightboxFirst = !document.getElementById('moodLightbox').classList.contains('active')
    && document.getElementById('moodModal').classList.contains('active');
  document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
  r.escClosesModalSecond = !document.getElementById('moodModal').classList.contains('active');
  document.getElementById('moodTrigger').click();
  document.getElementById('moodModal').click();
  r.backdropCloses = !document.getElementById('moodModal').classList.contains('active');
  return r;
}
```

Expected: every key true, `thumbCount` 12. Then screenshot the open modal at desktop (1280px) and mobile (390px) widths and confirm 3-column vs 2-column grid visually.

- [ ] **Step 5: Commit**

```bash
cd /Users/robbiedelprete/github.com/rdelpret/wedding
git add dresscode.html
git commit -m "feat: add mood board popup gallery to dress code page"
```
