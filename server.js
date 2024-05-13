const express = require("express");
const bodyParser = require("body-parser");
const validateFormFields = require("./validationRules/formValidation")

const fs = require("fs");


const app = express();
const PORT = process.env.PORT || 4050;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.post("/submit-form", (req, res) => {
    const formData = req.body;

    console.log("Received formData:", formData);

    const firstName = formData.firstName;
    const lastName = formData.lastName;
    const otherNames = formData.otherNames;
    const email = formData.email;
    const phone = formData.phone;
    const gender = formData.gender;
    
    const errors = validateFormFields(formData);

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        const formData = {
            firstName,
            lastName,
            otherNames,
            email,
            phone,
            gender,
        };

        const databasePath = "./database.json"

        fs.readFile(databasePath, "utf8", (error, data) => {
            let database = [];

            if (!error && data) {
                try {
                   database = JSON.parse(data);
                   if (!Array.isArray(database)) {
                       throw new Error("Database is not an array");
                   }
                } catch (parseErr) {
                    console.error("Error parsing JSON from database.json:", parseErr)
                    return res.status(500).json({
                        message: "Error reading database file"
                    })
                }
                
            }

            database.push(formData);

            fs.writeFile(databasePath, JSON.stringify(database, null, 2), "utf8", (error) => {
                if (error) {
                    console.error("Error encountered when writing to database.json:", error);
                    res.status(500).json({
                        message: "An error occurred while saving the form data."
                    })
                } else {
                    res.status(200).json({
                        message: "Form data submitted successfully!"
                    })
                }
            })
        })

    }
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});