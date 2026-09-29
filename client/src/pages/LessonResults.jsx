// Admin view: which lesson version works best? Reads one $facet aggregation.
import { useEffect, useState } from 'react';
import api from '../api/axios';

const f1 = (n) => (n == null ? '–' : n.toFixed(1));

export default function FeedbackResults() {
  const [data, setData] = useState(null);
  const load = () => api.get('/lesson-feedback/summary').then((r) => setData(r.data));
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, []);
  if (!data) return <p>Loading…</p>;
  const qn = data.questionCount;

  return (
    <div>
      <h2>Lesson feedback: Probability</h2>
      <p className="muted">Refreshes every 15 seconds. Scores are out of {qn}. Gain counts only students who finished both checks.</p>
      <div className="card">
        <table>
          <thead><tr><th>Version</th><th>Started</th><th>Finished</th><th>Before</th><th>After</th><th>Gain</th><th>Want more (1–5)</th><th>Clarity (1–5)</th><th>Rated 4+</th></tr></thead>
          <tbody>
            {data.byVersion.map((v) => (
              <tr key={v._id}>
                <td><b>{v._id}</b></td><td>{v.started}</td><td>{v.completed}</td>
                <td>{f1(v.avgPre)}</td><td>{f1(v.avgPost)}</td><td><b>{v.avgGain == null ? '–' : (v.avgGain > 0 ? '+' : '') + v.avgGain.toFixed(2)}</b></td>
                <td>{f1(v.avgInterest)}</td><td>{f1(v.avgClarity)}</td>
                <td>{v.completed ? Math.round((v.wantMore / v.completed) * 100) + '%' : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>What students liked most</h3>
        <table><tbody>
          {data.likedMost.map((l, i) => <tr key={i}><td>{l._id.version}</td><td>{l._id.part}</td><td>{l.count}</td></tr>)}
        </tbody></table>
      </div>
      <div className="card">
        <h3>Comments</h3>
        {data.comments.length === 0 && <p className="muted">No comments yet.</p>}
        {data.comments.map((c, i) => (
          <p key={i} style={{ marginBottom: 8 }}><span className="badge">{c.version}</span> <span className="muted">{c.department} · wants more: {c.interest}/5</span><br />{c.comment}</p>
        ))}
      </div>
    </div>
  );
}
