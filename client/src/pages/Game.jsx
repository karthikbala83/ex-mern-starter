import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MdLeaderboard, MdReplay } from 'react-icons/md';
import gsap from 'gsap';
// lottie-react v3 exports NAMED components, not a default one, and takes the
// animation as `src`. (v2 used `import Lottie from …` with `animationData` —
// you'll still see that in most tutorials; check the version before copying.)
//
// LottieLight, not Lottie: it ships the smallest renderer, which draws shapes
// and transforms but cannot run "expressions" (little scripts some animations
// embed). Our trophy is hand-written shapes, so it doesn't need them — and
// skipping that engine cuts ~250 kB off what every visitor downloads.
// If you swap in a downloaded animation and it renders blank, that's the
// reason: switch this import to { Lottie } for the full build.
import { LottieLight as Lottie } from 'lottie-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext.jsx';
import trophy from '../assets/trophy.json';

// ---------------------------------------------------------------
// The reaction game. Four states, one at a time:
//   idle -> countdown(3,2,1) -> playing(10 dots) -> result
// A single `phase` string drives the whole screen. Resist the urge
// to add isPlaying / isDone / showResult booleans: four booleans
// can express twelve nonsense combinations, one string cannot.
// ---------------------------------------------------------------
const TARGETS = 10;
const ARENA_W = 320;
const ARENA_H = 420;
const DOT = 56;

// Keep the dot fully inside the arena: never closer to an edge than its own size.
// Positions are FRACTIONS of the free space, not pixels: on a phone narrower
// than ARENA_W the arena shrinks to fit (max-width: 100%), and a pixel
// position picked for 320px could put the dot outside a 284px arena.
const randomSpot = () => ({ fx: Math.random(), fy: Math.random() });

// 34252 -> "34.25"
const secs = (ms) => (Number(ms || 0) / 1000).toFixed(2);

export default function Game() {
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(3);
  const [hits, setHits] = useState(0);
  const [spot, setSpot] = useState(randomSpot);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Refs hold values the RENDER never needs to show:
  // the server's game id, and the high-resolution start time.
  const gameId = useRef(null);
  const startedAt = useRef(0);
  const dotRef = useRef(null);
  const scoreRef = useRef(null);

  // ---- Start: ask the SERVER for a game before showing anything ----
  const start = async () => {
    setError('');
    try {
      const { data } = await api.post('/game/start');
      gameId.current = data.gameId;   // the server's clock is now running
      setHits(0);
      setResult(null);
      setCount(3);
      setPhase('countdown');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start the game');
    }
  };

  // ---- Countdown 3, 2, 1 -> playing ----
  useEffect(() => {
    if (phase !== 'countdown') return;      // effects run on every render; leave early

    const id = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        clearInterval(id);
        // performance.now() instead of Date.now(): it is monotonic (it cannot
        // jump when the OS clock changes) and sub-millisecond accurate.
        // This measures the UI only — the server does its own timing regardless.
        startedAt.current = performance.now();
        setSpot(randomSpot());
        setPhase('playing');
        return 1;
      });
    }, 700);

    return () => clearInterval(id);          // cleanup, always
  }, [phase]);

  // ---- Each new dot pops in ----
  useEffect(() => {
    if (phase !== 'playing' || !dotRef.current) return;
    const tween = gsap.fromTo(
      dotRef.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.18, ease: 'back.out(3)' }
    );
    return () => tween.kill();
  }, [phase, spot]);   // re-runs whenever the dot moves — that IS each new target

  // ---- Finish: send the score, let the server judge it ----
  const finish = useCallback(async (scoreMs) => {
    setPhase('sending');
    try {
      const { data } = await api.post('/game/finish', {
        gameId: gameId.current,
        scoreMs: Math.round(scoreMs),
      });
      setResult(data);
      setPhase('result');
      if (data.isPersonalBest) toast(`New personal best: ${data.scoreMs}ms!`, 'success');
    } catch (err) {
      // A 400 here is the anti-cheat talking. Show its words verbatim.
      setError(err.response?.data?.message || 'Could not save the score');
      setPhase('idle');
    }
  }, [toast]);

  const tapDot = () => {
    const next = hits + 1;
    setHits(next);
    if (next >= TARGETS) finish(performance.now() - startedAt.current);
    else setSpot(randomSpot());
  };

  // ---- Count the result number up from zero ----
  useEffect(() => {
    if (phase !== 'result' || !scoreRef.current || !result) return;

    // GSAP animates a plain object, and we write the number into the DOM
    // ourselves on each frame. Animating a number is not a CSS property,
    // so there is nothing for the browser to tween — we do it by hand.
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: result.scoreMs,
      duration: 1,
      ease: 'power1.out',
      onUpdate: () => {
        if (scoreRef.current) scoreRef.current.textContent = secs(obj.n);
      },
    });
    return () => tween.kill();
  }, [phase, result]);

  return (
    <div>
      <h2>Campus Arena</h2>
      <p className="muted">Tap Start, then tap the dot {TARGETS} times as fast as you can.</p>
      {error && <p className="error">{error}</p>}

      <div className="arena" style={{ width: ARENA_W, height: ARENA_H, maxWidth: '100%' }}>
        {phase === 'idle' && (
          <div className="arena-center">
            <button onClick={start}>Start</button>
          </div>
        )}

        {phase === 'countdown' && <div className="arena-center countdown">{count}</div>}

        {phase === 'playing' && (
          <button
            ref={dotRef}
            className="dot"
            style={{ left: `calc(${spot.fx} * (100% - ${DOT}px))`, top: `calc(${spot.fy} * (100% - ${DOT}px))`, width: DOT, height: DOT }}
            onClick={tapDot}
          >
            {TARGETS - hits}
          </button>
        )}

        {phase === 'sending' && <div className="arena-center muted">Checking with the server…</div>}

        {phase === 'result' && result && (
          <div className="arena-center result">
            {/* ONE Lottie, and only when it is earned. An animation that plays
                every time stops meaning anything. loop={false} — it's a reward,
                not a decoration. */}
            {result.isPersonalBest && (
              <Lottie src={trophy} autoplay loop={false} style={{ width: 120, height: 120 }} />
            )}
            {/* Seconds, not milliseconds: "34.25 s" is readable, "34252ms" is
                a number to decode. The server still stores exact ms. */}
            <p className="big-score"><span ref={scoreRef}>0.00</span><small> s</small></p>
            <div className="result-stats">
              <span><small>Best</small><b>{secs(result.bestScoreMs)} s</b></span>
              <span><small>Rank</small><b>#{result.rank}</b></span>
            </div>
            {result.isPersonalBest && <p className="info">New personal best!</p>}
            <div className="result-actions">
              <button onClick={start}><MdReplay aria-hidden="true" /> Play again</button>
              <Link className="fb-open" to="/leaderboard"><MdLeaderboard aria-hidden="true" /> Leaderboard</Link>
            </div>
          </div>
        )}
      </div>

      {phase === 'playing' && (
        <p className="muted">{hits} / {TARGETS} tapped</p>
      )}
    </div>
  );
}
