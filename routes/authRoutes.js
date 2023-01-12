const express = require("express");
const {
	register,
	login,
	forgotPassword,
	resetPassword,
	logout,
} = require("../controller/authController");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/forgotPassword", forgotPassword);

router.patch("/resetPassword/:token", resetPassword);

router.post("/logout", logout);

module.exports = router;
