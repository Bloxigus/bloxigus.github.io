/**
 * 
 * @param {String} uri 
 * @param {"text"|"blob"|"arraybuffer"|"json"|undefined} returnType 
 * @throws {DOMException|TypeError}
 * @returns 
 */
async function getResource(uri, returnType) {
    let request = await fetch(uri);
    switch (returnType) {  
        case "blob": return await request.blob();
        case "text": return await request.text();
        case "json": return await request.json();
        case "arraybuffer":
        default: return await request.arrayBuffer()
    }
}
// if (window) window.getResource = getResource
export {
    getResource
}