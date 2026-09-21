import { useState } from 'react';

// ---------------------------------------------------------------
// Shared shell for every signed-out screen: login, signup, forgot
// and reset password. Written ONCE here so all four stay in step —
// change the college name or tagline in this file and all four
// pages follow. Copying this markup into each page is how four
// screens quietly drift apart.
//
// The pages pass their form in as `children`; this component owns
// nothing but the layout and the branding.
// ---------------------------------------------------------------

const COLLEGE_NAME = 'Nandha Engineering College';

// ---- The logo ----
// Loaded from /college-logo.png in the `public/` folder, NOT imported.
// Why it matters: `import logo from '../assets/logo.png'` is resolved by
// Vite at BUILD time, so if the file is missing the whole build FAILS.
// Files in public/ are copied as-is and resolved by the browser at RUN
// time, so a missing file is just a broken <img> — which onError catches
// below, falling back to a lettermark. Drop the real file in and it
// appears; no code change, no broken build in between.
function CollegeLogo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // Initials of the college name: "Nandha Engineering College" -> "NEC"
    const initials = COLLEGE_NAME.split(' ').map((w) => w[0]).join('').toUpperCase();
    return <div className="auth-logo-fallback" aria-hidden="true">{initials}</div>;
  }

  return (
    <img
      src="/college-logo.png"
      alt={COLLEGE_NAME}
      className="auth-logo"
      onError={() => setFailed(true)}
    />
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="auth-split">
      {/* Left: identity. Purely decorative, so it is hidden from screen
          readers on narrow screens where it collapses to a thin header. */}
      <aside className="auth-brand">
        <CollegeLogo />
        <h1 className="auth-college">{COLLEGE_NAME}</h1>
        <p className="auth-product">Campus Arena</p>
        <p className="auth-tagline">Play. Compete. Climb the leaderboard.</p>
      </aside>

      {/* Right: whichever form the route asked for. */}
      <section className="auth-pane">{children}</section>
    </div>
  );
}
