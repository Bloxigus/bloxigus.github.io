let div = document.getElementsByTagName("div")[0]
let img = document.getElementsByTagName("img")[0];
let canvas = document.getElementsByTagName("canvas")[0]
let alphaCanvas = document.getElementsByTagName("canvas")[1]
let canvasSize = Math.min(window.innerHeight - 1, window.innerWidth - 1)
div.style.height = `${window.innerHeight - 1}px`
if (window.innerHeight > window.innerWidth) {
    div.style.width = `${window.innerWidth - 1}px`
    div.style.height = `auto`
} else {
    div.style.width = `calc(100% - ${(window.innerHeight - 1) / 2}px)`
    div.style.height = `${window.innerHeight - 1}px`
}
let colourPickers = document.getElementsByTagName("input");
let button = document.getElementsByTagName("button")[0];
let random = document.getElementsByTagName("button")[1];
let loadId = document.getElementsByTagName("button")[2];
button.addEventListener("click", () => {
    var link = document.createElement('a');
    link.download = `AXOLOTL-${createId()}.png`;
    link.href = canvas.toDataURL()
    link.click();
});
random.addEventListener("click", () => {
    colourPickers[0].value = generateRandomRGB()
    colourPickers[1].value = generateRandomRGB()
    colourPickers[2].value = generateRandomRGB()
    colourPickers[3].value = generateRandomRGB()
    colourPickers[4].value = generateRandomRGB()
    colourPickers[5].value = generateRandomRGB()
    colourPickers[6].value = generateRandomRGB()
    updateColours()
});
loadId.addEventListener("click", () => {
    if (colourPickers[7].value.length == 35) {
        var values = [...colourPickers[7].value.matchAll(/.{5}/g)].map((a, i) => {
            var decimal = parseInt(a[0], 36)
            var rgbDecimal = [decimal >> 16 & 255, decimal >> 8 & 255, decimal & 255]
            var r = rgbDecimal[0].toString(16)
            var g = rgbDecimal[1].toString(16)
            var b = rgbDecimal[2].toString(16)
            r = (r.length < 2) ? "0" + r : r
            g = (g.length < 2) ? "0" + g : g
            b = (b.length < 2) ? "0" + b : b
            colourPickers[i].value = `#${r + g + b}`
            return `#${r + g + b}`
        })
        //console.log(values)
        updateColours()
        colourPickers[7].value = createId()
    }
});
[...colourPickers].forEach((v, i) => {
    if (i != 7) {
        v.addEventListener("input", updateColours, false);
        v.addEventListener("change", updateColours, false);
    }
})

function updateColours() {
    AxolotlGenerator.makeAxolotlRGB(
        colourPickers[0].value,
        colourPickers[1].value,
        colourPickers[2].value,
        colourPickers[3].value,
        colourPickers[4].value,
        colourPickers[5].value,
        colourPickers[6].value
    )
    colourPickers[7].value = createId()
    setupCanvasDrawing()
}
colourPickers[7].value = createId()
function createId() {
    var a0 = [...parseInt(colourPickers[0].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    var a1 = [...parseInt(colourPickers[1].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    var a2 = [...parseInt(colourPickers[2].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    var a3 = [...parseInt(colourPickers[3].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    var a4 = [...parseInt(colourPickers[4].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    var a5 = [...parseInt(colourPickers[5].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    var a6 = [...parseInt(colourPickers[6].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    return a0 + a1 + a2 + a3 + a4 + a5 + a6
}
function generateRandomRGB() {
    var r = Math.floor(Math.random() * 256).toString(16)
    var g = Math.floor(Math.random() * 256).toString(16)
    var b = Math.floor(Math.random() * 256).toString(16)
    r = (r.length < 2) ? "0" + r : r
    g = (g.length < 2) ? "0" + g : g
    b = (b.length < 2) ? "0" + b : b
    return `#${r + g + b}`
}
AxolotlGenerator.canvasContext = canvas.getContext("2d")
AxolotlGenerator.canvasContext.drawImage(img, 0, 0)
AxolotlGenerator.makeAxolotlRGB(
    "#B0D5FC",
    "#E2EEFF",
    "#E2AAC0",
    "#3A006C",
    "#D2C2E0",
    "#D25989",
    "#9E1020"
)