const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")))

app.get("/random-image", (req, res) => {
    fs.readdir(path.join(__dirname, "public", "images"), (err, files) => {
        if (err) {
            return res.status(500).send("Server Error")
        }

        const randomIndex = Math.floor(Math.random() * files.length)
        const randomImage = files[randomIndex]

        res.sendFile(path.join(__dirname, "public", "images", randomImage))
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
