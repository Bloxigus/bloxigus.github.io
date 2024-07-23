const POINT_RANDOM = []

function getRandomAtStride(stride, subpixel) {
    if (!POINT_RANDOM[stride * 4 + subpixel]) {
        POINT_RANDOM[stride * 4 + subpixel] = Math.random()
    }
    return POINT_RANDOM[stride * 4 + subpixel] - 0.5
}

function clamp(x, min, max) {
    if (x > max) return max;
    if (x < min) return min;
    return x;
}

class Axolotl {
    /** @type {CanvasRenderingContext2D} */
    canvasContext;
    /** @type {CanvasRenderingContext2D} */
    headCanvasContext;
    headPNG = "data:image/png,base64;"
    arrayBuffer = new Uint8ClampedArray(4 * 64 * 64);
    capeBuffer = new Uint8ClampedArray(4 * 32 * 64);
    setSkinArrayBuffer = new Uint8ClampedArray(4 * 64 * 64);
    makeAxolotl(
        edge = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],
        middle = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],
        lip = [255 - (edge[0] + middle[0]) / 2, 255 - (edge[1] + middle[1]) / 2, 255 - (edge[2] + middle[2]) / 2, 255],
        eye = [300 - edge[0], 300 - edge[1], 300 - edge[2], 255],
        fin1 = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],
        fin5 = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],
        tie = [158, 16, 158, 255],
        swapIfBad = true,
        /** @type {{colourPalette:{[string]:number[]},colourLocations:}} */
        accessoryOptions = {},
        slim = false
    ) {
        this.canvasContext.clearRect(0, 0, 64, 64)
        if (!customSkinKeepOption.checked) this.canvasContext.drawImage((slim) ? imgSlim : img, 0, 0);
        else {
            this.canvasContext.drawImage(customImg, 0, 0)
            if (customImg.height == 32) {
                let imageData = this.canvasContext.getImageData(0, 0, 64, 64);
                fixSmallSkinFile(imageData);
                this.canvasContext.putImageData(imageData, 0, 0);
            }
        }
        if (swapIfBad && (fin1[0] + fin1[1] + fin1[2]) < (fin5[0] + fin5[1] + fin5[2])) {
            [fin1, fin5] = [fin5, fin1]
        }
        if (swapIfBad && (edge[0] + edge[1] + edge[2]) > (middle[0] + middle[1] + middle[2])) {
            [edge, middle] = [middle, edge]
        }
        // Interpolate different colours from the existing colours
        let edge2 = [(2 * edge[0] + 3 * middle[0]) / 5, (2 * edge[1] + 3 * middle[1]) / 5, (2 * edge[2] + 3 * middle[2]) / 5, 255]
        let fin2 = [(3 * fin1[0] + fin5[0]) / 4, (3 * fin1[1] + fin5[1]) / 4, (3 * fin1[2] + fin5[2]) / 4, 255]
        let fin3 = [(fin1[0] + fin5[0]) / 2, (fin1[1] + fin5[1]) / 2, (fin1[2] + fin5[2]) / 2, 255]
        let fin4 = [(fin1[0] + 3 * fin5[0]) / 4, (fin1[1] + 3 * fin5[1]) / 4, (fin1[2] + 3 * fin5[2]) / 4, 255]
        let colours = {
            // Standard Axolotl
            "A": edge,
            "B": edge2,
            "C": middle,
            "D": lip,
            "E": eye,
            "F": fin1,
            "G": fin2,
            "H": fin3,
            "I": fin4,
            "J": fin5,
            "K": tie,


            " ": [0, 0, 0, 0],
            "X": [-1, -1, -1, -1]
        }
        let png = { 
            width: 64,
            height: 64
        }
        let imageData = this.canvasContext.getImageData(0, 0, 64, 64)
        let data = imageData.data;
        for (let partLocation in locations) {
            for (let loc2 in locations[partLocation]) {
                let type = partLocation
                /**
                 * @type {{top: string[];side_left: string[];side_right: string[];front: string[];base: string[];back: string[];}}
                 */
                let colourLocation = ((slim) ? colourLocationsSlim : colourLocations)[type]
                let pos = ((slim) ? locationsSlim : locations)[partLocation][loc2]
                let innerLocations = {
                    top: [colourLocation["side_right"][0].length, 0, colourLocation["side_right"][0].length + colourLocation["top"][0].length - 1, colourLocation["top"].length - 1],
                    base: [colourLocation["side_right"][0].length + colourLocation["top"][0].length, 0, 2 * colourLocation["side_right"][0].length + colourLocation["top"][0].length - 1, colourLocation["top"].length - 1],
                    side_left: [0, colourLocation["top"].length, colourLocation["side_right"][0].length - 1, colourLocation["top"].length + colourLocation["side_right"].length - 1],
                    side_right: [colourLocation["side_right"][0].length + colourLocation["front"][0].length, colourLocation["top"].length, 2 * colourLocation["side_right"][0].length + colourLocation["front"][0].length - 1, colourLocation["top"].length + colourLocation["side_right"].length - 1],
                    front: [colourLocation["side_right"][0].length, colourLocation["top"].length, colourLocation["side_right"][0].length + colourLocation["front"][0].length - 1, colourLocation["top"].length + colourLocation["front"].length - 1],
                    back: [2 * colourLocation["side_right"][0].length + colourLocation["front"][0].length, colourLocation["top"].length, 2 * colourLocation["side_right"][0].length + 2 * colourLocation["front"][0].length - 1, colourLocation["top"].length + colourLocation["back"].length - 1]
                }
                for (let location in innerLocations) {
                    let actL = location + ""
                    /**
                     * @typedef {('top'|'base'|'side'|'front'|'back')} LocationType
                     * @type {LocationType}
                     */
                    let locationType = location
                    let l2 = innerLocations[actL];
                    for (let i2 = 0; i2 < colourLocation[locationType].length; i2++) {
                        for (let i3 = 0; i3 < colourLocation[locationType][0].length; i3++) {
                            const codeLetter = colourLocation[locationType][i2][i3];
                            const accessoryCodeLetter = accessoryOptions ?. colourLocations ?. [type] ?. [locationType] ?. [i2] ?. [i3];
                            // console.log(accessoryOptions?.colourLocations?.[type]?.[locationType]?.[i2]?.[i3])
                            let xpos = pos[0] + l2[0] + i3;
                            let ypos = pos[1] + l2[1] + i2;
                            let stride = (xpos + ypos * png.width) * 4;
                            // console.log(xpos, ypos)
                            if (accessoryCodeLetter != undefined && accessoryCodeLetter != "X" && accessoryOptions.colourPalette[accessoryCodeLetter]) {
                                [
                                    data[stride],
                                    data[stride + 1],
                                    data[stride + 2],
                                    data[stride + 3]
                                ] = [
                                    clamp(accessoryOptions.colourPalette[accessoryCodeLetter][0] + 10 * getRandomAtStride(stride, 0), 0, 255),
                                    clamp(accessoryOptions.colourPalette[accessoryCodeLetter][1] + 10 * getRandomAtStride(stride, 1), 0, 255),
                                    clamp(accessoryOptions.colourPalette[accessoryCodeLetter][2] + 10 * getRandomAtStride(stride, 2), 0, 255),
                                    clamp(accessoryOptions.colourPalette[accessoryCodeLetter][3], 0, 255)
                                ];
                                continue;
                            }
                            if (codeLetter == "X" || customSkinKeepOption.checked) {
                                continue;
                            }
                            [
                                data[stride],
                                data[stride + 1],
                                data[stride + 2],
                                data[stride + 3]
                            ] = [
                                clamp(colours[codeLetter][0] + 6 * getRandomAtStride(stride, 0), 0, 255),
                                clamp(colours[codeLetter][1] + 6 * getRandomAtStride(stride, 1), 0, 255),
                                clamp(colours[codeLetter][2] + 6 * getRandomAtStride(stride, 2), 0, 255),
                                clamp(colours[codeLetter][3], 0, 255)
                            ];
                        }
                    }
                }
            }
        }
        let headImageData = new ImageData(8, 8);
        let headBuffer = Utils.getSubbufferFromBuffer(imageData.data, 8, 8, 8, 8);
        let hatBuffer = Utils.getSubbufferFromBuffer(imageData.data, 8 + 32, 8, 8, 8)
        headImageData.data.set(Utils.combineHeadAndHat(headBuffer, hatBuffer))
        this.headCanvasContext.putImageData(headImageData, 0, 0)
        this.headPNG = this.headCanvasContext.canvas.toDataURL()

        this.arrayBuffer.set(imageData.data)
        this.canvasContext.putImageData(imageData, 0, 0)
    }
    makeAxolotlRGB(
        EDGE_COLOUR = "#000000",
        MIDDLE_COLOUR = "#000000",
        MOUTH_COLOUR = "#000000",
        EYE_COLOUR = "#000000",
        FIN_START_COLOUR = "#000000",
        FIN_END_COLOUR = "#000000",
        TIE_COLOUR = "#000000",
        SLIM_SKIN = false,
        OPTIONS = {}
    ) {
        let edge = Utils.rgbToArray(EDGE_COLOUR)
        let middle = Utils.rgbToArray(MIDDLE_COLOUR)
        let mouth = Utils.rgbToArray(MOUTH_COLOUR)
        let eye = Utils.rgbToArray(EYE_COLOUR)
        let finStart = Utils.rgbToArray(FIN_START_COLOUR)
        let finEnd = Utils.rgbToArray(FIN_END_COLOUR)
        let tie = Utils.rgbToArray(TIE_COLOUR)
        this.makeAxolotl(edge, middle, mouth, eye, finStart, finEnd, tie, false, OPTIONS, SLIM_SKIN)
    }
}
const AxolotlSkinGenerator = new Axolotl()