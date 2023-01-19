/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const updateUserInfo = async (formData) => {
	try {
		const { data } = await axios.patch(
			"http://localhost:3500/api/v1/users",
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } }
		);

		if (data.status !== "success") {
			const errMessage = data.response.data.message;
			console.log({ data });
			showAlert("error", errMessage);
			return;
		}

		showAlert("success", "Updated Successfully!");
	} catch (err) {
		console.error({ err });
		const errMessage = err.response.data.message;
		showAlert("error", errMessage);
	}
};

export const updateUserPassword = async (
	passwordCurrent,
	password,
	passwordConfirm
) => {
	if (!passwordCurrent || !password || !passwordConfirm) {
		showAlert("error", "Provide every field to update!!");
		return;
	}

	try {
		const { data } = await axios.patch(
			"http://localhost:3500/api/v1/users/updatePassword",
			{ passwordCurrent, password, passwordConfirm }
		);

		if (data.status !== "success") {
			const errMessage = data.response.data.message;
			console.log("error", { data });
			showAlert("error", errMessage);
			return;
		}

		console.log("success", { data });

		showAlert("success", "Password Changed Successfully!");
	} catch (err) {
		console.error({ err });
		const errMessage = err.response.data.message;
		showAlert("error", errMessage);
	}
};
