const express = require("express");
const {
	getAllReviews,
	createReview,
	deleteReview,
	updateReview,
	setTourUserId,
	getReviewById,
} = require("../controller/reviewController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router({ mergeParams: true });

router.use(verifyJWT);

router
	.route("/")
	.get(getAllReviews)
	.post(verifyRole("user"), setTourUserId, createReview);

router
	.route("/:id")
	.get(getReviewById)
	.patch(verifyRole("user", "admin"), updateReview)
	.delete(verifyRole("user", "admin"), deleteReview);

module.exports = router;
