const reduce_amount = 10
const starting_size = 50

let sample_size = starting_size
let currentBlob
let currentImageString

// takes a blob (Binary Large OBject), pixelates it, and updates the HTML file with the new image
// the image blobs come from the server
function drawImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
        .then((imageDataUrl) => {
            let c = document.createElement("canvas")
            let ctx = c.getContext("2d")
            let img = new Image()

            img.onload = function () {
                let w = img.width
                let h = img.height

                c.width = w
                c.height = h

                ctx.drawImage(img, 0, 0)

                let pixelArr = ctx.getImageData(0, 0, w, h).data

                for (let y = 0; y < h; y += sample_size) {
                    for (let x = 0; x < w; x += sample_size) {
                        let p = (x + y * w) * 4
                        ctx.fillStyle =
                            "rgba(" + pixelArr[p] + "," + pixelArr[p + 1] + "," + pixelArr[p + 2] + "," + pixelArr[p + 3] + ")"
                        ctx.fillRect(x, y, sample_size, sample_size)
                    }
                }

                // here we update the existing image source with the pixelated image data
                document.getElementById("display-image").src = c.toDataURL("image/jpeg")
            }

            img.src = imageDataUrl
        })
        .catch((error) => console.error("Error:", error))
}

// requests an image blob and answer string from the server
function loadImage() {
    fetch("/random-image")
        .then((response) => {
            currentImageString = response.headers.get("X-Image-String") // save the answer string from the headers
            return response.blob()
        })
        .then((blob) => {
            currentBlob = blob // save the image blob
            return drawImageFromBlob(blob) // draw the image on the HTML using the blob
        })
}

window.onload = loadImage

// add a listener to the guess-form input box that is fired when they submit it
document.getElementById("guess-form").addEventListener("submit", function (event) {
    event.preventDefault()

    // get the text from the HTML input box
    const guess = document.getElementById("guess-input").value.toLowerCase()

    // strip the guess of spaces, numbers, and special characters
    const strippedGuess = guess.replace(/[^a-z]/g, "")

    // check the users guess against the correct answer
    if (strippedGuess === currentImageString) {
        var img = document.getElementById("display-image")
        var rect = img.getBoundingClientRect()

        // confetti animation from library (not important)
        confetti({
            particleCount: 200,
            spread: 100,
            origin: {
                y: rect.bottom / window.innerHeight,
                x: rect.left / window.innerWidth,
            },
        })

        setTimeout(function () {
            confetti.reset()
        }, 2000) // clear the confetti after 2 seconds

        document.getElementById("guess-input").value = ""
        sample_size = starting_size
        loadImage()
    } else {
        const image = document.getElementById("display-image")

        // CSS animation jiggles the image when they are wrong
        image.classList.add("jiggle")

        setTimeout(function () {
            image.classList.remove("jiggle")
        }, 1000) // remove the jiggle class after some time to make it stop

        document.getElementById("guess-input").value = "" // clear the guess input field
        sample_size = Math.max(1, sample_size - reduce_amount)
        drawImageFromBlob(currentBlob) // redraw the current image with a smaller sample size (less pixelated)
    }
})
