const habitLogModel = require("../models/habitLogModel");

async function evaluatePendingReviews(userId) {
  // Expire old pending reviews
  await habitLogModel.expireStaleReviewsForUser(userId);

  // Create pending reviews for yesterday's missing check-ins
  await habitLogModel.detectMissedHabitsForUser(userId);
}

module.exports = { evaluatePendingReviews };
