// The same trophy the reaction game shows on a personal best, reused for a
// strong quiz score. Its own file so the lesson page can lazy() it: Lottie
// only downloads for a student who actually earns the trophy.
// (LottieLight + `src`: see the comment at the top of pages/Game.jsx.)
import { LottieLight as Lottie } from 'lottie-react';
import trophy from '../assets/trophy.json';

export default function Trophy({ size = 120 }) {
  return <Lottie src={trophy} autoplay loop={false} style={{ width: size, height: size }} aria-hidden="true" />;
}
