const nodemailer = require("nodemailer");

// *Description
/*
    => Sending email with the service gmail using nodemailer is weak. And email can be in spam box.
    => So, send email to mailtrap instead. mailtrap will trap the email instead.
*/

const sendEmail = async (options) => {
	// create transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// define email options
	const mailOptions = {
		from: "Handsome Man!✨ <kwee@shin.com>",
		to: options.email,
		subject: options.subject,
		text: options.message,
		// html:
	};

	// send email
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
