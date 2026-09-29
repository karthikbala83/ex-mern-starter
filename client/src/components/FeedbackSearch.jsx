import { useEffect, useState } from 'react';
import api from '../api/axios';

// ---------------------------------------------------------------
// Admin feedback list + $text search.
// Note the empty search box still shows results (the latest 20) —
// an empty state that shows nothing teaches the admin nothing.
// ---------------------------------------------------------------
export default function FeedbackSearch() {
  const [q, setQ] = useState('');
  const [data, setData] = useState(null);

  const load = async (term) => {
    const { data } = await api.get('/admin/feedback', { params: { q: term } });
    setData(data);
  };

  useEffect(() => { load(''); }, []);

  return (
    <div className="card">
      <h3>Feedback</h3>

      <div className="ref-row">
        <input
          placeholder="Search feedback (try: wifi)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(q)}
        />
        <button onClick={() => load(q)}>Search</button>
      </div>

      {data?.searched && (
        <p className="muted">
          {data.items.length} match(es) for "{data.q}", best match first.
        </p>
      )}

      <table>
        <thead>
          <tr><th>Who</th><th>Rating</th><th>Message</th>{data?.searched && <th>Score</th>}</tr>
        </thead>
        <tbody>
          {data?.items.length === 0 && (
            <tr><td colSpan="4">No feedback found.</td></tr>
          )}
          {data?.items.map((f) => (
            <tr key={f._id}>
              <td>{f.user?.name || '—'}</td>
              <td>{'★'.repeat(f.rating)}</td>
              <td>{f.message}</td>
              {/* textScore: how well Mongo thinks this row matches the search */}
              {data.searched && <td>{f.score?.toFixed(2)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
