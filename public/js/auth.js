/* eslint-disable */
import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
	if (!email || !password) {
		console.error("Email and password are required!");
		return;
	}

	try {
		const { data: result } = await axios.post(
			"http://localhost:3500/api/v1/auth/login",
			{
				email,
				password,
			}
		);

		if (result.status !== "success") {
			const errMessage = result.response.data.message;
			console.log({ result });
			showAlert("error", errMessage);
			return;
		}

		showAlert("success", "Login Successfully!");

		// navigate to home page
		window.setTimeout(() => {
			console.log("navigating...");
			location.assign("/");
		}, 1500);

		console.log({ result });
	} catch (err) {
		console.error({ err });
		const errMessage = err.response.data.message;
		showAlert("error", errMessage);
	}
};

export const logout = async () => {
	try {
		const { data } = await axios.post("http://localhost:3500/api/v1/auth/logout");

		if (data.status !== "success") {
			const errMessage = err.response.data.message;
			showAlert("err", errMessage);
			return;
		}

		showAlert("success", "Logout Successfully!");

		// reload page
		location.reload(true);
	} catch (err) {
		console.log({ err });
		const errMessage = err.response.data.message;
		showAlert("error", errMessage);
	}
};
