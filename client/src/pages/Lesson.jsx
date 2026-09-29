// /lesson/:id?v=A|B|C  — Story (A or B) → Code lab → Quiz.
// v=C shows the code lab only (used in the pilot comparison).
import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { lessons } from '../lessons/index.js';
import LessonPlayer from '../components/LessonPlayer.jsx';
import CodeLab from '../components/CodeLab.jsx';

function Quiz({ quiz, lang }) {
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(false);
  const score = quiz.filter((q, i) => picked[i] === q.a).length;
  return (
    <div>
      {quiz.map((q, i) => (
        <div className={'card quiz-q ' + (checked ? (picked[i] === q.a ? 'ok' : 'bad') : '')} key={i}>
          <p lang={lang}><b>{i + 1}. {q.q[lang]}</b></p>
          {q.o.map((o, j) => (
            <label key={j} className="fb-opt"><input type="radio" name={'q' + i} checked={picked[i] === j} onChange={() => { setPicked({ ...picked, [i]: j }); setChecked(false); }} /><span>{o}</span></label>
          ))}
          {checked && <p className="quiz-fb" lang={lang}>{picked[i] === q.a ? '✓ ' : '✗ '}{q.e[lang]}</p>}
        </div>
      ))}
      <button disabled={Object.keys(picked).length < quiz.length} onClick={() => setChecked(true)}>Check answers</button>
      {checked && <b style={{ marginLeft: 12 }}>{score} / {quiz.length}</b>}
    </div>
  );
}

export default function Lesson() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const lesson = lessons[id];
  const [lang, setLang] = useState('ta');
  if (!lesson) return <p>Lesson not found. <Link to="/notes">Back</Link></p>;

  const v = ['A', 'B', 'C'].includes(params.get('v')) ? params.get('v') : 'B';
  const story = lesson.narration.versions[v];

  return (
    <div className="lesson">
      <p className="muted">{lesson.breadcrumb}</p>
      <div className="lesson-top">
        <h2 lang={lang}>{lesson.title[lang]}</h2>
        <div className="seg" role="group" aria-label="Language">
          <button aria-pressed={lang === 'ta'} onClick={() => setLang('ta')} lang="ta">தமிழ்</button>
          <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
        </div>
      </div>

      {story && (
        <section>
          <h3 className="lesson-h">1. Watch</h3>
          <LessonPlayer lessonId={lesson.id} version={v} story={story} createScenes={lesson.scenes[v]} lang={lang} />
        </section>
      )}

      <section id="lab">
        <h3 className="lesson-h">{story ? '2. Try it in code' : 'Code lab'}</h3>
        <CodeLab createLab={lesson.createLab} lang={lang} />
      </section>

      <section>
        <h3 className="lesson-h">{story ? '3. Check yourself' : 'Check yourself'}</h3>
        <Quiz quiz={lesson.quiz} lang={lang} />
      </section>
    </div>
  );
}
