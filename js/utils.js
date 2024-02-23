class Utils {
    static rgbToArray(colour) {
        colour = colour.replace(/#/g,"")
        return [parseInt(colour, 16) >> 16 & 255, parseInt(colour, 16) >> 8 & 255, parseInt(colour, 16) >> 0 & 255, 255]
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