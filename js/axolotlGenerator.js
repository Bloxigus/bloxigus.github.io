class AxolotlGenerator {
    /** @type {CanvasRenderingContext2D} */
    static canvasContext;
    static arrayBuffer = new Uint8ClampedArray(4* 64 * 64);
    static setSkinArrayBuffer = new Uint8ClampedArray(4 * 64 * 64);
    static makeAxolotl(
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
        this.canvasContext.drawImage((slim) ? imgSlim : img, 0, 0);
        if (swapIfBad && (fin1[0] + fin1[1] + fin1[2]) < (fin5[0] + fin5[1] + fin5[2])) {
            [fin1, fin5] = [fin5, fin1]
        }
        if (swapIfBad && (edge[0] + edge[1] + edge[2]) > (middle[0] + middle[1] + middle[2])) {
            [edge, middle] = [middle, edge]
        }
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
        let png = { width: 64, height: 64 }
        // console.log(accessoryOptions)
        let imageData = this.canvasContext.getImageData(0, 0, 64, 64)
        let data;
        if (customSkinKeepOption.checked) {
            data = [...this.setSkinArrayBuffer].reduce((prev, curr, index) => {
                (prev[Math.floor(index / 4)]) ? prev[Math.floor(index / 4)][index % 4] = curr : prev[Math.floor(index / 4)] = [curr]
                return prev;
            }, []).reduce((prev, curr, inde) => {
                (prev[Math.floor(inde / (png.width))]) ? prev[Math.floor(inde / png.width)][inde % png.width] = curr : prev[Math.floor(inde / (png.width))] = [curr]
                return prev;
            }, [])
        } else {
            data = [...imageData.data].reduce((prev, curr, index) => {
                (prev[Math.floor(index / 4)]) ? prev[Math.floor(index / 4)][index % 4] = curr : prev[Math.floor(index / 4)] = [curr]
                return prev;
            }, []).reduce((prev, curr, inde) => {
                (prev[Math.floor(inde / (png.width))]) ? prev[Math.floor(inde / png.width)][inde % png.width] = curr : prev[Math.floor(inde / (png.width))] = [curr]
                return prev;
            }, [])
        }
        for (let location in locations) {
            for (let loc2 in locations[location]) {
                let type = location
                /**
                 * @type {{top: string[];side_left: string[];side_right: string[];front: string[];base: string[];back: string[];}}
                 */
                let colourLocation = ((slim) ? colourLocationsSlim : colourLocations)[type]
                let pos = ((slim) ? locationsSlim : locations)[location][loc2]
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
                    let copyofColourLocation = { ...colourLocation }
                    // if (actL.includes("left")) for (const key in copyofColourLocation) { copyofColourLocation[key] = copyofColourLocation[key].map(e => { return (e.split("").reverse().join("")) }) }
                    for (let i2 = 0; i2 < copyofColourLocation[locationType].length; i2++) {
                        for (let i3 = 0; i3 < copyofColourLocation[locationType][0].length; i3++) {
                            const codeLetter = copyofColourLocation[locationType][i2][i3];
                            const accessoryCodeLetter = accessoryOptions?.colourLocations?.[type]?.[locationType]?.[i2]?.[i3];
                            // console.log(accessoryOptions?.colourLocations?.[type]?.[locationType]?.[i2]?.[i3])

                            if (accessoryCodeLetter != undefined && accessoryCodeLetter != "X" && accessoryOptions.colourPalette[accessoryCodeLetter]) {
                                data[pos[1] + l2[1] + i2][pos[0] + l2[0] + i3] = accessoryOptions.colourPalette[accessoryCodeLetter];
                                // console.log(accessoryOptions[accessoryCodeLetter])
                                continue
                            }
                            if (codeLetter == "X" || customSkinKeepOption.checked) {
                                continue;
                            }
                            data[pos[1] + l2[1] + i2][pos[0] + l2[0] + i3] = colours[codeLetter]
                        }
                    }
                }
            }
        }
        let writeData = (data.reduce((prev, curr) => {
            prev.push(...curr)
            return prev;
        }, []).reduce((prev, curr) => {
            prev.push(...curr)
            return prev;
        }, []))
        writeData.forEach((va, ind) => { imageData.data[ind] = va })
        this.arrayBuffer.set(imageData.data)
        this.canvasContext.putImageData(imageData, 0, 0)
    }
    static makeAxolotlRGB(
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
        EDGE_COLOUR = EDGE_COLOUR.replace("#", "")
        let edge = Utils.rgbToArray(EDGE_COLOUR)
        MIDDLE_COLOUR = MIDDLE_COLOUR.replace("#", "")
        let middle = Utils.rgbToArray(MIDDLE_COLOUR)
        MOUTH_COLOUR = MOUTH_COLOUR.replace("#", "")
        let mouth = Utils.rgbToArray(MOUTH_COLOUR)
        EYE_COLOUR = EYE_COLOUR.replace("#", "")
        let eye = Utils.rgbToArray(EYE_COLOUR)
        FIN_START_COLOUR = FIN_START_COLOUR.replace("#", "")
        let finStart = Utils.rgbToArray(FIN_START_COLOUR)
        FIN_END_COLOUR = FIN_END_COLOUR.replace("#", "")
        let finEnd = Utils.rgbToArray(FIN_END_COLOUR)
        TIE_COLOUR = TIE_COLOUR.replace("#", "")
        let tie = Utils.rgbToArray(TIE_COLOUR)
        this.makeAxolotl(edge, middle, mouth, eye, finStart, finEnd, tie, false, OPTIONS, SLIM_SKIN)
    }
}