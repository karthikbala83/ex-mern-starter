// Registry of server-side mission references. Add a file, add a line.
module.exports = {
  pickItem: require('./pickItem'),
  otpBreakChance: require('./otpBreakChance'),
  moveToward: require('./moveToward'),
  isInsideCampus: require('./isInsideCampus'),
  rainSway: require('./rainSway'),
  leaderboardStats: require('./leaderboardStats'),
  attendanceReport: require('./attendanceReport'),
  jumpHeight: require('./jumpHeight'),
  predictFootfall: require('./predictFootfall'),
  learnPrice: require('./learnPrice'),
  tuneDifficulty: require('./tuneDifficulty'),
  waveStrength: require('./waveStrength'),
  dominantFrequency: require('./dominantFrequency'),
};
