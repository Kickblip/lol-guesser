const reduce_amount = 10
const starting_size = 50

let sample_size = starting_size
let currentBlob
let currentImageString

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

function loadImage() {
    fetch("/random-image")
        .then((response) => {
            currentImageString = response.headers.get("X-Image-String") // save the current image string
            return response.blob()
        })
        .then((blob) => {
            currentBlob = blob // save the current blob
            return drawImageFromBlob(blob)
        })
}

window.onload = loadImage

document.getElementById("guess-form").addEventListener("submit", function (event) {
    event.preventDefault()
    const guess = document.getElementById("guess-input").value.toLowerCase()

    // strip the guess of spaces, numbers, and special characters
    const strippedGuess = guess.replace(/[^a-z]/g, "")

    if (strippedGuess === currentImageString) {
        var img = document.getElementById("display-image")
        var rect = img.getBoundingClientRect()

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

        image.classList.add("jiggle")

        setTimeout(function () {
            image.classList.remove("jiggle")
        }, 1000)

        document.getElementById("guess-input").value = ""
        sample_size = Math.max(1, sample_size - reduce_amount)
        drawImageFromBlob(currentBlob) // redraw the current image
    }
})
