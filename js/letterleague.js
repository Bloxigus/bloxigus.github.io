import LetterLeagueBoard from "./letterleagueboard.js";
function wait(ms) {
    return new Promise(r => setTimeout(r, ms))
}
let board = new LetterLeagueBoard();

let canvas = document.querySelector("canvas[data-display=renderer]").getContext("2d")
board.init(canvas, true)
let animate = function () {
    window.board.render();
    if (!window.stopit) requestAnimationFrame(animate)
}
window.addEventListener("mousemove", (event) => {
    window.board.mouseX = event.clientX
    window.board.mouseY = event.clientY
})
window.addEventListener("mousedown", (event) => {
    if (event.button != 1)window.board.onClick(event.button)
    if (event.button != 1) event.preventDefault()
})
window.addEventListener("mouseup", (event) => {
    if (event.button != 1)window.board.onClickUp(event.button)
        if (event.button != 1)event.preventDefault()
})
window.addEventListener("keydown", (event) => {
    if (!event.ctrlKey) window.board.onKeyboard(event.key)
    // event.preventDefault()
})
window.addEventListener("contextmenu", (event) => {
    // event.preventDefault()
})
window.board = board;
requestAnimationFrame(animate)
window.animate = animate;