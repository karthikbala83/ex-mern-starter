import { useEffect, useState } from 'react';
import api from '../api/axios';

// ---------------------------------------------------------------
// Renders the $graphLookup result. The server already stamped a
// `level` on every person and sorted by it, so the UI's whole job
// is to indent — no recursion, no tree library, no d3.
// Lesson: when the database can shape the data, the component
// gets to stay boring. Boring components don't break.
// ---------------------------------------------------------------
export default function ReferralTree() {
  const [tree, setTree] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/admin/referral-tree')
      .then((r) => { if (!cancelled) setTree(r.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!tree) return null;

  return (
    <div className="card">
      <h3>Referral tree — {tree.rootName}</h3>
      <p className="muted">{tree.total} people in the downline (up to 5 levels deep).</p>

      {tree.total === 0 && <p className="muted">Nobody has used this invite link yet.</p>}

      <ul className="tree">
        {tree.downline.map((p) => (
          // Indent by level. level 0 = invited directly, 1 = invited by them, …
          <li key={p.name + p.level} style={{ paddingLeft: p.level * 24 }}>
            <span className="muted">{'└─ '.repeat(p.level ? 1 : 0)}</span>
            {p.name} <span className="badge">level {p.level}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
