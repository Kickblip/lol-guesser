const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const port = process.env.PORT || 3000

// load the JSON file containing the answers
const imageStrings = require("./champs.json")

// tells express where to find the static files
// also sends index.html when the root ('/') is requested
// the root is requested automatically so index.html and its attached css and js files are sent automatically
app.use(express.static(path.join(__dirname, "..", "public")))

// api endpoint to pick a random image and send it to the client
app.get("/random-image", (req, res) => {
    fs.readdir(path.join(__dirname, "..", "public", "images"), (err, files) => {
        if (err) {
            return res.status(500).send("Server Error")
        }

        // filter the files to exclude '.DS_Store'
        const imageFiles = files.filter((file) => file !== ".DS_Store")

        // pick a random json entry (contains image file name and answer)
        const randomIndex = Math.floor(Math.random() * imageFiles.length)
        const randomImage = imageFiles[randomIndex]

        // this is the string the user will have to guess (e.g. 'aatrox')
        const randomImageString = imageStrings[randomImage]

        // send the string (answer) in the headers of the response so client can check if the guess is correct
        res.setHeader("X-Image-String", randomImageString)
        res.sendFile(path.join(__dirname, "..", "public", "images", randomImage))
    })
})

// start the server on port 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
