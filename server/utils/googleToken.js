// ---------------------------------------------------------------
// Verify a "Sign in with Google" ID token — with no library.
//
// The browser gets an ID token from Google: a JWT (header.payload.signature)
// signed with one of Google's PRIVATE keys. Anyone can make a JWT that SAYS
// "email: principal@college.edu"; only Google can SIGN one with its key. So
// the whole job is:
//   1. fetch Google's PUBLIC keys (published as JWKS at a fixed URL),
//   2. check the signature with the key the token names (header.kid),
//   3. check the claims: issued by Google, FOR OUR APP (aud), not expired,
//      and the email verified.
// Skip step 3's `aud` check and a token Google issued to ANY other website
// would log people into ours. That one line is the most important here.
//
// Node's built-in crypto does the RSA maths; no npm package needed.
// ---------------------------------------------------------------
const crypto = require('crypto');

const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];

// Google rotates its keys every few weeks and says in Cache-Control how long
// a copy is good for. Caching saves a network trip on every login.
let cache = { keys: null, until: 0 };

async function googleKeys(forceRefresh = false) {
  if (!forceRefresh && cache.keys && Date.now() < cache.until) return cache.keys;
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error(`Could not fetch Google keys (${res.status})`);
  const { keys } = await res.json();
  const maxAge = Number((res.headers.get('cache-control') || '').match(/max-age=(\d+)/)?.[1] || 3600);
  cache = { keys, until: Date.now() + maxAge * 1000 };
  return keys;
}

const b64urlJSON = (part) => JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));

// Returns the verified payload, or throws with a reason.
async function verifyGoogleIdToken(idToken, clientId) {
  if (!clientId) throw new Error('GOOGLE_CLIENT_ID is not set on the server');
  if (typeof idToken !== 'string' || idToken.split('.').length !== 3) throw new Error('Malformed token');

  const [h, p, sig] = idToken.split('.');
  const header = b64urlJSON(h);
  const payload = b64urlJSON(p);
  if (header.alg !== 'RS256') throw new Error('Unexpected algorithm');   // never trust "alg: none"

  // Find the key this token was signed with. A kid we have not seen may
  // mean Google rotated keys since we cached them: refresh once and retry.
  let jwk = (await googleKeys()).find((k) => k.kid === header.kid);
  if (!jwk) jwk = (await googleKeys(true)).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('Unknown signing key');

  const key = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  const valid = crypto.verify('RSA-SHA256', Buffer.from(`${h}.${p}`), key, Buffer.from(sig, 'base64url'));
  if (!valid) throw new Error('Bad signature');

  const now = Math.floor(Date.now() / 1000);
  if (!ISSUERS.includes(payload.iss)) throw new Error('Not issued by Google');
  if (payload.aud !== clientId) throw new Error('Token was issued for a different app');
  if (typeof payload.exp !== 'number' || payload.exp < now - 60) throw new Error('Token expired');
  if (!payload.email || payload.email_verified !== true) throw new Error('Google has not verified this email');

  return payload;   // { sub, email, name, picture, ... }
}

module.exports = { verifyGoogleIdToken };
