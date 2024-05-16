function formFieldValidationRules() {
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	// let otherNames = document.getElementById("otherNames").value;
	let email = document.getElementById("email").value;
	let phone = document.getElementById("phone").value;
	let gender = document.getElementById("gender").value;

	if (firstName.length < 1 || lastName.length < 1) {
		alert("Name cannot be less than 1 character.");
		return false;
	}

	let isValidName = /^[A-Za-z]+$/;
	if (!firstName.match(isValidName) || !lastName.match(isValidName)) {
		alert("Names cannot contain numbers.");
		return false;
	}

	let isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email.match(isValidEmail)) {
		alert("The email has to be a valid email with @ and .");
		return false;
	}

	let isValidPhone = /^\d{11}$/;
	if (!phone.match(isValidPhone)) {
		alert(
			"The phone number must be a specific number of characters (11 characters long)."
		);
		return false;
	}

	if (gender === "") {
		alert("Please select a gender.");
		return false;
	}

	return true;
}

document.addEventListener("DOMContentLoaded", () => {
	document
		.getElementById("simpleForm")
		.addEventListener("submit", function (event) {
			event.preventDefault();

			if (!formFieldValidationRules()) {
				return;
			}

			const formData = {
				firstName: document.getElementById("firstName").value,
				lastName: document.getElementById("lastName").value,
				otherNames: document.getElementById("otherNames").value,
				email: document.getElementById("email").value,
				phone: document.getElementById("phone").value,
				gender: document.getElementById("gender").value,
			};

			fetch("https://form-validation-server.onrender.com/submit-form", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							"Network response was not good " + response.statusText
						);
					}
					return response.json();
				})
				.then((data) => {
					console.log("Success:", data);
					alert("Form data submitted successfully!");
				})
				.catch((error) => {
					console.error("Error message: ", error);
					alert(
						"Error encountered while submitting your form: " + error.message
					);
				});
		});
});
