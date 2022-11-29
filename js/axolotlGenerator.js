class AxolotlGenerator {
    static canvasContext;
    static makeAxolotl(
        edge = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],
        middle = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],
        lip = [255 - (edge[0] + middle[0]) / 2, 255 - (edge[1] + middle[1]) / 2, 255 - (edge[2] + middle[2]) / 2, 255],
        eye = [300 - edge[0], 300 - edge[1], 300 - edge[2], 255],
        fin1 = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],
        fin5 = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255],
        tie = [158, 16, 158, 255],
        swapIfBad = true,
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
        var edge2 = [(2 * edge[0] + 3 * middle[0]) / 5, (2 * edge[1] + 3 * middle[1]) / 5, (2 * edge[2] + 3 * middle[2]) / 5, 255]
        var fin2 = [(3 * fin1[0] + fin5[0]) / 4, (3 * fin1[1] + fin5[1]) / 4, (3 * fin1[2] + fin5[2]) / 4, 255]
        var fin3 = [(fin1[0] + fin5[0]) / 2, (fin1[1] + fin5[1]) / 2, (fin1[2] + fin5[2]) / 2, 255]
        var fin4 = [(fin1[0] + 3 * fin5[0]) / 4, (fin1[1] + 3 * fin5[1]) / 4, (fin1[2] + 3 * fin5[2]) / 4, 255]
        var colours = {
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
        var png = { width: 64, height: 64 }
        var imageData = this.canvasContext.getImageData(0, 0, 64, 64)
        var data = [...imageData.data].reduce((prev, curr, index) => {
            (prev[Math.floor(index / 4)]) ? prev[Math.floor(index / 4)][index % 4] = curr : prev[Math.floor(index / 4)] = [curr]
            return prev;
        }, []).reduce((prev, curr, inde) => {
            (prev[Math.floor(inde / (png.width))]) ? prev[Math.floor(inde / png.width)][inde % png.width] = curr : prev[Math.floor(inde / (png.width))] = [curr]
            return prev;
        }, [])
        for (var location in locations) {
            for (var loc2 in locations[location]) {
                var type = location
                var d = ((slim) ? colourLocationsSlim : colourLocations)[type]
                var width = 2 * d["side"][0].length + 2 * d["front"][0].length
                var height = d["front"].length + d["top"].length
                var pos = ((slim) ? locationsSlim : locations)[location][loc2]
                var innerLocations = {
                    top: [d["side"][0].length, 0, d["side"][0].length + d["top"][0].length - 1, d["top"].length - 1],
                    base: [d["side"][0].length + d["top"][0].length, 0, 2 * d["side"][0].length + d["top"][0].length - 1, d["top"].length - 1],
                    side_left: [0, d["top"].length, d["side"][0].length - 1, d["top"].length + d["side"].length - 1],
                    side_right: [d["side"][0].length + d["front"][0].length, d["top"].length, 2 * d["side"][0].length + d["front"][0].length - 1, d["top"].length + d["side"].length - 1],
                    front: [d["side"][0].length, d["top"].length, d["side"][0].length + d["front"][0].length - 1, d["top"].length + d["front"].length - 1],
                    back: [2 * d["side"][0].length + d["front"][0].length, d["top"].length, 2 * d["side"][0].length + 2 * d["front"][0].length - 1, d["top"].length + d["back"].length - 1]
                }
                for (let l in innerLocations) {
                    var actL = l + ""
                    l = l.split("_")[0]
                    var l2 = innerLocations[actL];
                    var d2 = { ...d }
                    if (actL.includes("left")) for (const key in d2) { d2[key] = d2[key].map(e => { return (e.split("").reverse().join("")) }) }
                    for (let i2 = 0; i2 < d2[l].length; i2++) {
                        for (let i3 = 0; i3 < d2[l][0].length; i3++) {
                            const codeLetter = d2[l][i2][i3];
                            if (codeLetter == "X") {
                                continue;
                            }
                            data[pos[1] + l2[1] + i2][pos[0] + l2[0] + i3] = colours[codeLetter]
                        }
                    }
                }
            }
        }
        var writeData = (data.reduce((prev, curr) => {
            prev.push(...curr)
            return prev;
        }, []).reduce((prev, curr) => {
            prev.push(...curr)
            return prev;
        }, []))
        writeData.forEach((va, ind) => { imageData.data[ind] = va })
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
        SLIM_SKIN = false
    ) {
        EDGE_COLOUR = EDGE_COLOUR.replace("#", "")
        var edge = [parseInt(EDGE_COLOUR, 16) >> 16 & 255, parseInt(EDGE_COLOUR, 16) >> 8 & 255, parseInt(EDGE_COLOUR, 16) >> 0 & 255, 255]
        MIDDLE_COLOUR = MIDDLE_COLOUR.replace("#", "")
        var middle = [parseInt(MIDDLE_COLOUR, 16) >> 16 & 255, parseInt(MIDDLE_COLOUR, 16) >> 8 & 255, parseInt(MIDDLE_COLOUR, 16) >> 0 & 255, 255]
        MOUTH_COLOUR = MOUTH_COLOUR.replace("#", "")
        var mouth = [parseInt(MOUTH_COLOUR, 16) >> 16 & 255, parseInt(MOUTH_COLOUR, 16) >> 8 & 255, parseInt(MOUTH_COLOUR, 16) >> 0 & 255, 255]
        EYE_COLOUR = EYE_COLOUR.replace("#", "")
        var eye = [parseInt(EYE_COLOUR, 16) >> 16 & 255, parseInt(EYE_COLOUR, 16) >> 8 & 255, parseInt(EYE_COLOUR, 16) >> 0 & 255, 255]
        FIN_START_COLOUR = FIN_START_COLOUR.replace("#", "")
        var finStart = [parseInt(FIN_START_COLOUR, 16) >> 16 & 255, parseInt(FIN_START_COLOUR, 16) >> 8 & 255, parseInt(FIN_START_COLOUR, 16) >> 0 & 255, 255]
        FIN_END_COLOUR = FIN_END_COLOUR.replace("#", "")
        var finEnd = [parseInt(FIN_END_COLOUR, 16) >> 16 & 255, parseInt(FIN_END_COLOUR, 16) >> 8 & 255, parseInt(FIN_END_COLOUR, 16) >> 0 & 255, 255]
        TIE_COLOUR = TIE_COLOUR.replace("#", "")
        var tie = [parseInt(TIE_COLOUR, 16) >> 16 & 255, parseInt(TIE_COLOUR, 16) >> 8 & 255, parseInt(TIE_COLOUR, 16) >> 0 & 255, 255]
        this.makeAxolotl(edge, middle, mouth, eye, finStart, finEnd, tie, false, SLIM_SKIN)
    }
}