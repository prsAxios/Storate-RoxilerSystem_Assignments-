const { Review, User } = require("../models");
const ExpressError = require("../utils/ExpressErrors");
const { deleteCommentAndReplies } = require("./comments");

module.exports.getAllReviews = async (req, res) => {
  const storeId = req.params.id;

  const reviews = await Review.findAll({
    where: { storeId },
    include: [{ model: User, attributes: { exclude: ["password"] } }],
  });

  res.json({ reviews });
};

module.exports.getReview = async (req, res) => {
  const storeId = req.params.id;
  const userId = req.userId;

  const review = await Review.findOne({
    where: { storeId, userId },
    include: [{ model: User, attributes: { exclude: ["password"] } }],
  });
  res.send(review);
};

module.exports.createReview = async (req, res) => {
  const storeId = req.params.id;
  const { content, rating } = req.body;
  const userId = req.userId;

  const review = await Review.create({ storeId, content, rating, userId });

  res.json({ review, message: "Review Created" });
};

module.exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.userId;

  const review = await Review.findByPk(reviewId);
  if (!review) {
    throw new ExpressError(400, "Review not found");
  }

  if (review.userId != userId) {
    throw new ExpressError(403, "Unauthorized to update this review");
  }

  review.content = content || review.content;
  review.rating = rating || review.rating;

  await review.save();

  res.json({ review, message: "Review Updated" });
};

module.exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findByPk(reviewId);
  if (!review) {
    throw new ExpressError(400, "Review not found");
  }

  if (
    !req.userId ||
    !(req.role === "admin" || req.userId == review.userId)
  ) {
    throw new ExpressError(403, "Unauthorized to delete Review");
  }
  
  const replies = review.comments;
  for (const replyId of replies) {
    await deleteCommentAndReplies(replyId);
  }
  
  await Review.destroy({ where: { id: reviewId } });

  res.json({ message: "Review Deleted" });
};

module.exports.likeReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.userId;

  const user = await User.findByPk(userId);
  const liked = await user.hasLikedReviews(await Review.findByPk(reviewId));
  const isLiked = liked;

  if (isLiked) {
    const review = await Review.findByPk(reviewId);
    review.likes = Math.max(0, (review.likes || 0) - 1);
    await review.save();

    if (!review) {
      throw new ExpressError(404, "Review not found");
    }

    if (userId) {
      await user.removeLikedReviews(review);
    }

    return res.json({ message: "Review unliked successfully" });
  }
  const review = await Review.findByPk(reviewId);
  review.likes = (review.likes || 0) + 1;
  await review.save();

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  if (userId) {
    await user.addLikedReviews(review);
  }
  res.json({ message: "Review liked successfully" });
};
