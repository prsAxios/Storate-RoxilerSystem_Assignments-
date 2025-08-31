const express = require("express");
const storeController = require("../controller/store.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { authorization } = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");
const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  getReview,
} = require("../controller/reviews.js");
const {
  getComments,
  createComment,
  createNestedComment,
  deleteComment,
  getNestedComments,
  likeComment,
} = require("../controller/comments.js");

router
  .route("/")
  .get(wrapAsync(storeController.getAllStores))
  .post(
    authorization,
    upload.single("image"),
    wrapAsync(storeController.createStore)
  );

router
  .route("/:id")
  .get(wrapAsync(storeController.getStore))
  .put(
    authorization,
    upload.single("image"),
    wrapAsync(storeController.updateStore)
  )
  .delete(authorization, wrapAsync(storeController.deleteStore));

// Serve store image from database
router.get(
  "/:id/image",
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const { Store } = require("../models/index.js");
    const store = await Store.findByPk(id);
    if (!store || !store.image_data) {
      return res.status(404).send("Image not found");
    }
    res.setHeader("Content-Type", store.image_mime || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(store.image_data);
  })
);

router
  .route("/:id/reviews")
  .get(wrapAsync(getAllReviews))
  .post(authorization, wrapAsync(createReview));

router.route("/:id/reviews/me").get(authorization, wrapAsync(getReview));

router
  .route("/:id/reviews/:reviewId/like")
  .post(authorization, wrapAsync(likeReview));

router
  .route("/:id/reviews/:reviewId/comments/:commentId/like")
  .post(authorization, wrapAsync(likeComment));

router
  .route("/:id/reviews/:reviewId")
  .put(authorization, wrapAsync(updateReview))
  .delete(authorization, wrapAsync(deleteReview));

router
  .route("/:storeId/reviews/:reviewId/comments")
  .get(wrapAsync(getComments))
  .post(authorization, wrapAsync(createComment));

router
  .route("/:storeId/reviews/:reviewId/comments/:commentId")
  .get(wrapAsync(getNestedComments))
  .post(authorization, wrapAsync(createNestedComment))
  .delete(authorization, wrapAsync(deleteComment));

module.exports = router;
