class Utils {
    static rgbToArray(colour) {
        colour = colour.replace(/#/g, "")
        let asNumber = parseInt(colour, 16)
        return [asNumber >> 16 & 255, asNumber >> 8 & 255, asNumber >> 0 & 255, 255]
    }
    /**
     * 
     * @param {string[]} arrayOfStrings 
     */
    static reverse(arrayOfStrings) {
        for (let i = 0; i < arrayOfStrings.length; i++) {
            let string = arrayOfStrings[i];
            let j = 0;
            let newString = ""
            while (j++ < string.length) {
                newString += string[string.length - j]
            }
            arrayOfStrings[i] = newString
        }
        return arrayOfStrings
    }
    /**
     * Get a section of a Uint8ClampedArray
     * @param {Uint8ClampedArray} fromArrayBuffer 
     * @param {number} xStart
     * @param {number} yStart  
     * @param {number} width 
     * @param {number} height
     */
    static getSubbufferFromBuffer(fromArrayBuffer, xStart, yStart, width, height) {
        let data = new Uint8ClampedArray(width * height * 4);
        for (let xp = 0; xp < width; xp++) {
            for (let yp = 0; yp < height; yp++) {
                let stride = ((yp) * width + xp) * 4;
                let strideOriginal = ((yStart + yp) * 64 + (xStart + xp)) * 4
                data[stride] = fromArrayBuffer[strideOriginal];
                data[stride + 1] = fromArrayBuffer[strideOriginal + 1];
                data[stride + 2] = fromArrayBuffer[strideOriginal + 2];
                data[stride + 3] = fromArrayBuffer[strideOriginal + 3];
            }
        }
        return data;
    }
    /**
     * Puts a new section into a Uint8ClampedArray
     * @param {Uint8ClampedArray} targetArrayBuffer 
     * @param {Uint8ClampedArray} fromArrayBuffer 
     * @param {number} xStart
     * @param {number} yStart  
     * @param {number} width 
     * @param {number} height
     */
    static putSubbufferInBuffer(targetArrayBuffer, fromArrayBuffer, xStart, yStart, width, height) {
        for (let xp = 0; xp < width; xp++) {
            for (let yp = 0; yp < height; yp++) {
                let stride = ((yStart + yp) * 64 + (xStart + xp)) * 4;
                let strideOriginal = ((yp) * width + xp) * 4;
                targetArrayBuffer[stride] = fromArrayBuffer[strideOriginal];
                targetArrayBuffer[stride + 1] = fromArrayBuffer[strideOriginal + 1];
                targetArrayBuffer[stride + 2] = fromArrayBuffer[strideOriginal + 2];
                targetArrayBuffer[stride + 3] = fromArrayBuffer[strideOriginal + 3];
            }
        }
        return targetArrayBuffer;
    }
    /**
     * Puts a new section into a Uint8ClampedArray
     * @param {Uint8ClampedArray} targetArrayBuffer 
     * @param {Uint8ClampedArray} fromArrayBuffer 
     * @param {number} xStart
     * @param {number} yStart  
     * @param {number} width 
     * @param {number} height
     */
    static reverseUint8ClampedArray(arrayBuffer, width, height) {
        let data = new Uint8ClampedArray(width * height * 4);
        for (let xp = width; xp > 0; xp--) {
            for (let yp = 0; yp < height; yp++) {
                let stride = ((yp) * width + (width - xp)) * 4;
                let strideOriginal = ((yp + 0) * width + (xp-1)) * 4;
                data[stride] = arrayBuffer[strideOriginal];
                data[stride + 1] = arrayBuffer[strideOriginal + 1];
                data[stride + 2] = arrayBuffer[strideOriginal + 2];
                data[stride + 3] = arrayBuffer[strideOriginal + 3];
            }
        }
        return data;
    }
    /**
     * 
     * @param {Uint8ClampedArray} headBuffer 
     * @param {Uint8ClampedArray} hatBuffer 
     */
    static combineHeadAndHat(headBuffer, hatBuffer) {
        let finalBuffer = new Uint8ClampedArray(headBuffer.length)
        for (let stride = 0; stride < headBuffer.byteLength; stride += 4) {
            let headAlpha = hatBuffer[stride + 3] / 255;
            [
                finalBuffer[stride + 0],
                finalBuffer[stride + 1],
                finalBuffer[stride + 2],
                finalBuffer[stride + 3]
            ] = [
                hatBuffer[stride + 0] * headAlpha + headBuffer[stride + 0] * (1 - headAlpha),
                hatBuffer[stride + 1] * headAlpha + headBuffer[stride + 1] * (1 - headAlpha),
                hatBuffer[stride + 2] * headAlpha + headBuffer[stride + 2] * (1 - headAlpha),
                hatBuffer[stride + 3] * headAlpha + headBuffer[stride + 3] * (1 - headAlpha)
            ];
        }
        return finalBuffer;
    }
}