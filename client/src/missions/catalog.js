// ---------------------------------------------------------------
// The whole Enovix journey: 7 worlds, every lesson, every mission.
// status: 'live' = open now · 'soon' = shown as "Coming soon".
// Opening a lesson or mission later = flip its status to 'live'
// (and add its files). No component needs to change.
//
// Two products grow one function at a time across all worlds:
//   🎮 Campus Quest — a non-violent campus game
//   🏢 CampusOps    — a real college operations app
// Text is { en, ta }; when ta is missing the UI falls back to en.
// ---------------------------------------------------------------
const L = (id, en, ta, status, missions = [], extra = {}) => ({ id, title: { en, ta: ta || en }, status, missions, ...extra });
const M = (id, product, en, status = 'soon') => ({ id, product, title: { en }, status });

export const products = {
  game: { name: 'Campus Quest', emoji: '🎮', blurb: { en: 'A campus adventure game you build one function at a time.', ta: 'ஒவ்வொரு function-ஆ நீங்களே build பண்ற campus adventure game.' } },
  app:  { name: 'CampusOps', emoji: '🏢', blurb: { en: 'A real college operations app: attendance, fests, fees, dashboards.', ta: 'உண்மையான college operations app: attendance, fests, fees, dashboards.' } },
};

export const worlds = [
  { id: 1, title: { en: 'The maths that runs everything', ta: 'எல்லாத்தையும் ஓட்டுற maths' },
    unlocks: { game: 'Walking, rain, day/night, random chests', app: 'Geofenced attendance, reports, forecasts' },
    lessons: [
      L('probability', 'Probability: why should I even study this?', 'Probability: இதை ஏன் படிக்கணும்?', 'live',
        [M('pickItem', 'game', 'Open the mystery chest', 'live'), M('otpBreakChance', 'app', 'Choose a safe OTP policy', 'live')], { route: '/enovix/probability' }),
      L('sincos-a', 'sin & cos A: from zero', 'sin & cos A: zero-ல இருந்து', 'live',
        [M('moveToward', 'game', 'Walk in any direction', 'live')], { route: '/enovix/sincos-a' }),
      L('sincos-b', 'sin & cos B: on the Earth', 'sin & cos B: பூமியில', 'live',
        [M('isInsideCampus', 'app', 'Geofenced attendance', 'live')], { route: '/enovix/sincos-b' }),
      L('sincos-c', 'sin & cos C: waves everywhere', 'sin & cos C: எங்கும் waves', 'live',
        [M('rainSway', 'game', 'Make it rain on campus', 'live'), M('peakHour', 'app', 'Find the daily busy hour')], { route: '/enovix/sincos-c' }),
      L('statistics', 'Statistics: why the average lies', '', 'soon', [M('leaderboardStats', 'game', 'Mean vs median on the leaderboard'), M('attendanceReport', 'app', 'Attendance report with outliers')]),
      L('polynomials', 'Polynomials: how data learns a curve', '', 'soon', [M('predictFootfall', 'app', 'Forecast the fest crowd')]),
      L('vectors', 'Vectors & matrices: rotating the world', '', 'soon', [M('rotateSprite', 'game', 'Rotate a sprite')]),
      L('gradient', 'Gradient descent: how AI learns', '', 'soon', [M('tuneDifficulty', 'game', 'A game that adapts to you'), M('learnPrice', 'app', 'Fit a simple model')]),
      L('fourier', 'Fourier: from heat to Shazam', '', 'soon', [M('dominantFrequency', 'app', 'Spot a failing machine from its vibration')]),
    ] },
  { id: 2, title: { en: 'How a computer really works', ta: 'Computer உண்மையா எப்படி வேலை செய்யுது' },
    unlocks: { game: 'Smooth game loop, cached sprites', app: 'Correct money handling, no double-booking' },
    lessons: [
      L('binary', 'Binary & hex: colours, permissions, everything', '', 'soon', [M('hexToRgb', 'game', 'Theme colours from hex'), M('packPermissions', 'app', 'Role permissions as bits')]),
      L('floats', 'Why 0.1 + 0.2 ≠ 0.3', '', 'soon', [M('addFees', 'app', 'Money in paise, never floats')]),
      L('cpu', 'The CPU and the game loop', '', 'soon', [M('update', 'game', 'A fixed-timestep game loop')]),
      L('cache', 'Memory & cache', '', 'soon', [M('spriteCache', 'game', 'An LRU sprite cache'), M('getProfileCached', 'app', 'Cache student profiles')]),
      L('scheduling', 'How the OS shares one CPU', '', 'soon', [M('roundRobin', 'app', 'Report-generation job queue')]),
      L('concurrency', 'Concurrency: two clicks, one seat', '', 'soon', [M('bookSeat', 'app', 'Stop fest double-booking')]),
    ] },
  { id: 3, title: { en: 'Data structures with a purpose', ta: 'நோக்கத்தோட Data structures' },
    unlocks: { game: 'A campus guide with pathfinding', app: 'Instant search across every student' },
    lessons: [
      L('bigo', 'Big-O: why code dies at 1 lakh users', '', 'soon', [M('findPlayer', 'game', 'Loop vs Map lookup'), M('searchStudent', 'app', 'Search 10,000 students')]),
      L('hashing', 'Hashing: instant lookups', '', 'soon', [M('spatialGrid', 'game', "What's near me?"), M('rollNumberIndex', 'app', 'Roll-number index')]),
      L('stacks', 'Stacks & queues', '', 'soon', [M('undoMove', 'game', 'Undo'), M('ticketQueue', 'app', 'Fair fest entry queue')]),
      L('search', 'Binary search & trees: why indexes are fast', '', 'soon', [M('findRoll', 'app', 'Find a roll number in log steps')]),
      L('graphs', 'Graphs & shortest paths', '', 'soon', [M('pathTo', 'game', 'Campus guide walks the shortest route'), M('bestBusRoute', 'app', 'College bus route')]),
      L('dp', 'Dynamic programming: remember, don\'t repeat', '', 'soon', [M('bestCollectRoute', 'game', 'Best collection route'), M('minCoins', 'app', 'Canteen change')]),
    ] },
  { id: 4, title: { en: 'Networks and the web', ta: 'Networks, web' },
    unlocks: { game: 'Multiplayer', app: 'Live dashboards' },
    lessons: [
      L('packets', 'Packets: TCP vs UDP', '', 'soon', [M('chooseChannel', 'game', 'Positions vs chat')]),
      L('http', 'What happens when you type a URL', '', 'soon', [M('attendanceApi', 'app', 'The /api/attendance handler')]),
      L('realtime', 'Real-time with WebSockets', '', 'soon', [M('broadcastPosition', 'game', 'Multiplayer positions'), M('liveDashboard', 'app', 'Live attendance dashboard')]),
      L('latency', 'Latency: why other players jump', '', 'soon', [M('lerp', 'game', 'Smooth movement')]),
    ] },
  { id: 5, title: { en: 'Data and security', ta: 'Data, security' },
    unlocks: { game: 'Saves that never corrupt', app: 'Secure login, OTP, payments' },
    lessons: [
      L('transactions', 'Transactions: money never vanishes', '', 'soon', [M('saveGame', 'game', 'Never half-save'), M('payFee', 'app', 'Commit or roll back')]),
      L('passwords', 'Why even we can\'t read your password', '', 'soon', [M('hashPassword', 'app', 'Hash with bcrypt')]),
      L('tokens', 'Tokens: how the app remembers you', '', 'soon', [M('signToken', 'app', 'JWT sign and verify')]),
      L('otp', 'OTP and two-factor login', '', 'soon', [M('verifyOtp', 'app', 'Time-based OTP')]),
      L('injection', 'Injection attacks in MERN apps', '', 'soon', [M('safeFilter', 'app', 'Block MongoDB operator injection')]),
      L('ratelimit', 'Rate limiting', '', 'soon', [M('canUseBoost', 'game', 'Boost cooldown'), M('rateLimit', 'app', 'Token bucket')]),
    ] },
  { id: 6, title: { en: 'Systems at scale', ta: 'பெரிய அளவில் systems' },
    unlocks: { game: 'Scaled game rooms', app: 'Containerised and autoscaling on Kubernetes' },
    lessons: [
      L('caching', 'Caching: why the second load is faster', '', 'soon', [M('leaderboardCache', 'game', 'Cache the leaderboard'), M('getAttendanceCached', 'app', 'Cache attendance')]),
      L('scaling', 'Vertical vs horizontal scaling', '', 'soon', [M('surviveRush', 'app', 'Survive the fest-registration rush')]),
      L('loadbalancing', 'Load balancing: L4 vs L7', '', 'soon', [M('pickRoom', 'game', 'Assign players to rooms'), M('pickServer', 'app', 'Round-robin, least-connections, path routing')]),
      L('containers', 'Containers with Docker', '', 'soon', [M('gameDockerfile', 'game', 'Dockerfile for the game server'), M('appDockerfile', 'app', 'Dockerfile for the app')]),
      L('kubernetes', 'Kubernetes: autoscaling for real', '', 'soon', [M('desiredReplicas', 'app', 'The autoscaler formula + a Deployment YAML')]),
      L('monitoring', 'Monitoring and alerts', '', 'soon', [M('fpsAlarm', 'game', 'Frame-rate alarm'), M('shouldAlert', 'app', 'p95 latency alerts')]),
    ] },
  { id: 7, title: { en: 'Hardware and sizing', ta: 'Hardware, sizing' },
    unlocks: { game: 'Sized for 500 players', app: 'Survives results day' },
    lessons: [
      L('cores', 'CPU cores and threads', '', 'soon', [M('serversNeeded', 'app', 'How many servers?')]),
      L('storage', 'RAM and storage sizing', '', 'soon', [M('saveFileSize', 'game', 'Save-file size'), M('storageFor', 'app', 'Storage for every student')]),
      L('bandwidth', 'Network bandwidth', '', 'soon', [M('bandwidthFor', 'game', 'Bandwidth for 500 players'), M('streamLectures', 'app', 'Stream lectures to 2,000 students')]),
      L('cost', 'Cost: cloud vs on-premise', '', 'soon', [M('monthlyCost', 'app', 'Monthly cost comparison')]),
      L('finalboss', '🏆 Final boss: results day at 10 AM', '', 'soon', [M('gameServerPlan', 'game', 'Server plan for 500 players'), M('resultsDayPlan', 'app', 'Size it, scale it, keep it up')]),
    ] },
];

// Handy counts for the UI.
export const allLessons = worlds.flatMap((w) => w.lessons.map((l) => ({ ...l, world: w.id })));
export const allMissions = allLessons.flatMap((l) => l.missions.map((m) => ({ ...m, lesson: l.id, world: l.world })));
