// ---------------------------------------------------------------
// Admin: who brought in the most testers ($group + $lookup on the server).
// ---------------------------------------------------------------
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ReferralStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/admin/referral-stats').then((r) => { if (!cancelled) setData(r.data); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!data) return null;
  return (
    <div className="card">
      <h3>Refer a friend</h3>
      <p className="muted">
        {data.referred} of {data.users} users joined through an invite link
        {data.users ? ` (${Math.round((data.referred / data.users) * 100)}%)` : ''}.
      </p>
      {data.top.length === 0 ? <p className="muted">No invites used yet.</p> : (
        <table>
          <thead><tr><th>#</th><th>Inviter</th><th>Friends joined</th><th>Latest</th></tr></thead>
          <tbody>
            {data.top.map((r, i) => (
              <tr key={r.email}>
                <td>{i + 1}</td>
                <td>{r.name} <span className="muted">{r.email}</span></td>
                <td><b>{r.invited}</b></td>
                <td className="muted">{new Date(r.lastJoin).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
