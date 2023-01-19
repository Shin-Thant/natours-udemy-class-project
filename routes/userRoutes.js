const express = require("express");
const {
	getAllUsers,
	deleteUser,
	updatePassword,
	updateUser,
	// paginateUser,
	getUserById,
	deleteUserPermanent,
	updateUserByAdmin,
} = require("../controller/userController");
const getMe = require("../middleware/getMe");
const resizeProfileImage = require("../middleware/resizeProfileImage");
const upload = require("../middleware/uploadFile");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRole = require("../middleware/verifyRole");
const router = express.Router();

const uploadUserProfileImage = upload.single("profileImage");

router.use(verifyJWT);

router
	.route("/")
	.get(verifyRole("admin"), getAllUsers)
	.patch(uploadUserProfileImage, resizeProfileImage, updateUser)
	.delete(deleteUser);

router.get("/me", getMe, getUserById);

router
	.route("/updatePassword")
	.patch(verifyRole("user", "admin"), updatePassword);

router.use(verifyRole("admin"));
router
	.route("/:id")
	.get(getUserById)
	.patch(verifyRole("admin"), updateUserByAdmin)
	.delete(verifyRole("admin"), deleteUserPermanent);

// !testing
// router.route("/paginate").get(paginateUser);

module.exports = router;
