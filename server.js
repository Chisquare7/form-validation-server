const express = require("express");
const bodyParser = require("body-parser");
const validateFormFields = require("./validationRules/formValidation")
const fs = require("fs");
const path = require("path")
const cors = require("cors");
require("dotenv").config();



const app = express();
const PORT = process.env.PORT || 4050;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(express.static("public"));


app.post("/submit-form", (req, res) => {
    const formData = req.body;

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.gender) {
        return res.status(400).json({
            error: "All form fields are required"
        })
    }

    const databasePath = process.env.DATABASE_URL || path.join(__dirname, "database.json");

    fs.readFile(databasePath, "utf8", (error, data) => {

        if (error && error.code !== "ENOENT") {
            console.error(error);
            return res.status(500).json({
                error: "Internal Server Error"
            })
        }
        
        let database = [];

        if (data) {
            database = JSON.parse(data);
        }

        database.push(formData);

        console.log("Received formData:", formData);

        fs.writeFile(
            databasePath,
            JSON.stringify(database, null, 2),
            (error) => {
                if (error) {
                    console.error(
                        "Error encountered when writing to database.json:",
                        error
                    );
                    return res.status(500).json({
                        message: "An error occurred while saving the form data.",
                    });
                } else {
                    res.status(200).json({
                        message: "Form data submitted successfully!",
                    });
                }
            }
        );
    });


    // console.log("Received formData:", formData);

    // const firstName = formData.firstName;
    // const lastName = formData.lastName;
    // const otherNames = formData.otherNames;
    // const email = formData.email;
    // const phone = formData.phone;
    // const gender = formData.gender;
    
    // const errors = validateFormFields(formData);

    // if (errors.length > 0) {
    //     res.status(400).json({ errors });
    // } else {
    //     const formData = {
    //         firstName,
    //         lastName,
    //         otherNames,
    //         email,
    //         phone,
    //         gender,
    //     };


    // }
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});