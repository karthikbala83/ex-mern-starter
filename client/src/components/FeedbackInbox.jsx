// ---------------------------------------------------------------
// Admin feedback INBOX — newest first, filter by type and status,
// $text search, triage (New -> Seen -> Fixed), export to CSV.
//
// Note the empty search box still shows results (the latest ones) —
// an empty state that shows nothing teaches the admin nothing.
// ---------------------------------------------------------------
import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import { FEEDBACK_TYPES } from './FeedbackForm.jsx';

const STATUSES = ['new', 'seen', 'fixed'];

// A user agent is a long, ugly string. The admin needs "Android · Chrome".
export function shortDevice(ua = '') {
  const os = /iPhone|iPad/.test(ua) ? (ua.includes('iPad') ? 'iPad' : 'iPhone')
    : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : '';
  const browser = /Edg\//.test(ua) ? 'Edge' : /SamsungBrowser/.test(ua) ? 'Samsung' : /CriOS|Chrome\//.test(ua) ? 'Chrome'
    : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : '';
  return [os, browser].filter(Boolean).join(' · ') || (ua ? 'Other' : '—');
}

// CSV by hand: wrap every field in quotes and double any quote inside it.
// That one rule is the whole of CSV escaping — commas and newlines inside
// quotes are then safe. The BOM (﻿) makes Excel read Tamil correctly.
function toCsv(items) {
  const cols = ['createdAt', 'type', 'status', 'rating', 'name', 'email', 'lesson', 'step', 'page', 'device', 'message'];
  const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = items.map((f) => [f.createdAt, f.type, f.status, f.rating, f.user?.name, f.user?.email,
    f.lesson, f.step, f.page, shortDevice(f.device), f.message].map(cell).join(','));
  return '﻿' + [cols.join(','), ...rows].join('\r\n');
}

export default function FeedbackInbox() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async (term = q) => {
    setError('');
    try {
      const { data } = await api.get('/admin/feedback', { params: { q: term, type, status, limit: 200 } });
      setData(data);
    } catch {
      setError('Could not load feedback.');
    }
  }, [q, type, status]);

  // Reload when a filter chip changes (search reloads on Enter / button).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [type, status]);

  const setItemStatus = async (id, next) => {
    // Optimistic: the row changes at once, and goes back if the server says no.
    setData((d) => ({ ...d, items: d.items.map((f) => (f._id === id ? { ...f, status: next } : f)) }));
    try { await api.patch(`/admin/feedback/${id}`, { status: next }); } catch { load(); }
  };

  const download = () => {
    const blob = new Blob([toCsv(data?.items ?? [])], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const counts = data?.counts ?? { type: {}, status: {} };
  const chip = (active, onClick, label, n) => (
    <button className={'tag' + (active ? ' active' : '')} onClick={onClick}>{label}{n !== undefined ? ` (${n})` : ''}</button>
  );

  return (
    <div className="card">
      <div className="inbox-head">
        <h3>Feedback inbox</h3>
        <button className="lp-ghost" onClick={download} disabled={!data?.items?.length}>Export CSV</button>
      </div>

      <div className="tag-row">
        {chip(!status, () => setStatus(''), 'All')}
        {STATUSES.map((s) => chip(status === s, () => setStatus(s), s[0].toUpperCase() + s.slice(1), counts.status[s] ?? 0))}
      </div>
      <div className="tag-row">
        {chip(!type, () => setType(''), 'All types')}
        {FEEDBACK_TYPES.map((tp) => chip(type === tp.id, () => setType(tp.id), `${tp.emoji} ${tp.en}`, counts.type[tp.id] ?? 0))}
      </div>
      <div className="ref-row">
        <input placeholder="Search feedback (try: video)" value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(q)} />
        <button onClick={() => load(q)}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}
      {data?.searched && <p className="muted">{data.items.length} match(es) for "{data.q}", best match first.</p>}

      <div className="inbox-list">
        {data?.items.length === 0 && <p className="muted">No feedback here.</p>}
        {data?.items.map((f) => {
          const tp = FEEDBACK_TYPES.find((x) => x.id === f.type) ?? FEEDBACK_TYPES.at(-1);
          return (
            <div key={f._id} className={'inbox-item status-' + f.status}>
              <div className="inbox-meta">
                <span className="badge">{tp.emoji} {tp.en}</span>
                {f.rating ? <span className="inbox-stars" aria-label={`${f.rating} stars`}>{'★'.repeat(f.rating)}</span> : null}
                <b>{f.user?.name || '—'}</b>
                <span className="muted">{f.user?.email}</span>
                <span className="muted">· {new Date(f.createdAt).toLocaleString()}</span>
              </div>
              <p className="inbox-msg">{f.message}</p>
              <div className="inbox-meta muted">
                {f.lesson && <span>📍 {f.lesson}{f.step ? ` › ${f.step}` : ''}</span>}
                {!f.lesson && f.page && <span>📍 {f.page}</span>}
                {f.device && <span title={f.device}>📱 {shortDevice(f.device)}</span>}
                <select className="inbox-status" value={f.status} onChange={(e) => setItemStatus(f._id, e.target.value)} aria-label="Status">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
