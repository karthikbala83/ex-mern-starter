// Public mission registry (client). Server twin: server/missions/index.js
import pickItem from './pickItem.js';
import otpBreakChance from './otpBreakChance.js';
import moveToward from './moveToward.js';
import isInsideCampus from './isInsideCampus.js';
import rainSway from './rainSway.js';

export const missions = { pickItem, otpBreakChance, moveToward, isInsideCampus, rainSway };
