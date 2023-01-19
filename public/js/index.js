/* eslint-disable */
import { showAlert } from "./alert";
import { login, logout } from "./auth";
import { updateUserInfo, updateUserPassword } from "./updateUserData";

const loginForm = document.querySelector(".form.form--login");
const loginEmailInput = document.getElementById("email");
const loginPasswordInput = document.getElementById("password");

const logoutBtn = document.querySelector(".nav__el--logout");

const settingForm = document.querySelector(".form-user-data");
const userNameSettingInput = document.querySelector(
	".form__input--name-setting"
);
const userEmailSettingInput = document.querySelector(
	".form__input--email-setting"
);
const userImageSettingInput = document.querySelector(
	".form__input--profileImg-setting"
);

const pwdUpdateForm = document.querySelector(".form-user-password");
const currentPwdUpdateInput = document.querySelector(".pwd-update--current");
const newPwdUpdateInput = document.querySelector(".pwd-update--new");
const newPwdConfirmUpdateInput = document.querySelector(
	".pwd-update--new-confirm"
);
const pwdFormSubmitBtn = document.querySelector(".btn--save-password");

function checkPasswordsMatched(pwd, confirmPwd) {
	if (pwd.length !== confirmPwd.length) {
		return false;
	}

	return pwd.split("").every((alp, index) => confirmPwd[index] === alp);
}
function resetPasswordInputValues() {
	currentPwdUpdateInput.value = "";
	newPwdUpdateInput.value = "";
	newPwdConfirmUpdateInput.value = "";
}

if (loginForm) {
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();

		login(loginEmailInput.value, loginPasswordInput.value);
	});
}

if (logoutBtn) {
	logoutBtn.addEventListener("click", () => {
		logout();
	});
}

if (settingForm) {
	settingForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const formData = new FormData();

		const name = userNameSettingInput.value;
		const email = userEmailSettingInput.value;
		const image = userImageSettingInput.files;

		formData.append("name", name);
		formData.append("email", email);
		formData.append("profileImage", image[0]);

		updateUserInfo(formData);
	});
}

if (pwdUpdateForm) {
	pwdUpdateForm.addEventListener("submit", (e) => {
		e.preventDefault();

		pwdFormSubmitBtn.textContent = "Updating...";

		const currentPassword = currentPwdUpdateInput.value;
		const newPassword = newPwdUpdateInput.value;
		const confirmPassword = newPwdConfirmUpdateInput.value;

		if (!checkPasswordsMatched(newPassword, confirmPassword)) {
			showAlert(
				"error",
				"Password and Confirm Password must be the same!"
			);
			return;
		}

		updateUserPassword(currentPassword, newPassword, confirmPassword).then(
			() => {
				// reset input values
				pwdFormSubmitBtn.textContent = "Save Password";
				resetPasswordInputValues();
			}
		);
	});
}
