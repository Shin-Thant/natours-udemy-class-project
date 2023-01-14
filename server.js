require("dotenv").config();
require("express-async-errors");

// * handle uncaught exception error
process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
// const cors = require('cors');
const globalErrorHandler = require("./middleware/globalErrorHandler");
const connectDB = require("./config/connectDB");
const PORT = process.env.PORT || 3500;

const app = express();
let server = null;

connectDB();

// * template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES
// app.use(cors(corsOpti))

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"difficulty",
			"price",
		],
	})
);

// Test middleware
// app.use((req, res, next) => {
// 	console.log({ originalUrl: req.originalUrl });
// 	next();
// });

// 3) ROUTES
app.use("/", require("./routes/viewRoutes.js"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/tours", require("./routes/tourRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewRoutes"));

// eslint-disable-next-line no-unused-vars
app.all("*", (req, res, next) => {
	res.status(404);

	if (req.accepts("html")) {
		return res
			.status(404)
			.render("error", { title: "404", msg: "404 | Page Not Found!" });
	} else if (req.accepts("json")) {
		return res.json({ message: "404 Not Found!" });
	}

	res.type("txt").send("404 Not Found!");
});

// * global error handler
app.use(globalErrorHandler);

// * setup application
mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB!");
	server = app.listen(PORT, () => {
		console.log(`Server listening on PORT ${PORT}!!`);
		console.log("=> ✨ App Running on http://localhost:3500");
	});
});

// * mongoose error handlers
mongoose.connection.on("disconnected", () => {
	console.log("=> MongoDB connection lost!!!");
});
mongoose.connection.on("error", (err) => {
	console.log("MongoDB Error!!!", { err });
});

// * handle unhandled rejection error
process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! 💥 Shutting down...");
	console.log({ name: err.name, msg: err.message });

	if (server === null) return;
	server.close(() => {
		process.exit(1);
	});
});
