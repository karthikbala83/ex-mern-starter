// Student flow: choose version → pre-check → open lesson → post-check + rating → done.
// Section teachers share a link like /feedback?v=B so each section gets one version.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';

function Questions({ questions, answers, setAnswers }) {
  return questions.map((q, i) => (
    <div className="card" key={q.id}>
      <p><b>{i + 1}. {q.text}</b></p>
      {q.options.map((o, j) => (
        <label key={j} className="fb-opt">
          <input type="radio" name={q.id} checked={answers[q.id] === j}
                 onChange={() => setAnswers({ ...answers, [q.id]: j })} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  ));
}

function Scale({ label, value, onChange }) {
  return (
    <div className="card">
      <p><b>{label}</b></p>
      <div className="fb-scale">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" className={value === n ? 'tag active' : 'tag'} onClick={() => onChange(n)}>{n}</button>
        ))}
      </div>
      <p className="muted">1 = not at all, 5 = very much</p>
    </div>
  );
}

export default function Feedback() {
  const [params] = useSearchParams();
  const [meta, setMeta] = useState(null);
  const [mine, setMine] = useState(undefined);
  const [version, setVersion] = useState(['A', 'B', 'C'].includes(params.get('v')) ? params.get('v') : '');
  const [answers, setAnswers] = useState({});
  const [rating, setRating] = useState({ interest: 0, clarity: 0, likedMost: '', language: '', comment: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/feedback/questions'), api.get('/feedback/mine')]).then(([q, m]) => {
      setMeta(q.data);
      setMine(m.data);
    });
  }, []);

  if (!meta || mine === undefined) return <p>Loading…</p>;
  const qs = meta.questions;
  const allAnswered = qs.every((q) => Number.isInteger(answers[q.id]));
  const stage = !mine ? 'pre' : !mine.post?.at ? 'post' : 'done';

  const send = async (url, body) => {
    setError(''); setBusy(true);
    try { const { data } = await api.post(url, body); setMine(data); setAnswers({}); window.scrollTo(0, 0); }
    catch (e) { setError(e.response?.data?.message || 'Could not save. Try again.'); }
    finally { setBusy(false); }
  };

  if (stage === 'pre') return (
    <div>
      <h2>Before the lesson</h2>
      <p className="muted">Three quick questions. Choose "I don't know" if you are not sure. There are no marks for this.</p>
      {!params.get('v') && (
        <div className="card">
          <p><b>Which version did your teacher give you?</b></p>
          <select value={version} onChange={(e) => setVersion(e.target.value)}>
            <option value="">Select</option>
            {Object.entries(meta.versions).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      )}
      <Questions questions={qs} answers={answers} setAnswers={setAnswers} />
      {error && <p className="error">{error}</p>}
      <button disabled={!version || !allAnswered || busy} onClick={() => send('/feedback/pre', { version, answers })}>
        Save and start the lesson
      </button>
    </div>
  );

  if (stage === 'post') {
    const url = meta.versions[mine.version]?.url;
    const ready = allAnswered && rating.interest && rating.clarity;
    return (
      <div>
        <h2>Watch the lesson</h2>
        <div className="card">
          <p>Open the lesson, go through it fully, then come back to this tab.</p>
          <a className="fb-open" href={url} target="_blank" rel="noopener noreferrer">
            Open {meta.versions[mine.version]?.label}
          </a>
        </div>
        <>
            <h2 style={{ marginTop: 24 }}>After the lesson</h2>
            <p className="muted">The same three questions again, then tell us what you thought.</p>
            <Questions questions={qs} answers={answers} setAnswers={setAnswers} />
            <Scale label="After this lesson, do you want to learn more about probability?" value={rating.interest}
                   onChange={(v) => setRating({ ...rating, interest: v })} />
            <Scale label="Was it easy to understand?" value={rating.clarity}
                   onChange={(v) => setRating({ ...rating, clarity: v })} />
            <div className="card">
              <p><b>Which part did you like most?</b></p>
              <select value={rating.likedMost} onChange={(e) => setRating({ ...rating, likedMost: e.target.value })}>
                <option value="">Select</option>
                {meta.liked.map((l) => <option key={l}>{l}</option>)}
              </select>
              <p><b>Which language did you use?</b></p>
              <select value={rating.language} onChange={(e) => setRating({ ...rating, language: e.target.value })}>
                <option value="">Select</option><option value="tamil">Tamil</option>
                <option value="english">English</option><option value="both">Both</option>
              </select>
              <p><b>Anything confusing, or anything you want added? (optional)</b></p>
              <textarea rows={3} maxLength={1000} value={rating.comment}
                        onChange={(e) => setRating({ ...rating, comment: e.target.value })} />
            </div>
            {error && <p className="error">{error}</p>}
            <button disabled={!ready || busy} onClick={() => send('/feedback/post', { answers, ...rating })}>Submit feedback</button>
        </>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Thank you!</h2>
      <p>Before the lesson you got <b>{mine.pre.score} / {qs.length}</b>. After: <b>{mine.post.score} / {qs.length}</b>.</p>
      <p className="muted">Your feedback decides how every future lesson is made.</p>
    </div>
  );
}
