const { Comment, Review, User } = require("../models");
const ExpressError = require("../utils/ExpressErrors");

module.exports.getComments = async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findByPk(reviewId, {
    include: [
      {
        model: Comment,
        include: [{ model: User, attributes: { exclude: ["password"] } }],
      },
    ],
  });
  if (!review) {
    throw new ExpressError(400, "Review not found");
  }

  res.json({ comments: review.comments });
};

module.exports.getNestedComments = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findByPk(commentId, {
    include: [
      {
        model: Comment,
        as: "replies",
        include: [{ model: User, attributes: { exclude: ["password"] } }],
      },
    ],
  });
  if (!comment) {
    throw new ExpressError(400, "Comment not found");
  }

  res.json({ comments: comment.replies });
};

module.exports.createComment = async (req, res) => {
  const { reviewId } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  const review = await Review.findByPk(reviewId);
  if (!review) {
    throw new ExpressError(400, "Review not found");
  }

  const newComment = await Comment.create({ content, userId, reviewId });

  res.status(201).json({ newComment, message: "Comment Created" });
};

module.exports.createNestedComment = async (req, res) => {
  const { reviewId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  const parentComment = await Comment.findByPk(commentId);
  if (!parentComment) {
    throw new ExpressError(400, "Comment not found");
  }

  const reply = await Comment.create({
    content,
    userId,
    reviewId,
    parentId: commentId,
  });

  res.status(201).json({ reply, message: "Comment Created" });
};

module.exports.deleteCommentAndReplies = async (commentId) => {
  const comment = await Comment.findByPk(commentId, { include: [{ model: Comment, as: "replies" }] });
  if (!comment) return;
  for (const reply of comment.replies || []) {
    await module.exports.deleteCommentAndReplies(reply.id);
  }
  await Comment.destroy({ where: { id: commentId } });
};

module.exports.deleteComment = async (req, res) => {
  const { storeId, reviewId, commentId } = req.params;

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new ExpressError(400, "Comment not found");
  }

  if (
    !req.userId ||
    !(req.role === "admin" || req.userId == comment.userId)
  ) {
    throw new ExpressError(403, "Unauthorized to delete comment");
  }

  await this.deleteCommentAndReplies(commentId);

  await Comment.destroy({ where: { id: commentId } });

  res.status(200).json({ message: "Comment Deleted" });
};

module.exports.likeComment = async (req, res) => {
  const { reviewId, commentId } = req.params;
  const userId = req.userId;

  const user = await User.findByPk(userId);
  const target = await Comment.findByPk(commentId);
  const isLiked = await user.hasLikedComments(target);

  if (isLiked) {
    const review = await Comment.findByPk(commentId);
    review.likes = Math.max(0, (review.likes || 0) - 1);
    await review.save();

    if (!review) {
      throw new ExpressError(404, "Review not found");
    }

    if (userId) {
      await user.removeLikedComments(review);
    }

    return res.json({ message: "Review unliked successfully" });
  }
  const review = await Comment.findByPk(commentId);
  review.likes = (review.likes || 0) + 1;
  await review.save();

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  if (userId) {
    await user.addLikedComments(review);
  }
  res.json({ message: "Review liked successfully" });
};
