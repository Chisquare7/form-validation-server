function formFieldValidationRules() {
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	// let otherNames = document.getElementById("otherNames").value;
	let email = document.getElementById("email").value;
	let phone = document.getElementById("phone").value;
    let gender = document.getElementById("gender").value;
    
    let validationMessages = [];

	if (firstName.length < 1 || lastName.length < 1) {
		validationMessages.push("Name cannot be less than 1 character.");
	}

	let isValidName = /^[A-Za-z]+$/;
	if (!firstName.match(isValidName) || !lastName.match(isValidName)) {
		validationMessages.push("Names cannot contain numbers.");
	}

	let isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email.match(isValidEmail)) {
		validationMessages.push("The email has to be a valid email with @ and .");
	}

	let isValidPhone = /^\d{11}$/;
	if (!phone.match(isValidPhone)) {
		validationMessages.push(
			"The phone number must be a specific number of characters (11 characters long)."
		);
	}

	if (gender === "") {
		validationMessages.push("Please select a gender.");
	}

	return validationMessages;
}

document.addEventListener("DOMContentLoaded", () => {
	document
		.getElementById("simpleForm")
		.addEventListener("submit", function (event) {
			event.preventDefault();

			// if (!formFieldValidationRules()) {
			// 	return;
            // }
            
            let validationMessages = formFieldValidationRules();

            let validationMessageContainer = document.getElementById("validationMessages");
            validationMessageContainer.innerHTML = "";

            if (validationMessages.length > 0) {
                validationMessages.forEach((message) => {
                    let messageItem = document.createElement("p");

                    messageItem.textContent = message;
                    messageItem.style.color = "red";
                    validationMessageContainer.appendChild(messageItem);
                });
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

			fetch("http://localhost:4050/submit-form", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
				.then((response) => {
					return response.json().then((data) => ({
						status: response.status,
						body: data,
					}));
				})
				.then(({ status, body }) => {
					if (status === 400) {
						let validationMessageContainer =
							document.getElementById("validationMessages");
						validationMessageContainer.innerHTML = "";
						body.errors.forEach((message) => {
							let messageItem = document.createElement("p");
							messageItem.textContent = message;
							messageItem.style.color = "red";
							validationMessageContainer.appendChild(messageItem);
						});
					} else {
						console.log("Success message:", body);

						alert("Form data submitted successfully!");

						let formDetailContainer = document.getElementById(
							"formDetailsMessages"
						);
						formDetailContainer.innerHTML = "";

						for (let key in formData) {
							let eachSuccessMessage = document.createElement("p");
							eachSuccessMessage.textContent = `${
								key.charAt(0).toUpperCase() + key.slice(1)
							}: ${formData[key]}`;
							formDetailContainer.appendChild(eachSuccessMessage);
						}
					}
				})
				// .then((response) => {
				//     if (!response.ok) {
				//         throw new Error(
				//             "Network response was not good " + response.statusText
				//         );
				//     }
				//     return response.json();
				// })
				// .then((data) => {
				//     console.log("Success:", data);
				//     alert("Form data submitted successfully!");
				// })
				.catch((error) => {
					console.error("Error message: ", error);
					alert(
						"Error encountered while submitting your form: " + error.message
					);
				});
		});
});
