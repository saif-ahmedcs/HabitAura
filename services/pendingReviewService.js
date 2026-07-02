const habitLogModel = require("../models/habitLogModel");
const { getPreviousUtcDate } = require("../utils/reviewWindow");
const calculateStreaks = require("../utils/streak");

async function evaluatePendingReviews() {
  // Expire first
  await habitLogModel.expireStaleReviews();

  // Detect second
  const yesterday = getPreviousUtcDate();
  const candidates = await habitLogModel.getHabitsMissingLogForDate(yesterday);

  for (const habit of candidates) {
    const existingPending = await habitLogModel.findPendingByHabit(habit.id);
    if (existingPending) {
      continue;
    }

    const rawLogs = await habitLogModel.getLogsForHabit(habit.id);
    const logs = rawLogs.map((log) => ({
      date: log.log_date,
      status: log.status,
    }));

    // Check whether a streak was alive going into the missed day (as of
    // the day before the gap), not as of yesterday itself
    const dayBeforeGap = getPreviousUtcDate(new Date(`${yesterday}T00:00:00Z`));
    const { currentStreak } = calculateStreaks(logs, dayBeforeGap);

    if (currentStreak > 0) {
      await habitLogModel.insertPendingReview(habit.id, yesterday);
    }
  }
}

module.exports = { evaluatePendingReviews };
