const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseToUTCDay(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function calculateStreaks(dateStrings, asOfDate) {
  const asOfDay = parseToUTCDay(asOfDate);

  // Normalize
  const uniqueDays = [...new Set(dateStrings.map(parseToUTCDay))];
  const days = uniqueDays.filter((day) => day <= asOfDay).sort((a, b) => a - b);

  if (days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Compute runs
  const runs = [];
  let runLength = 1;

  for (let i = 1; i < days.length; i++) {
    const diffDays = (days[i] - days[i - 1]) / MS_PER_DAY;

    if (diffDays === 1) {
      runLength += 1;
    } else {
      runs.push({ length: runLength, endDay: days[i - 1] });
      runLength = 1;
    }
  }
  runs.push({ length: runLength, endDay: days[days.length - 1] });

  // Longest streak
  const longestStreak = Math.max(...runs.map((run) => run.length));

  // Current streak
  const finalRun = runs[runs.length - 1];
  const lastLogDay = finalRun.endDay;
  const gapDays = (asOfDay - lastLogDay) / MS_PER_DAY;

  const currentStreak = gapDays <= 1 ? finalRun.length : 0;

  return { currentStreak, longestStreak };
}

module.exports = calculateStreaks;
