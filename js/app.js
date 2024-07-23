let div = document.getElementsByTagName("div")[1]
let img = document.querySelector("img[data-skin=regular]");
let imgSlim = document.querySelector("img[data-skin=slim]");
let customImg = document.querySelector("img[data-skin=custom]");
let capeImg = document.querySelector("img[data-skin=cape]");
let canvas = document.querySelector("canvas[data-canvas=skin]");
let testCanvas = document.querySelector("canvas[data-canvas=cape]");
let headRenderCanvas = document.querySelector("canvas[data-canvas=head]");
let favicon = document.querySelector("link[data-icon=head]");
let testCanvasContext = testCanvas.getContext("2d", {
    willReadFrequently: true
})
let slimCheck = document.querySelector("input[data-check=slim]");
let animateCheck = document.querySelector("input[data-check=animate]");
let slim = false
const cape_urls = {
    "cherry_blossom": "./images/capes/cherryblossom.png",
    "anniversary": "./images/capes/anniversary.png",
    "migrator": "./images/capes/migrator.png",
    "vanilla": "./images/capes/vanilla.png",
    "birthday": "./images/capes/birthday.png",
    "cobalt": "./images/capes/cobalt.png",
    "minecon2011": "./images/capes/minecon2011.png",
    "minecon2012": "./images/capes/minecon2012.png",
    "minecon2013": "./images/capes/minecon2013.png",
    "minecon2015": "./images/capes/minecon2015.png",
    "minecon2016": "./images/capes/minecon2016.png",
    "mojang": "./images/capes/mojang.png",
    "mojangclassic": "./images/capes/mojangclassic.png",
    "mojangstudios": "./images/capes/mojangstudios.png",
    "mojira": "./images/capes/mojira.png",
    "realmsmaker": "./images/capes/realmsmaker.png",
    "scrolls": "./images/capes/scrolls.png",
    "translator": "./images/capes/translator.png",
    "turtle": "./images/capes/turtle.png",
    "twitch": "./images/capes/twitch.png",
    "valentine": "./images/capes/valentine.png"
}
let cape_data = {}
let canvasSize = Math.min(window.innerHeight - 1, window.innerWidth - 1)
/** Chrome automatically adds in some of the line breaks */
console.log("%cAxolotl Skin Generator\n" + (window.chrome ? "" : "\n\n\n") + "%c ", [
    "font-size: 20px;",
    "font-family: JetBrains Mono, consolas;"
].join(" "), [
    "padding: 72px 112px;",
    // Credits: National Geographic, accessed from https://www.nationalgeographic.com/animals/amphibians/facts/axolotl
    "background: url('data:image/jpeg;base64,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');",
    "background-size: contain;",
    "font-size: 10px;"
].join(" "))
div.style.height = `${window.innerHeight - 1}px`
if (window.innerHeight > window.innerWidth)
{
    div.style.width = `${window.innerWidth - 1}px`
    div.style.height = `auto`
} else
{
    div.style.width = `calc(100% - ${(window.innerHeight - 1) / 2}px)`
    div.style.height = `${window.innerHeight - 1}px`
}
let isFileSelected = false;
let colourPickers = [
    document.querySelector("input[data-colour=corner]"),
    document.querySelector("input[data-colour=middle]"),
    document.querySelector("input[data-colour=mouth]"),
    document.querySelector("input[data-colour=eyes]"),
    document.querySelector("input[data-colour=start]"),
    document.querySelector("input[data-colour=end]"),
    document.querySelector("input[data-colour=tie]")
]
let tomiHatPickers = [
    document.querySelector("input[data-tomi=first]"),
    document.querySelector("input[data-tomi=second]"),
    document.querySelector("input[data-tomi=third]"),
    document.querySelector("input[data-tomi=fourth]")
]
let button = document.querySelector("button[data-button=download]")
let copyRender = document.querySelector("button[data-button=copy]")

if (!window.chrome) copyRender.style.display = "none"

let random = document.querySelector("button[data-button=random]")
let fileChooser = document.getElementById("fileChooser");
let accessorySelector = document.getElementById("accessorySelect");
/** @type {HTMLSelectElement} */
let capeSelector = document.getElementById("capeSelect");
/**
 * @type {HTMLInputElement}
 */
let customSkinKeepOption = document.getElementById("cuskin")
customSkinKeepOption.disabled = true;
customSkinKeepOption.checked = false;
let tomiHatOptions = document.getElementById("tomiOptions");
capeImg.src = cape_urls[capeSelector[capeSelector.selectedIndex].id] || ""
capeSelector.addEventListener("change", () =>
{
    if (cape_urls[capeSelector[capeSelector.selectedIndex].id])
    {
        if (cape_data[capeSelector[capeSelector.selectedIndex].id])
        {
            AxolotlSkinGenerator.capeBuffer = cape_data[capeSelector[capeSelector.selectedIndex].id]
            updateCape()
        } else
        {
            let newCape = cape_urls[capeSelector[capeSelector.selectedIndex].id]
            capeImg.src = newCape
        }
    } else
    {
        AxolotlSkinGenerator.capeBuffer = new Uint8Array(32 * 64 * 4)
        updateCape()
    }
})
let loadFile = document.getElementsByTagName("button")[3];
let lastFileUrl = ""
fileChooser.addEventListener("change", () =>
{
    loadSkinFile()
})
loadFile.addEventListener("click", () =>
{
    fileChooser.click()
})
customSkinKeepOption.addEventListener("change", () =>
{
    if (!customSkinKeepOption.checked) updateColours()
})
accessorySelector.addEventListener("change", () =>
{
    if (accessorySelector[accessorySelector.selectedIndex].id == "tomihat")
    {
        tomiHatOptions.style.display = "block"
    } else
    {
        tomiHatOptions.style.display = "none"
    }
    updateColours()
})
copyRender.addEventListener("click", () =>
{
    renderer.domElement.toBlob((blob) =>
    {
        navigator.clipboard.write([new ClipboardItem({
            [blob.type]: blob
        })])
    })
})
slimCheck.addEventListener("change", () =>
{
    setSlim(slimCheck.checked)
    updateColours(true)
})
button.addEventListener("click", () =>
{
    let link = document.createElement('a');
    link.download = `AXOLOTL-${createId()}.png`;
    link.href = canvas.toDataURL()
    link.click();
});
random.addEventListener("click", () =>
{
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
for (let i = 0; i < colourPickers.length; i++)
{
    let picker = colourPickers[i];
    picker.addEventListener("input", () =>
    {
        updateColours(false)
    });
    picker.addEventListener("change", () =>
    {
        updateColours(false)
    });
}
for (let i = 0; i < tomiHatPickers.length; i++)
{
    let picker = tomiHatPickers[i];
    picker.addEventListener("input", () =>
    {
        updateColours(false)
    });
    picker.addEventListener("change", () =>
    {
        updateColours(false)
    });
}

function loadIDString(id)
{
    if (id.length == 36)
    {
        isFileSelected = false
        let isSlim = /[S]/.test(id.split("")[35]);
        [...id.matchAll(/.{5}/g)].map((a, i) =>
        {
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
    } else if (id.length == 35)
    {
        isFileSelected = false
        let isSlim = false;
        [...id.matchAll(/.{5}/g)].map((a, i) =>
        {
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

function getAccessoryOptions()
{
    let palette = {}
    if (accessorySelector[accessorySelector.selectedIndex].id == "tomihat")
    {
        palette = {
            "1": Utils.rgbToArray(tomiHatPickers[0].value),
            "2": Utils.rgbToArray(tomiHatPickers[1].value),
            "3": Utils.rgbToArray(tomiHatPickers[2].value),
            "4": Utils.rgbToArray(tomiHatPickers[3].value),
            "W": [255, 255, 255, 255],
            "B": [0, 0, 0, 255],
            " ": [0, 0, 0, 0]
        }
    }
    return {
        colourLocations: accessoryMap[accessorySelector[accessorySelector.selectedIndex].id],
        colourPalette: palette
    }
}

function updateColours(slimChange = false)
{
    isFileSelected = false
    AxolotlSkinGenerator.makeAxolotlRGB(
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
    favicon.href = AxolotlSkinGenerator.headPNG
}

function onAppLoaded()
{
    slimCheck.checked = true
    /**
     * Wait for all required images to load
     */
    Promise.all([img, imgSlim, capeImg].map(imgToLoad =>
    {
        return new Promise(resolve =>
        {
            if (imgToLoad.complete) resolve();
            imgToLoad.addEventListener("load", resolve)
            if (imgToLoad.complete) resolve();
        })
    })).then(() =>
    {
        AxolotlSkinGenerator.canvasContext = canvas.getContext("2d", {
            willReadFrequently: true
        })
        AxolotlSkinGenerator.headCanvasContext = headRenderCanvas.getContext("2d", {
            willReadFrequently: true
        })
        AxolotlSkinGenerator.canvasContext.drawImage(img, 0, 0)
        if (document.location.hash.length != 0 || document.location.search.length != 0)
        {
            loadIDString(((document.location.hash.length != 0) ? document.location.hash : document.location.search).replace(/[#?]{1}/, ""))
        } else
        {
            AxolotlSkinGenerator.makeAxolotlRGB(
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
            favicon.href = AxolotlSkinGenerator.headPNG
        }

        function redoCapeTexture()
        {
            if (cape_urls[capeSelector[capeSelector.selectedIndex].id])
            {
                if (cape_data[capeSelector[capeSelector.selectedIndex].id])
                {
                    AxolotlSkinGenerator.capeBuffer = cape_data[capeSelector[capeSelector.selectedIndex].id]
                } else
                {
                    testCanvasContext.drawImage(capeImg, 0, 0)
                    let newImageData = testCanvasContext.getImageData(0, 0, 64, 32)
                    AxolotlSkinGenerator.capeBuffer = newImageData.data
                    cape_data[capeSelector[capeSelector.selectedIndex].id] = newImageData.data
                }
            } else
            {
                AxolotlSkinGenerator.capeBuffer = new Uint8Array(32 * 4 * 64)
            }
            updateCape()
        }
        capeImg.addEventListener("load", redoCapeTexture)
        if (cape_urls[capeSelector[capeSelector.selectedIndex].id]) redoCapeTexture()

        setupCanvasDrawing(slimCheck.checked)
        setSlim(slimCheck.checked)
        updateColours(true)
    })
}
let id = createId()

function createId()
{
    let a0 = [...parseInt(colourPickers[0].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a1 = [...parseInt(colourPickers[1].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a2 = [...parseInt(colourPickers[2].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a3 = [...parseInt(colourPickers[3].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a4 = [...parseInt(colourPickers[4].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a5 = [...parseInt(colourPickers[5].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    let a6 = [...parseInt(colourPickers[6].value.split("#")[1], 16).toString(36).split("").reverse(), "0", "0", "0", "0"].slice(0, 5).reverse().join("")
    return a0 + a1 + a2 + a3 + a4 + a5 + a6 + (slim ? "S" : "R")
}

function generateRandomRGB()
{
    let r = Math.floor(Math.random() * 256).toString(16)
    let g = Math.floor(Math.random() * 256).toString(16)
    let b = Math.floor(Math.random() * 256).toString(16)
    r = (r.length < 2) ? "0" + r : r
    g = (g.length < 2) ? "0" + g : g
    b = (b.length < 2) ? "0" + b : b
    return `#${r + g + b}`
}

function fixSmallSkinFile(imageData)
{
    let cubeMap = cubes;
    if (slim) cubeMap = cubesSlim

    let topArmBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftArm.uv.top[0], cubeMap.leftArm.uv.top[1], cubeMap.leftArm.size[0], cubeMap.leftArm.size[2])
    let baseArmBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftArm.uv.bottom[0], cubeMap.leftArm.uv.bottom[1], cubeMap.leftArm.size[0], cubeMap.leftArm.size[2])
    let frontArmBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftArm.uv.front[0], cubeMap.leftArm.uv.front[1], cubeMap.leftArm.size[0], cubeMap.leftArm.size[1])
    let backArmBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftArm.uv.back[0], cubeMap.leftArm.uv.back[1], cubeMap.leftArm.size[0], cubeMap.leftArm.size[1])
    let leftSideArmBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftArm.uv.left[0], cubeMap.leftArm.uv.left[1], cubeMap.leftArm.size[2], cubeMap.leftArm.size[1])
    let rightSideArmBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftArm.uv.right[0], cubeMap.leftArm.uv.right[1], cubeMap.leftArm.size[2], cubeMap.leftArm.size[1])

    let topLegBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftLeg.uv.top[0], cubeMap.leftLeg.uv.top[1], cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[2])
    let baseLegBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftLeg.uv.bottom[0], cubeMap.leftLeg.uv.bottom[1], cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[2])
    let frontLegBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftLeg.uv.front[0], cubeMap.leftLeg.uv.front[1], cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[1])
    let backLegBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftLeg.uv.back[0], cubeMap.leftLeg.uv.back[1], cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[1])
    let leftSideLegBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftLeg.uv.left[0], cubeMap.leftLeg.uv.left[1], cubeMap.leftLeg.size[2], cubeMap.leftLeg.size[1])
    let rightSideLegBuffer = Utils.getSubbufferFromBuffer(imageData.data, cubeMap.leftLeg.uv.right[0], cubeMap.leftLeg.uv.right[1], cubeMap.leftLeg.size[2], cubeMap.leftLeg.size[1])

    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(topArmBuffer, cubeMap.leftArm.size[0], cubeMap.leftArm.size[2]), cubeMap.rightArm.uv.top[0], cubeMap.rightArm.uv.top[1], cubeMap.leftArm.size[0], cubeMap.leftArm.size[2])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(baseArmBuffer, cubeMap.leftArm.size[0], cubeMap.leftArm.size[2]), cubeMap.rightArm.uv.bottom[0], cubeMap.rightArm.uv.bottom[1], cubeMap.leftArm.size[0], cubeMap.leftArm.size[2])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(frontArmBuffer, cubeMap.leftArm.size[0], cubeMap.leftArm.size[1]), cubeMap.rightArm.uv.front[0], cubeMap.rightArm.uv.front[1], cubeMap.leftArm.size[0], cubeMap.leftArm.size[1])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(backArmBuffer, cubeMap.leftArm.size[0], cubeMap.leftArm.size[1]), cubeMap.rightArm.uv.back[0], cubeMap.rightArm.uv.back[1], cubeMap.leftArm.size[0], cubeMap.leftArm.size[1])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(leftSideArmBuffer, cubeMap.leftArm.size[2], cubeMap.leftArm.size[1]), cubeMap.rightArm.uv.right[0], cubeMap.rightArm.uv.right[1], cubeMap.leftArm.size[2], cubeMap.leftArm.size[1])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(rightSideArmBuffer, cubeMap.leftArm.size[2], cubeMap.leftArm.size[1]), cubeMap.rightArm.uv.left[0], cubeMap.rightArm.uv.left[1], cubeMap.leftArm.size[2], cubeMap.leftArm.size[1])

    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(topLegBuffer, cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[2]), cubeMap.rightLeg.uv.top[0], cubeMap.rightLeg.uv.top[1], cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[2])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(baseLegBuffer, cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[2]), cubeMap.rightLeg.uv.bottom[0], cubeMap.rightLeg.uv.bottom[1], cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[2])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(frontLegBuffer, cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[1]), cubeMap.rightLeg.uv.front[0], cubeMap.rightLeg.uv.front[1], cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[1])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(backLegBuffer, cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[1]), cubeMap.rightLeg.uv.back[0], cubeMap.rightLeg.uv.back[1], cubeMap.leftLeg.size[0], cubeMap.leftLeg.size[1])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(leftSideLegBuffer, cubeMap.leftLeg.size[2], cubeMap.leftLeg.size[1]), cubeMap.rightLeg.uv.right[0], cubeMap.rightLeg.uv.right[1], cubeMap.leftLeg.size[2], cubeMap.leftLeg.size[1])
    Utils.putSubbufferInBuffer(imageData.data, Utils.reverseUint8ClampedArray(rightSideLegBuffer, cubeMap.leftLeg.size[2], cubeMap.leftLeg.size[1]), cubeMap.rightLeg.uv.left[0], cubeMap.rightLeg.uv.left[1], cubeMap.leftLeg.size[2], cubeMap.leftLeg.size[1])

}

function loadSkinFile()
{
    let reader = new FileReader();
    reader.onload = () =>
    {
        isFileSelected = true
        lastFileUrl = reader.result
        customSkinKeepOption.disabled = false;
        customSkinKeepOption.checked = true
        customImg.onload = () =>
        {
            AxolotlSkinGenerator.canvasContext.clearRect(0, 0, 64, 64)
            AxolotlSkinGenerator.canvasContext.drawImage(customImg, 0, 0)
            let arrayBuffer = AxolotlSkinGenerator.canvasContext.getImageData(0, 0, 64, 64)

            // Im feeling pain rn
            if (customImg.height == 32)
            {
                fixSmallSkinFile(arrayBuffer);
                AxolotlSkinGenerator.canvasContext.putImageData(arrayBuffer, 0, 0)
            }

            AxolotlSkinGenerator.arrayBuffer.set(arrayBuffer.data)
            AxolotlSkinGenerator.setSkinArrayBuffer.set(arrayBuffer.data)

            let headImageData = new ImageData(8, 8);
            let headBuffer = Utils.getSubbufferFromBuffer(arrayBuffer.data, cubes.head.uv.front[0], cubes.head.uv.front[1], 8, 8);
            let hatBuffer = Utils.getSubbufferFromBuffer(arrayBuffer.data, outerLayerCubes.head.uv.front[0], outerLayerCubes.head.uv.front[1], 8, 8)
            headImageData.data.set(Utils.combineHeadAndHat(headBuffer, hatBuffer))
            AxolotlSkinGenerator.headCanvasContext.putImageData(headImageData, 0, 0)
            AxolotlSkinGenerator.headPNG = AxolotlSkinGenerator.headCanvasContext.canvas.toDataURL()



            setupCanvasDrawing()

            favicon.href = AxolotlSkinGenerator.headPNG
        }
        customImg.src = reader.result
        fileChooser.value = ""
    }
    reader.readAsDataURL(fileChooser.files[0], "UTF-8")
}