class Utils {
    static rgbToArray(colour) {
        colour = colour.replace(/#/g,"")
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
}