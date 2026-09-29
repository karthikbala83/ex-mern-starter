# Animated lessons with Sarvam voice-over

## What's here
| Path | Purpose |
|---|---|
| `client/src/lessons/probability/narration.json` | **All narration.** `en`/`ta` = captions on screen. `say.en`/`say.ta` = what the voice speaks when it must differ (fractions, symbols). Faculty review this file. |
| `client/src/lessons/probability/scenesA.js`, `scenesB.js` | Canvas animation per scene (Version A: applications first, B: life first) |
| `client/src/lessons/probability/lab.js` | Code-lab experiments in JavaScript **and** Python, with their charts |
| `client/src/lessons/probability/quiz.js` | Quiz questions (Tamil + English) |
| `client/src/lessons/index.js` | Lesson registry: add new lessons here |
| `client/src/components/LessonPlayer.jsx` | Player: one MP3 per beat, animation follows the audio clock |
| `client/src/components/CodeLab.jsx` | Run-and-see lab; Python loads in the browser only when chosen |
| `client/src/pages/Lesson.jsx` | `/lesson/probability?v=A` or `?v=B` (story + lab + quiz), `?v=C` (lab + quiz) |
| `server/scripts/generateVoice.js` | One-time Sarvam voice generation, skips unchanged lines |
| `server/scripts/auditionVoices.js` | Hear candidate voices side by side |

## Generate the voice-over (run on your machine)
```bash
cd server
# server/.env needs:  SARVAM_API_KEY=your-key   (SARVAM_KEY also works)

npm run voice:audition            # 1. writes server/voice-audition/index.html: listen, pick a voice
# add VOICE_SPEAKER=<name> (and optionally VOICE_PACE=0.92) to server/.env

npm run voice -- --dry            # 2. preview: clips and characters, no API calls
npm run voice -- --lesson probability --version B --lang ta   # 3. try one version + language first
npm run voice                     # 4. everything (96 clips, ~8,700 characters)
```
Audio lands in `client/public/audio/probability/<A|B>/<ta|en>/<beat>.mp3` with a `manifest.json`.
**Commit the MP3s and manifest**, so Vercel serves them as static files. Nothing calls Sarvam at runtime.

After a professor edits a sentence in `narration.json`, run `npm run voice` again: only changed lines regenerate.
Changing `VOICE_SPEAKER` or `VOICE_PACE` regenerates everything (use `--force` to do it deliberately).

## Pilot links
- `/lesson/probability?v=A`, `?v=B`, `?v=C`
- Feedback: `/feedback?v=A|B|C` (the "Open lesson" button now points inside this app)
