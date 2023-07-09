// let c = document.createElement("canvas")
// ctx = c.getContext("2d")
// let img1 = new Image()

// img1.onload = function () {
//     document.getElementById("image1").remove()

//     w = img1.width
//     h = img1.height

//     c.width = w
//     c.height = h
//     ctx.drawImage(img1, 0, 0)

//     var pixelArr = ctx.getImageData(0, 0, w, h).data
//     sample_size = 40

//     for (let y = 0; y < h; y += sample_size) {
//         for (let x = 0; x < w; x += sample_size) {
//             let p = (x + y * w) * 4
//             ctx.fillStyle = "rgba(" + pixelArr[p] + "," + pixelArr[p + 1] + "," + pixelArr[p + 2] + "," + pixelArr[p + 3] + ")"
//             ctx.fillRect(x, y, sample_size, sample_size)
//         }
//     }

//     let img2 = new Image()
//     img2.src = c.toDataURL("/public/images/image/jpeg")
//     img2.width = 800
//     document.body.appendChild(img2)
// }

// img1.src = document.getElementById("image1").src

document.getElementById("new-image").addEventListener("click", function () {
    fetch("/random-image")
        .then((response) => response.blob())
        .then((blob) => {
            return new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
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
                let sample_size = 40

                for (let y = 0; y < h; y += sample_size) {
                    for (let x = 0; x < w; x += sample_size) {
                        let p = (x + y * w) * 4
                        ctx.fillStyle =
                            "rgba(" + pixelArr[p] + "," + pixelArr[p + 1] + "," + pixelArr[p + 2] + "," + pixelArr[p + 3] + ")"
                        ctx.fillRect(x, y, sample_size, sample_size)
                    }
                }

                // Here we update the existing image source with the pixelated image data
                document.getElementById("display-image").src = c.toDataURL("image/jpeg")
            }

            img.src = imageDataUrl
        })
        .catch((error) => console.error("Error:", error))
})
