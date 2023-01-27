const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");
// TODO: test `convert()` method
const { htmlToText } = require("html-to-text");

// *Description
/*
    => Sending email with the service gmail using nodemailer is weak. And email can be in spam box.
    => So, send email to mailtrap instead. mailtrap will trap the email instead.
*/

class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(" ")[0];
		this.url = url;
		this.from = process.env.EMAIL_FROM;
	}

	createTransport() {
		if (process.env.NODE_ENV !== "production") {
			// sendgrid setup

			return nodemailer.createTransport({
				host: process.env.SENDGRID_HOST,
				port: process.env.SENDGRID_PORT,
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(template, subject) {
		const templateData = {
			firstName: this.firstName,
			url: this.url,
			subject,
		};
		const templateDir = path.join(
			__dirname,
			"..",
			"views",
			"email",
			`${template}.pug`
		);
		const html = pug.renderFile(templateDir, templateData);

		const text = htmlToText(html);

		// define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text,
		};

		const transporter = this.createTransport();

		// send email
		await transporter.sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send("welcome", "Welcome to Natours Family!");
	}

	async sendPasswordReset() {
		await this.send(
			"passwordReset",
			"You password reset token (valid for only 10 minutes"
		);
	}
}

module.exports = Email;
