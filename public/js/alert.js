/* eslint-disabe */
// type = success | error
const body = document.querySelector("body");

export const hideAlert = () => {
	const alert = document.querySelector(".alert");

	if (!alert) return;
	alert.parentElement.removeChild(alert);
};

export const showAlert = (type, msg) => {
	hideAlert();

	const markup = `<div class="alert alert--${type}">${msg}</div>`;

	if (!body) return;
	body.insertAdjacentHTML("afterbegin", markup);

	window.setTimeout(hideAlert, 1500);
};
