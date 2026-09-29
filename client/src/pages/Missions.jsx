import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { worlds, products } from '../missions/catalog.js';

const t = (v, lang) => (typeof v === 'string' ? v : v?.[lang] ?? v?.en ?? '');

// ---------------------------------------------------------------
// The mission map: 7 worlds, 42 lessons, 63 missions — of which 5 are open.
//
// Showing the locked 58 is the point, not an accident. A student who can
// see the whole journey knows what "learning to code" is going to add up
// to; a list of only the five things they can do today looks like the
// whole product. Opening a mission later is a status flip in catalog.js —
// no component changes.
// ---------------------------------------------------------------
export default function Missions() {
  const [lang, setLang] = useState('ta');
  const [filter, setFilter] = useState('all');        // all · game · app
  const [data, setData] = useState({ points: 0, rank: null, missions: {} });

  useEffect(() => {
    let cancelled = false;
    api.get('/missions/progress')
      .then((r) => { if (!cancelled) setData(r.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Filtering happens here, not in the render, so a world that has no
  // missions for the chosen product disappears entirely rather than
  // rendering as an empty heading.
  const visible = useMemo(() => worlds.map((w) => ({
    ...w,
    lessons: w.lessons
      .map((l) => ({ ...l, missions: l.missions.filter((m) => filter === 'all' || m.product === filter) }))
      .filter((l) => l.missions.length > 0),
  })).filter((w) => w.lessons.length > 0), [filter]);

  const chipFor = (m) => {
    const prog = data.missions[m.id];
    // A mission counts as done when its "write" stage is passed — that is
    // the one every mission has and the one worth the most.
    if (prog?.stages?.write) return { cls: 'chip-done', mark: '✓' };
    if (m.status === 'live') return { cls: 'chip-live', mark: '▶' };
    return { cls: 'chip-soon', mark: '🔒' };
  };

  return (
    <div>
      <div className="lesson-top">
        <div>
          <h2>Missions</h2>
          <p className="muted">Build two products one function at a time.</p>
        </div>
        <div className="lang-switch">
          <button aria-pressed={lang === 'ta'} onClick={() => setLang('ta')} lang="ta">தமிழ்</button>
          <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
        </div>
      </div>

      <div className="card my-rank">
        <span className="rank-num">{data.points}</span>
        <div>
          <strong>Mission points</strong>
          <p className="muted">{data.rank ? `Rank #${data.rank}` : 'Finish a mission to get ranked'}</p>
        </div>
      </div>

      <div className="seg filter-row">
        <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
        <button aria-pressed={filter === 'game'} onClick={() => setFilter('game')}>
          {products.game.emoji} {products.game.name}
        </button>
        <button aria-pressed={filter === 'app'} onClick={() => setFilter('app')}>
          {products.app.emoji} {products.app.name}
        </button>
      </div>

      {visible.map((w) => (
        <div key={w.id} className="card world-card">
          <h3>World {w.id} — <span lang={lang}>{t(w.title, lang)}</span></h3>
          {w.unlocks && (
            <p className="muted">
              🎮 {w.unlocks.game} · 🏢 {w.unlocks.app}
            </p>
          )}

          {w.lessons.map((l) => (
            <div key={l.id} className="lesson-row">
              <div className="lesson-row-head">
                <span lang={lang} className={l.status === 'live' ? '' : 'muted'}>{t(l.title, lang)}</span>
                {l.status === 'live'
                  ? <Link className="badge" to={l.route || `/enovix/${l.id}`}>Lesson</Link>
                  : <span className="badge">Coming soon</span>}
              </div>

              <div className="chip-row">
                {l.missions.map((m) => {
                  const { cls, mark } = chipFor(m);
                  const label = `${m.product === 'game' ? '🎮' : '🏢'} ${t(m.title, lang)}`;
                  return m.status === 'live'
                    ? <Link key={m.id} to={`/missions/${m.id}`} className={`chip ${cls}`}>{mark} {label}</Link>
                    : <span key={m.id} className={`chip ${cls}`}>{mark} {label}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
