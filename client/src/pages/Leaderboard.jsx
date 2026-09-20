import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';
import ReferralCard from '../components/ReferralCard.jsx';

const MEDALS = ['🥇', '🥈', '🥉'];   // index 0,1,2 -> ranks 1,2,3

export default function Leaderboard() {
  const [board, setBoard] = useState(null);
  const [nearby, setNearby] = useState(null);
  const [geoMsg, setGeoMsg] = useState('');
  const [locating, setLocating] = useState(false);
  const { toast } = useToast();
  const cardRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/game/leaderboard')
      .then((r) => { if (!cancelled) setBoard(r.data); })
      .catch(() => {});
    loadNearby();
    return () => { cancelled = true; };
  }, []);

  // Card entrance — same StrictMode-safe fromTo + kill() pattern as Login.
  useEffect(() => {
    if (!board || !cardRef.current) return;
    const tween = gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
    return () => tween.kill();
  }, [board]);

  const loadNearby = async () => {
    try {
      const { data } = await api.get('/game/nearby');
      setNearby(data.players);
      setGeoMsg('');
    } catch (err) {
      // 400 = "you haven't shared a location". That's the normal first-visit
      // state, not an error to apologise for — it's the prompt to opt in.
      setNearby(null);
      setGeoMsg(err.response?.data?.message || 'Could not load nearby players');
    }
  };

  // ---- Geolocation ONLY on an explicit tap. Never on page load. ----
  // A permission prompt the user did not ask for gets denied on reflex,
  // and browsers remember that "no" for the whole origin.
  const shareLocation = () => {
    if (!navigator.geolocation) return setGeoMsg('This browser has no location support.');
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // We send full precision; the SERVER rounds it to ~1 km before
          // storing. Doing it there means a hand-written API call can't
          // opt out of the privacy rule.
          await api.put('/users/location', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          toast('Location saved — finding players near you', 'success');
          await loadNearby();
        } finally {
          setLocating(false);
        }
      },
      () => {
        // Denied or unavailable. Stay friendly and leave the feature off —
        // never nag, and never re-prompt automatically.
        setLocating(false);
        setGeoMsg('No problem — nearby players stay hidden until you share your location.');
      }
    );
  };

  if (!board) return <p>Loading leaderboard…</p>;

  return (
    <div>
      <h2>Leaderboard</h2>

      {/* My rank, computed by $setWindowFields on the server */}
      <div className="card my-rank" ref={cardRef}>
        {board.me ? (
          <>
            <span className="rank-num">#{board.me.rank}</span>
            <div>
              <strong>Your rank</strong>
              <p className="muted">Best time {board.me.scoreMs}ms</p>
            </div>
          </>
        ) : (
          <p className="muted">You haven't played yet — play a game to get ranked.</p>
        )}
      </div>

      <div className="card">
        <h3>Top 20</h3>
        <table>
          <thead><tr><th>Rank</th><th>Player</th><th>Best time</th></tr></thead>
          <tbody>
            {board.top.map((p) => (
              <tr key={p._id} className={p.rank <= 3 ? `medal medal-${p.rank}` : ''}>
                <td>{MEDALS[p.rank - 1] || p.rank}</td>
                <td>{p.name}</td>
                <td>{p.bestScoreMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Players near you</h3>
        {geoMsg && <p className="muted">{geoMsg}</p>}

        {!nearby && (
          <button onClick={shareLocation} disabled={locating}>
            {locating ? 'Locating…' : 'Share my location'}
          </button>
        )}

        {nearby && nearby.length === 0 && (
          <p className="muted">Nobody else within 25 km yet.</p>
        )}

        {nearby && nearby.length > 0 && (
          <table>
            <thead><tr><th>Player</th><th>Best time</th><th>Distance</th></tr></thead>
            <tbody>
              {nearby.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{p.bestScoreMs ? `${p.bestScoreMs}ms` : '—'}</td>
                  <td>{p.distanceKm} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ReferralCard />
    </div>
  );
}
