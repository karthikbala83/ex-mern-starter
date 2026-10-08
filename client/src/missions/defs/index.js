// Public mission registry (client). Server twin: server/missions/index.js
import pickItem from './pickItem.js';
import otpBreakChance from './otpBreakChance.js';
import moveToward from './moveToward.js';
import isInsideCampus from './isInsideCampus.js';
import rainSway from './rainSway.js';
import leaderboardStats from './leaderboardStats.js';
import attendanceReport from './attendanceReport.js';
import jumpHeight from './jumpHeight.js';
import predictFootfall from './predictFootfall.js';
import learnPrice from './learnPrice.js';
import tuneDifficulty from './tuneDifficulty.js';
import waveStrength from './waveStrength.js';
import dominantFrequency from './dominantFrequency.js';
import rotateSprite from './rotateSprite.js';
import clubMatch from './clubMatch.js';

export const missions = { pickItem, otpBreakChance, moveToward, isInsideCampus, rainSway, leaderboardStats, attendanceReport, jumpHeight, predictFootfall, learnPrice, tuneDifficulty, waveStrength, dominantFrequency, rotateSprite, clubMatch };
