const express = require("express");
const {
	getOverviewPage,
	getTourPage,
	getLoginPage,
	getAccount,
	updateUserData,
} = require("../controller/viewController");
const verifyLogin = require("../middleware/verifyLogin");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

router.get("/", verifyLogin, getOverviewPage);

router.get("/tour/:slug", verifyLogin, getTourPage);

router.get("/login", verifyLogin, getLoginPage);

router.get("/me", verifyJWT, getAccount);

router.post("/submit-user-data", verifyJWT, updateUserData);

module.exports = router;
