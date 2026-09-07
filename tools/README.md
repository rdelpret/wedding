# tools

## encrypt-code.js

Encrypts a booking code so the ciphertext can live in this public repo.

```
node tools/encrypt-code.js "<secret>" "<passphrase>" ["<passphrase>" ...]
```

Paste the printed value into the page's `data-cipher` attribute. Decryption
lives in `unlock.js`. Never commit a booking code in plaintext, this repo is
public and git history is forever.

## og-template.html

Source for `og-image.jpg`, the 1200x630 card shown in link previews (iMessage,
Slack, Facebook, Twitter). To regenerate after editing it, serve the repo and
screenshot the template at exactly 1200x630:

```
python3 -m http.server 8000
# then, at a 1200x630 viewport, screenshot http://localhost:8000/tools/og-template.html
# and save it as og-image.jpg in the repo root
```

Keep the output opaque and 1200x630. A transparent PNG renders muddy against
dark backgrounds, which is what the old preview did.
