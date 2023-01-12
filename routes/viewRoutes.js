const express = require("express");
const {
	getOverviewPage,
	getTourPage,
	getLoginPage,
} = require("../controller/viewController");
const verifyLogin = require("../middleware/verifyLogin");
const router = express.Router();

router.use(verifyLogin);

router.get("/", getOverviewPage);

router.get("/tour/:slug", getTourPage);

router.get("/login", getLoginPage);

module.exports = router;
