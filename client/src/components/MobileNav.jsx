import { NavLink } from 'react-router-dom';
import {
  MdHome, MdSportsEsports, MdSchool, MdRateReview, MdInsights,
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext.jsx';

// ---------------------------------------------------------------
// Bottom tab bar — phones only (hidden above 760px by CSS).
//
// Why the bottom and not the top: on a phone the top of the screen is
// the hardest place to reach one-handed and the easiest place to lose
// to the browser's own chrome. Every mobile app puts primary navigation
// at the bottom for that reason, and putting ours there is most of what
// makes a website feel like an app.
//
// Icons instead of words because five text labels do not fit across a
// 360px screen without wrapping or truncating. Each still carries a
// visible caption underneath — an icon alone is a guessing game, and a
// tiny caption costs almost nothing.
//
// aria-label on every link: the icon is decorative to a screen reader,
// so the accessible name has to come from somewhere.
// ---------------------------------------------------------------
const TABS = [
  { to: '/home',     label: 'Home',   Icon: MdHome },
  { to: '/game',     label: 'Game',   Icon: MdSportsEsports },
  { to: '/enovix',   label: 'Enovix', Icon: MdSchool },
  { to: '/feedback', label: 'Feedback', Icon: MdRateReview },
];

export default function MobileNav() {
  const { user } = useAuth();
  if (!user) return null;   // signed out: nothing to navigate between

  const tabs = user.role === 'admin'
    ? [...TABS, { to: '/admin', label: 'Admin', Icon: MdInsights }]
    : TABS;

  return (
    <nav className="mobile-nav" aria-label="Main">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className="mobile-tab" aria-label={label}>
          <Icon className="mobile-tab-icon" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
