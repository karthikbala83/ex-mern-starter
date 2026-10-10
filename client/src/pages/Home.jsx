import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext.jsx';

// ---------------------------------------------------------------
// The fork in the road. After login a student lands here and picks
// a side: play, or learn. Two cards, nothing else — a landing page
// that asks one question is a landing page people actually use.
// ---------------------------------------------------------------
export default function Home() {
  const { user } = useAuth();
  const gridRef = useRef(null);

  useEffect(() => {
    // stagger: the cards arrive one after the other rather than together,
    // which reads as "here are your choices" instead of a single block.
    const tween = gsap.fromTo(
      gridRef.current.children,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.12, ease: 'power2.out' }
    );
    return () => tween.kill();   // StrictMode-safe, same pattern as Login
  }, []);

  return (
    <div>
      <h2>Hello, {user?.name} 👋</h2>
      <p className="muted">What are we doing today?</p>

      <div className="home-grid" ref={gridRef}>
        <Link to="/game" className="home-card home-card-game">
          <span className="home-emoji">🎮</span>
          <h3>Game</h3>
          <p>Campus Arena — tap the dot, beat your best time, and climb the
             leaderboard against everyone on campus.</p>
          <span className="home-go">Play now →</span>
        </Link>

        <Link to="/enovix" className="home-card home-card-learn">
          <span className="home-emoji">🎓</span>
          <h3>Enovix</h3>
          <p>Learning with Fun — animated lessons with Tamil and English
             narration, live code labs, and a quiz at the end.</p>
          <span className="home-go">Start learning →</span>
        </Link>

        <Link to="/missions" className="home-card home-card-build">
          <span className="home-emoji">🚀</span>
          <h3>Missions</h3>
          <p>Apply what you learned. Write one function at a time and watch
             a real game and a real college app grow around it.</p>
          <span className="home-go">Start building →</span>
        </Link>
      </div>
    </div>
  );
}
