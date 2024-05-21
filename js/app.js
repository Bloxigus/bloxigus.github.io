let div = document.getElementsByTagName("div")[1]
let img = document.getElementsByTagName("img")[0];
let imgSlim = document.getElementsByTagName("img")[1];
let customImg = document.getElementsByTagName("img")[2];
let canvas = document.getElementsByTagName("canvas")[0]
let slimCheck = document.getElementsByTagName("input")[0]
let slim = false
let canvasSize = Math.min(window.innerHeight - 1, window.innerWidth - 1)
console.log("Axolotl Skin Generator\nA Project by Bloxigus")
div.style.height = `${window.innerHeight - 1}px`
if (window.innerHeight > window.innerWidth) {
    div.style.width = `${window.innerWidth - 1}px`
    div.style.height = `auto`
} else {
    div.style.width = `calc(100% - ${(window.innerHeight - 1) / 2}px)`
    div.style.height = `${window.innerHeight - 1}px`
}
let isFileSelected = false;
let colourPickers = [...document.getElementsByTagName("input")].filter((element, index) => { return index != 0 && element.type == "color" });
let button = document.getElementsByTagName("button")[0];
let copyRender = document.getElementsByTagName("button")[1];
let random = document.getElementsByTagName("button")[2];
// let loadId = document.getElementsByTagName("button")[3];
let fileChooser = document.getElementById("fileChooser");
let accessorySelector = document.getElementById("accessorySelect");
/**
 * @type {HTMLInputElement}
 */
let customSkinKeepOption = document.getElementById("cuskin")
customSkinKeepOption.disabled = true;
let tomiHatOptions = document.getElementById("tomiOptions");

let loadFile = document.getElementsByTagName("button")[3];
let lastFileUrl = ""
fileChooser.addEventListener("change", () => {
    loadSkinFile()
})
loadFile.addEventListener("click", () => {
    fileChooser.click()
})
customSkinKeepOption.addEventListener("change",() => {
    updateColours()
})
accessorySelector.addEventListener("change",() => {
    // console.log(accessorySelector[accessorySelector.selectedIndex].id)
    if (accessorySelector[accessorySelector.selectedIndex].id == "tomihat") {
        tomiHatOptions.style.display = "block"
    } else {
        tomiHatOptions.style.display = "none"
    }
    updateColours()
})
copyRender.addEventListener("click", () => {
    renderer.domElement.toBlob((blob)=>{
        navigator.clipboard.write([new ClipboardItem({[blob.type]:blob})])
    })
})
slimCheck.addEventListener("change", () => {
    setSlim(slimCheck.checked)
    updateColours(true)
})
button.addEventListener("click", () => {
    let link = document.createElement('a');
    link.download = `AXOLOTL-${createId()}.png`;
    link.href = canvas.toDataURL()
    link.click();
});
random.addEventListener("click", () => {
    isFileSelected = false
    colourPickers[0].value = generateRandomRGB()
    colourPickers[1].value = generateRandomRGB()
    colourPickers[2].value = generateRandomRGB()
    colourPickers[3].value = generateRandomRGB()
    colourPickers[4].value = generateRandomRGB()
    colourPickers[5].value = generateRandomRGB()
    colourPickers[6].value = generateRandomRGB()
    updateColours()
});
// loadId.addEventListener("click", () => {
//     loadIDString(colourPickers[7].value)
// });
[...colourPickers].forEach((v, i) => {
    if (true) {
        v.addEventListener("input", ()=>{updateColours(false)}, false);
        v.addEventListener("change", ()=>{updateColours(false)}, false);
    }
})
function loadIDString(id) {
    if (id.length == 36) {
        isFileSelected = false
        let isSlim = /[S]/.test(id.split("")[35]);
        [...id.matchAll(/.{5}/g)].map((a, i) => {
            let decimal = parseInt(a[0], 36)
            let rgbDecimal = [decimal >> 16 & 255, decimal >> 8 & 255, decimal & 255]
            let r = rgbDecimal[0].toString(16)
            let g = rgbDecimal[1].toString(16)
            let b = rgbDecimal[2].toString(16)
            r = (r.length < 2) ? "0" + r : r
            g = (g.length < 2) ? "0" + g : g
            b = (b.length < 2) ? "0" + b : b
            colourPickers[i].value = `#${r + g + b}`
        })
        setSlim(isSlim)
        updateColours(true)
        id = createId()
    } else if (id.length == 35) {
        isFileSelected = false
        let isSlim = false;
        [...id.matchAll(/.{5}/g)].map((a, i) => {
            let decimal = parseInt(a[0], 36)
            let rgbDecimal = [decimal >> 16 & 255, decimal >> 8 & 255, decimal & 255]
            let r = rgbDecimal[0].toString(16)
            let g = rgbDecimal[1].toString(16)
            let b = rgbDecimal[2].toString(16)
            r = (r.length < 2) ? "0" + r : r
            g = (g.length < 2) ? "0" + g : g
            b = (b.length < 2) ? "0" + b : b
            colourPickers[i].value = `#${r + g + b}`
        })
        setSlim(isSlim)
        updateColours(true)
        id = createId()
    }
}
function getAccessoryOptions() {
    let palette = {}
    if (accessorySelector[accessorySelector.selectedIndex].id == "tomihat") {
        palette = {
            "1": Utils.rgbToArray(colourPickers[7].value),
            "2": Utils.rgbToArray(colourPickers[8].value),
            "3": Utils.rgbToArray(colourPickers[9].value),
            "4": Utils.rgbToArray(colourPickers[10].value),
            "W": [255,255,255,255],
            "B": [0, 0, 0, 255],
            " ": [0, 0, 0, 0]
        }
    }
    return {
        colourLocations: accessoryMap[accessorySelector[accessorySelector.selectedIndex].id],
        colourPalette: palette
    }
}
function updateColours(slimChange=false) {
    isFileSelected = false
    // console.log(accessoryMap[accessorySelector[accessorySelector.selectedIndex].id])
    AxolotlGenerator.makeAxolotlRGB(
        colourPickers[0].value,
        colourPickers[1].value,
        colourPickers[2].value,
        colourPickers[3].value,
        colourPickers[4].value,
        colourPickers[5].value,
        colourPickers[6].value,
        slim,
        getAccessoryOptions()
    )
    id = createId()
    setupCanvasDrawing(slimChange)
}
function runWhenDone() {
if (document.location.hash.length != 0 || document.location.search.length != 0) {
    loadIDString(((document.location.hash.length!=0)?document.location.hash:document.location.search).replace(/[#?]{1}/,""))
}
}
let id = createId()
function createId() {
    let a0 = [...parseInt(colourPickers[0].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a1 = [...parseInt(colourPickers[1].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a2 = [...parseInt(colourPickers[2].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a3 = [...parseInt(colourPickers[3].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a4 = [...parseInt(colourPickers[4].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a5 = [...parseInt(colourPickers[5].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a6 = [...parseInt(colourPickers[6].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    return a0 + a1 + a2 + a3 + a4 + a5 + a6 + (slim ? "S" : "R")
}
function generateRandomRGB() {
    let r = Math.floor(Math.random() * 256).toString(16)
    let g = Math.floor(Math.random() * 256).toString(16)
    let b = Math.floor(Math.random() * 256).toString(16)
    r = (r.length < 2) ? "0" + r : r
    g = (g.length < 2) ? "0" + g : g
    b = (b.length < 2) ? "0" + b : b
    return `#${r + g + b}`
}
AxolotlGenerator.canvasContext = canvas.getContext("2d", { willReadFrequently: true })
AxolotlGenerator.canvasContext.drawImage(img, 0, 0)
AxolotlGenerator.makeAxolotlRGB(
    "#B0D5FC",
    "#E2EEFF",
    "#E2AAC0",
    "#3A006C",
    "#D2C2E0",
    "#D25989",
    "#9E1020",
    false,
    getAccessoryOptions()
)
function loadSkinFile() {
    let reader = new FileReader();
    reader.onload = () => {
        isFileSelected = true
        colourPickers[7].value = ""
        lastFileUrl = reader.result
        customSkinKeepOption.disabled = false;
        customImg.onload = () => {
            AxolotlGenerator.canvasContext.clearRect(0, 0, 64, 64)
            AxolotlGenerator.canvasContext.drawImage(customImg, 0, 0)
            let arrayBuffer = AxolotlGenerator.canvasContext.getImageData(0,0,64,64).data
            AxolotlGenerator.arrayBuffer.set(arrayBuffer)
            AxolotlGenerator.setSkinArrayBuffer.set(arrayBuffer)
            setupCanvasDrawing()
        }
        customImg.src = reader.result
        fileChooser.value = ""
    }
    reader.readAsDataURL(fileChooser.files[0], "UTF-8")
    
}