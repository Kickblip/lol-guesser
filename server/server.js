const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const port = process.env.PORT || 3000

// Load the JSON file containing the answers
const imageStrings = require("./answers.json")

app.use(express.static(path.join(__dirname, "..", "public")))

app.get("/random-image", (req, res) => {
    fs.readdir(path.join(__dirname, "..", "public", "images"), (err, files) => {
        if (err) {
            return res.status(500).send("Server Error")
        }

        const randomIndex = Math.floor(Math.random() * files.length)
        const randomImage = files[randomIndex]

        // Get the unique string for the random image
        const randomImageString = imageStrings[randomImage]

        // Send the string in the headers of the response
        res.setHeader("X-Image-String", randomImageString)
        res.sendFile(path.join(__dirname, "..", "public", "images", randomImage))
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
