const multer = require("multer");
const AppError = require("../config/AppError");

// const UPLOAD_DIRECTORY = "public/img/users";
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"];

function fileFilter(req, file, cb) {
	if (ALLOWED_IMAGE_MIME_TYPES.indexOf(file.mimetype) === -1) {
		const fileTypeError = AppError(
			`Image type ${file.mimetype} is not allowed!`,
			400
		);

		cb(fileTypeError);
		return;
	}

	cb(null, true);
}

// *disk storage
// const multerStorage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, UPLOAD_DIRECTORY);
// 	},
// 	filename: (req, file, cb) => {
// 		// * user-<id>-<timestamp>.jpg

// 		const extension = file.mimetype.split("/")[1];
// 		const fileName = `user-${req.user._id}-${Date.now()}.${extension}`;

// 		cb(null, fileName);
// 	},
// });

// *memeory storage
// store as Buffer object
// when memory storage is used, file will not have `filename`
const multerStorage = multer.memoryStorage();

const upload = multer({
	storage: multerStorage,
	fileFilter,
});

module.exports = upload;
