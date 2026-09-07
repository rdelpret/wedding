/*
 * Reveals passphrase-protected content (our hotel booking codes).
 *
 * Markup contract, see travel.html and venue.html:
 *   <div class="unlock" data-cipher="<space-separated base64 from tools/encrypt-code.js>">
 *     <span class="unlock-label">...</span>
 *     <p class="unlock-prompt">...</p>
 *     <form class="unlock-form">...<input class="unlock-input">...</form>
 *     <p class="unlock-error" hidden>...</p>
 *     <p class="unlock-secret" hidden></p>
 *   </div>
 *
 * data-cipher holds one blob per accepted passphrase, each an independent
 * encryption of the same secret. We try them in turn and take the first that
 * authenticates.
 *
 * The passphrases are only ever on the printed invitations, so the ciphertext is
 * safe to keep in this public repo. Keep ITERATIONS and the blob layout in step
 * with tools/encrypt-code.js or nothing will decrypt.
 */
(function () {
    'use strict';

    var ITERATIONS = 250000;
    var SALT_BYTES = 16;
    var IV_BYTES = 12;
    var STORAGE_KEY = 'dr-unlock-passphrase';

    // Must stay identical to normalise() in tools/encrypt-code.js.
    function normalise(input) {
        return input.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function base64ToBytes(base64) {
        var binary = atob(base64);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    function decryptOne(passphrase, blob) {
        var bytes = base64ToBytes(blob);
        var salt = bytes.slice(0, SALT_BYTES);
        var iv = bytes.slice(SALT_BYTES, SALT_BYTES + IV_BYTES);
        var payload = bytes.slice(SALT_BYTES + IV_BYTES);
        var subtle = window.crypto.subtle;

        return subtle.importKey(
            'raw', new TextEncoder().encode(normalise(passphrase)), 'PBKDF2', false, ['deriveKey']
        ).then(function (material) {
            return subtle.deriveKey(
                { name: 'PBKDF2', salt: salt, iterations: ITERATIONS, hash: 'SHA-256' },
                material,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );
        }).then(function (key) {
            // AES-GCM authenticates, so a wrong passphrase rejects rather than
            // returning garbage.
            return subtle.decrypt({ name: 'AES-GCM', iv: iv, tagLength: 128 }, key, payload);
        }).then(function (plaintext) {
            return new TextDecoder().decode(plaintext);
        });
    }

    // Any one of the accepted passphrases should work, so walk the blobs until
    // one authenticates. Rejections are expected here, not errors.
    function decrypt(passphrase, blobs) {
        return blobs.reduce(function (chain, blob) {
            return chain.catch(function () {
                return decryptOne(passphrase, blob);
            });
        }, Promise.reject());
    }

    function remember(passphrase) {
        try {
            window.sessionStorage.setItem(STORAGE_KEY, passphrase);
        } catch (e) {
            // Private browsing can refuse storage. Only costs a retype per page.
        }
    }

    function recall() {
        try {
            return window.sessionStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setUp(box) {
        var blobs = box.getAttribute('data-cipher').trim().split(/\s+/);
        var form = box.querySelector('.unlock-form');
        var input = box.querySelector('.unlock-input');
        var error = box.querySelector('.unlock-error');
        var secret = box.querySelector('.unlock-secret');
        var prompt = box.querySelector('.unlock-prompt');
        var button = box.querySelector('.unlock-button');

        function reveal(plaintext) {
            secret.textContent = plaintext;
            secret.hidden = false;
            error.hidden = true;
            form.hidden = true;
            if (prompt) {
                prompt.hidden = true;
            }
        }

        function attempt(passphrase, isReplay) {
            button.disabled = true;
            button.textContent = 'Unlocking';
            return decrypt(passphrase, blobs).then(function (plaintext) {
                remember(passphrase);
                reveal(plaintext);
            }).catch(function () {
                button.disabled = false;
                button.textContent = 'Unlock';
                // A stale stored passphrase should fail quietly, the guest did
                // not just type anything wrong.
                if (!isReplay) {
                    error.hidden = false;
                    input.select();
                }
            });
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            error.hidden = true;
            var value = input.value.trim();
            if (value) {
                attempt(value, false);
            }
        });

        input.addEventListener('input', function () {
            error.hidden = true;
        });

        var stored = recall();
        if (stored) {
            attempt(stored, true);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var boxes = document.querySelectorAll('.unlock[data-cipher]');
        if (!boxes.length) {
            return;
        }
        // WebCrypto needs a secure context: https, or localhost while testing.
        if (!window.crypto || !window.crypto.subtle || !window.TextEncoder) {
            Array.prototype.forEach.call(boxes, function (box) {
                var fallback = box.querySelector('.unlock-fallback');
                var form = box.querySelector('.unlock-form');
                if (fallback) {
                    fallback.hidden = false;
                }
                if (form) {
                    form.hidden = true;
                }
            });
            return;
        }
        Array.prototype.forEach.call(boxes, setUp);
    });
}());
