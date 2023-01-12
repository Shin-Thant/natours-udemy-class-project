/* eslint-disable */
import { login, logout } from "./auth";

const loginForm = document.querySelector(".form.form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

if (loginForm) {
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();

		login(emailInput.value, passwordInput.value);
	});
}

if (logoutBtn) {
	logoutBtn.addEventListener("click", () => {
		logout();
	});
}
