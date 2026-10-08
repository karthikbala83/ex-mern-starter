// ---------------------------------------------------------------
// CLIENT_URL, parsed once.
//
// It may list several frontend origins, comma-separated: a custom domain
// AND the original *.netlify.app address. Two different jobs read it:
//   - CORS needs ALL of them (server.js), so every address can call us;
//   - links we hand out (password reset, referral invites) need ONE, the
//     first — the address you want people to see and share.
// Gluing the raw env var into a URL would print
// "https://a.com,https://b.app/signup?ref=…" — a link that opens nothing.
// ---------------------------------------------------------------
const clientOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))   // an Origin header never has a trailing slash
  .filter(Boolean);

// List your preferred public address FIRST in CLIENT_URL.
const primaryClientUrl = clientOrigins[0] || 'http://localhost:5173';

module.exports = { clientOrigins, primaryClientUrl };
