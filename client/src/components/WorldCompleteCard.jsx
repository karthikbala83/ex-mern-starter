// ---------------------------------------------------------------
// "🏆 World N complete" — shown on /missions and on Enovix the first
// time worldComplete() turns true, until the student closes it.
//
// It is computed in the browser from data we already have (local lesson
// progress + GET /api/missions/progress), so no new endpoint. The rule
// itself lives in lessons/progress.js; this file is only the card.
// ---------------------------------------------------------------
import { lazy, Suspense, useState } from 'react';
import { worldComplete, worldCelebrated, markWorldCelebrated } from '../lessons/progress.js';
import { worlds } from '../missions/catalog.js';

// The trophy pulls in Lottie, so only a student who earns it downloads it.
const Trophy = lazy(() => import('./Trophy.jsx'));

const t = (v, lang) => (typeof v === 'string' ? v : v?.[lang] ?? v?.en ?? '');

export default function WorldCompleteCard({ worldId = 1, missionProgress, lang = 'en' }) {
  const [closed, setClosed] = useState(() => worldCelebrated(worldId));
  if (closed || !worldComplete(worldId, missionProgress)) return null;
  const world = worlds.find((w) => w.id === worldId);
  const ta = lang === 'ta';

  return (
    <div className="card world-done" role="status">
      <Suspense fallback={<span className="world-done-cup" aria-hidden="true">🏆</span>}><Trophy size={110} /></Suspense>
      <div>
        <h3>🏆 World {worldId} complete</h3>
        <p lang={lang}><b>{t(world?.title, lang)}</b></p>
        <p className="muted" lang={lang}>
          {ta ? 'எல்லா lesson-உம் பார்த்து, quiz எழுதி, ஒவ்வொன்னுலயும் ஒரு mission-ஐ build பண்ணிட்டீங்க.'
              : 'You watched every lesson, took every quiz, and built at least one mission for each.'}
        </p>
        <button onClick={() => { markWorldCelebrated(worldId); setClosed(true); }}>{ta ? 'சூப்பர்!' : 'Nice!'}</button>
      </div>
    </div>
  );
}
