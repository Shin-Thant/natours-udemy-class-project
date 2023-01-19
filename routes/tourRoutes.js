const express = require("express");
const {
	createTour,
	getTourById,
	getAllTours,
	deleteTour,
	updateTour,
	getToursWithin,
	getDistance,
} = require("../controller/tourController");
const aliasTopTours = require("../middleware/aliasTopTours");
const resizeTourImages = require("../middleware/resizeTourImages");
const upload = require("../middleware/uploadFile");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRole = require("../middleware/verifyRole");
const router = express.Router();
const reviewRouter = require("./reviewRoutes");

const uploadTourImages = upload.fields([
	{ name: "imageCover", maxCount: 1 },
	{ name: "images", maxCount: 3 },
]);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router
	.route("/")
	.get(getAllTours)
	.post(verifyJWT, verifyRole("admin", "lead-guide"), createTour);

router
	.route("/:id")
	.get(getTourById)
	.patch(
		verifyJWT,
		verifyRole("admin", "lead-guide"),
		uploadTourImages,
		resizeTourImages,
		updateTour
	)
	.delete(verifyJWT, verifyRole("admin", "lead-guide"), deleteTour);

// *nested routes
// router.route('/:tourId/reviews').post(verifyJWT, createReview) // simeple but a bit comfusing
router.use("/:tourId/reviews", reviewRouter); // using express nested routing

// *geospatial route
router
	.route("/tours-within/:distance/center/:latlng/unit/:unit")
	.get(getToursWithin);

router.route("/distance/:latlng/unit/:unit").get(getDistance);

module.exports = router;
