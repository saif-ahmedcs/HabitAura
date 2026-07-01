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
    const logs = await habitLogModel.getLogsForHabit(habit.id);

    const dateStrings = logs
      .filter(
        (log) =>
          log.status === "completed" ||
          log.status === "recovered" ||
          log.status === "shielded",
      )
      .map((log) => log.log_date);

    const dayBeforeGap = getPreviousUtcDate(new Date(`${yesterday}T00:00:00Z`));
    const { currentStreak } = calculateStreaks(dateStrings, dayBeforeGap);

    if (currentStreak > 0) {
      await habitLogModel.insertPendingReview(habit.id, yesterday);
    }
  }
}

module.exports = { evaluatePendingReviews };
