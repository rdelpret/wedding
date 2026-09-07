#!/usr/bin/env node
/*
 * Encrypts a secret (a hotel booking code) with a passphrase so the ciphertext
 * can live safely in this public repo. The passphrase is never stored anywhere,
 * it only exists on the printed invitations and in guests' heads.
 *
 * Usage:  node tools/encrypt-code.js "<secret>" "<passphrase>" ["<passphrase>" ...]
 *
 * Each passphrase gets its own independent encryption of the same secret, so
 * any one of them unlocks it. Paste the whole printed space-separated list into
 * the page's data-cipher attribute.
 * The matching decryption lives in unlock.js and must use the same
 * normalisation, iteration count, and layout.
 */
const crypto = require('crypto');

const ITERATIONS = 250000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_BYTES = 32;

// Must stay identical to normalise() in unlock.js, so that "Del Prete",
// "delprete", and "DEL PRETE" all derive the same key.
function normalise(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const [, , secret, ...passphrases] = process.argv;
if (!secret || !passphrases.length) {
    console.error('Usage: node tools/encrypt-code.js "<secret>" "<passphrase>" ["<passphrase>" ...]');
    process.exit(1);
}

function encrypt(passphrase) {
    const salt = crypto.randomBytes(SALT_BYTES);
    const iv = crypto.randomBytes(IV_BYTES);
    const key = crypto.pbkdf2Sync(normalise(passphrase), salt, ITERATIONS, KEY_BYTES, 'sha256');

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    // Layout: salt | iv | ciphertext | tag, base64 encoded.
    return Buffer.concat([salt, iv, ciphertext, tag]).toString('base64');
}

const seen = new Set();
const blobs = [];
for (const passphrase of passphrases) {
    const key = normalise(passphrase);
    if (!key || seen.has(key)) {
        continue;
    }
    seen.add(key);
    blobs.push(encrypt(passphrase));
    console.log('accepts: ' + key);
}

console.log('secret length: ' + secret.length + ' chars');
console.log('\ndata-cipher="' + blobs.join(' ') + '"\n');
