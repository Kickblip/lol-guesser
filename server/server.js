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
app.use(express.json())
app.use(express.static(path.join(__dirname, "..", "public")))

app.get("/num-champs", (req, res) => {
    const champCount = Object.keys(imageStrings).length
    res.send(champCount.toString())
})

//stores what the client has currently rolled to the variable checkRepeat
let checkRepeat

app.post("/random-image", (req, res) => {
    checkRepeat = req.body
    fs.readdir(path.join(__dirname, "..", "public", "images"), (err, files) => {
        if (err) {
            return res.status(500).send("Server Error")
        }

        // filter the files to exclude '.DS_Store'
        let imageFiles = files.filter((file) => file !== ".DS_Store")

        // pick a random json entry (contains image file name and answer)
        let randomIndex = Math.floor(Math.random() * imageFiles.length)
        let randomImage = imageFiles[randomIndex]

        // this is the string the user will have to guess (e.g. 'aatrox')
        let randomImageString = imageStrings[randomImage]

        while (true) {
            if (checkRepeat.includes(randomImageString)) {
                imageFiles = files.filter((file) => file !== ".DS_Store")
                randomIndex = Math.floor(Math.random() * imageFiles.length)
                randomImage = imageFiles[randomIndex]
                randomImageString = imageStrings[randomImage]
            } else {
                break
            }
        }

        // send the string (answer) in the headers of the response so client can check if the guess is correct
        res.setHeader("X-Image-String", randomImageString)
        res.sendFile(path.join(__dirname, "..", "public", "images", randomImage))
    })
})

// start the server on port 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
