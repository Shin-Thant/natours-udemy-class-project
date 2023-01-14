const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Username is required!"],
		},
		email: {
			type: String,
			required: [true, "Email is required!"],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Enter valid email!"],
		},
		photo: String,
		role: {
			type: String,
			enum: ["user", "guide", "lead-guide", "admin"],
			default: "user",
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
		},
		passwordConfirm: {
			type: String,
			required: true,
			validate: {
				validator: function (field) {
					// !use save() to update
					return field === this.password;
				},
				message: "Password and Confirm Password must be the same!",
			},
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	}
);

// userSchema.virtual("virTest").get(function () {
// 	return this.name + "-virtual123";
// });

userSchema.methods.isPasswordMatched = async function (inputedPassword) {
	// console.log({ inputedPassword, userPwd: this.password });
	return await bcrypt.compare(inputedPassword, this.password);
};

userSchema.methods.isPasswordChanged = function (tokenTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		); // in seconds

		return tokenTimestamp < changedTimestamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	// create encrypted reset token and save it in database
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	console.log({ resetToken, passwordResetToken: this.passwordResetToken });

	return resetToken;
};

userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) {
		return next();
	}

	this.passwordChangedAt = Date.now();
	next();
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	// console.log("===== hashing password =====");
	this.password = await bcrypt.hash(this.password, 10);
	this.passwordConfirm = "";

	next();
});

// userSchema.pre(/^find/, function (next) {
// 	console.log("find middleware");
// 	next();
// });

userSchema.query.byActiveUser = function () {
	return this.where("active").ne(false);
};

module.exports = model("User", userSchema);
