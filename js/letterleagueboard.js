const BOARD_SEGMENT = [
    `__G___G___G_`,
    `_Y____B____Y`,
    `___G_____G__`,
    `__B__B_B__B_`,
    `B___G___G___`,
    `___B_Y_Y_B__`,
    `GB____R____B`,
    `___B_Y_Y_B__`,
    `B___G___G___`,
    `__B__B_B__B_`,
    `___G_____G__`,
    `_Y____B____Y`
]
function easeInOutQuad(x)
{
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
let START_BOARD = [
    `S`
]
function getBoardAtPoint(x, y)
{
    if (x == 0 && y == 0) return START_BOARD[x][y]
    return BOARD_SEGMENT[((y % 12) + 12) % 12][((x % 12) + 12) % 12]
}
function getBonusAtPoint(x, y)
{
    let letter = getBoardAtPoint(x, y)
    if (letter == "R")
    {
        return ({
            letterMultiplier: 1,
            wordMultiplier: 3
        })
    }
    if (letter == "Y")
    {
        return ({
            letterMultiplier: 3,
            wordMultiplier: 1
        })
    }
    if (letter == "B")
    {
        return ({
            letterMultiplier: 2,
            wordMultiplier: 1
        })
    }
    if (letter == "G")
    {
        return ({
            letterMultiplier: 1,
            wordMultiplier: 2
        })
    }
    return ({
        letterMultiplier: 1,
        wordMultiplier: 1
    })
}
const zoom = 40;
import { isValidWord, anyWordsStartWith, getMysteryLetterOptions, clearCaches } from "./wordvalidator.js";
class Box
{
    startX = 0;
    startY = 0;
    width = 0;
    height = 0;
    startWidth = 0;
    startHeight = 0;
    x = 0;
    y = 0;
    /** @type {String|boolean} */
    fill = false
    /** @type {String|boolean} */
    stroke = "#000000"
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.width = width;
        this.height = height;
        this.startWidth = width;
        this.startHeight = height;
    }
    expandLeft()
    {
        this.x -= 1
        this.width += 1
    }
    expandRight()
    {
        this.width += 1
    }
    expandUp()
    {
        this.y -= 1
        this.height += 1
    }
    expandDown()
    {
        this.height += 1
    }
    area()
    {
        return this.height * this.width;
    }
    reset()
    {
        this.x = this.startX;
        this.y = this.startY;
    }
    expandTo(x)
    {
        if (x < this.x)
        {
            let diffX = this.x - x;
            this.x = x;
            this.width -= diffX;
        }
    }
    equals(other)
    {
        if (this.x == other.x && this.y == other.y && this.width == other.width && this.height == other.height) return true;
        return false;
    }
    /**
     * @param {(x: number, y: number) => void} callback 
     */
    every(callback)
    {
        for (let x = this.x; x < this.x + this.width; x++)
        {
            for (let y = this.y; y < this.y + this.height; y++)
            {
                callback(x, y)
            }
        }
    }
}
const POINT_VALS = {
    a: 1,
    b: 3,
    c: 3,
    d: 2,
    e: 1,
    f: 4,
    g: 2,
    h: 4,
    i: 1,
    j: 8,
    k: 5,
    l: 2,
    m: 3,
    n: 1,
    o: 1,
    p: 3,
    q: 10,
    r: 1,
    s: 1,
    t: 1,
    u: 1,
    v: 4,
    w: 4,
    x: 8,
    y: 4,
    z: 10,
    " ": 0,
    "?": 0,
    "*": 0
}
class WordPointBox extends Box
{
    points = 0;
    multipliers = 1;
    initialPoints = 0;
    initialMultiplier = 0;
    tempMult = false
    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} width 
     * @param {*} height 
     * @param {Cell} letter 
     * @param {*} bonus 
     */
    constructor(x, y, width, height, letter)
    {
        super(x, y, width, height)
        this.word = letter.letter;
        this.addLetter(letter)
        if (letter.isTemp) this.tempMult = true;
        this.initialPoints = this.points;
        this.initialMultiplier = this.multipliers;
    }
    getPoints()
    {
        if (isValidWord(this.word)) return this.points * this.multipliers;
        return -1
    }
    containingLetters = []
    /**
     * 
     * @param {Cell} letter 
     */
    addLetter(letter)
    {
        if (!(letter instanceof CellPlacement)) return;
        if (!letter.isTemp)
        {
            let points = letter.value
            this.points += points;
            this.containingLetters.push(letter)
        } else
        {
            let wordMultiplier = letter.isAlreadyUsed ? 1 : letter.wordMultiplier;
            let letterMultiplier = letter.multiplier;
            let points = letterMultiplier * (letter.isWild ? 0 : POINT_VALS[letter.letter] || 0)
            this.multipliers *= wordMultiplier;
            this.containingLetters.push(letter)
            this.points += points;
        }
    }
    updateLetters()
    {
        this.containingLetters.forEach((letter) =>
        {
            let letterMultiplier = letter.multiplier;
            letter.multiplier = letterMultiplier * this.multipliers;
            let points = letter.multiplier * (letter.isWild ? 0 : POINT_VALS[letter.letter] || 0);
            letter.value = points;
            letter.isAlreadyUsed = true;
        })
    }
    word = ""
    included = ""
    expandDown(letter, bonus)
    {
        super.expandDown()
        this.word += letter.letter;
        this.addLetter(letter, bonus)
    }
    expandUp(letter, bonus)
    {
        super.expandUp()
        this.word = letter.letter + this.word;
        this.addLetter(letter, bonus)
    }
    expandLeft(letter, bonus)
    {
        super.expandLeft()
        this.word = letter.letter + this.word;
        this.addLetter(letter, bonus)
    }
    expandRight(letter, bonus)
    {
        super.expandRight()
        this.word += letter.letter;
        this.addLetter(letter, bonus)
    }
    isValidWord()
    {
        return isValidWord(this.word)
    }
    reset()
    {
        super.reset();
        this.word = ""
        this.points = this.initialPoints;
        this.multipliers = this.initialMultiplier;
    }
    /**
     * 
     * @param {LetterLeagueBoard} board 
     */
    center(board)
    {
        board.offsetX = this.x + (this.width * zoom / 2)
        board.offsetY = this.y + (this.height * zoom / 2)
    }
    /**
     * 
     * @param {LetterLeagueBoard} board 
     * @param {CellPlacement[]} letters 
     */
    static center(board, letters)
    {
        let { xTotal, yTotal } = letters.reduce((prev, current) =>
        {
            return {
                xTotal: prev.xTotal + current.x,
                yTotal: prev.yTotal + current.y
            }
        }, { xTotal: 0, yTotal: 0 })
        board.offsetX = (xTotal * zoom) / letters.length
        board.offsetY = (yTotal * zoom) / letters.length
    }
}
/**
 * TODO: Use this function to reduce duplicate tests
 * @param {string[]} handArray 
 * @returns 
 */
function makeHand(handArray)
{
    let hand = {};
    for (let letter of handArray)
    {
        hand[letter] = (hand[letter] ?? 0) + 1
    }
    return hand;
}
class Cell
{
    static equals(x, y)
    {
        return function (cell2)
        {
            if (x == cell2.x && y == cell2.y) return true;
            return false
        }
    }
    data = {}
    isWild = false;
    isTemp = false;
    letter = "";
    value = -1;
    multiplier = 1;
    baseMultiplier = 1;
    wordMultiplier = 1;
    currentWordMultiplier = 1;
    baseWordMultiplier = 1;
    isAlreadyUsed = false;

    init()
    {
        this.multiplier = this.baseMultiplier;
        this.wordMultiplier = this.baseWordMultiplier;
    }

    getMult()
    {
        return this.isWild ? 0 : this.value
    }
}
class NotACell extends Cell
{
    constructor(x, y, letter)
    {
        super();
        this.x = x;
        this.y = y;
        this.letter = letter;
    }
}
let font = "museo-sans"
class CellPlacement extends Cell
{
    x = 0;
    y = 0;
    oldCell;
    constructor(x, y, letter, wild, board)
    {
        super();
        this.x = x;
        this.y = y;
        if (letter == "*") letter = "?";
        this.letter = letter;
        this.isWild = wild;
        this.isTemp = true;
        let bonus = getBonusAtPoint(x, y)
        this.baseMultiplier = bonus.letterMultiplier;
        this.baseWordMultiplier = bonus.wordMultiplier;
        this.init()
    }
    setReplacement(oldCell)
    {
        this.oldCell = oldCell
    }
    place()
    {
        this.isTemp = false;
        delete this.oldCell;
    }
}
class Button extends Box
{
    constructor(x, y, width, height, title, callback)
    {
        super(x, y, width, height)
        this.title = title;
        this.callback = callback;
    }
    onClick()
    {
        this.callback();
    }
}
function pointInRect(x, y, x1, y1, x2, y2)
{
    if (x < Math.max(x1, x2) && x > Math.min(x1, x2) && y < Math.max(y1, y2) && y > Math.min(y1, y2)) return true;
    return false;
}
export default class LetterLeagueBoard
{
    /** @type {Map<string, Cell>} */
    placedLetters;
    mouseX = -1
    mouseY = -1
    center = { x: 0, y: 0 }
    width = 1;
    height = 1;
    originX = 0
    originY = 0
    offsetX = 15
    offsetY = 15;
    startX = 0;
    endX = 0;
    startY = 0;
    endY = 0;
    doEasing = false;
    easingT = 0;
    easeDuration = 1000
    lastTimestamp = Date.now();
    /**
     * 
     * @param {CanvasRenderingContext2D} canvasContext 
     */
    init(canvasContext)
    {
        this.placedLetters = new Map()
        this.originX = -16
        this.originY = -16
        this.width = 23
        this.height = 17
        this.offsetX = this.width / 2;
        this.offsetY = this.height / 2;
        this.canvasContext = canvasContext;
        this.updateWidth(window.innerWidth)
    }
    updateWidth(newWidth)
    {
        let sidebar = 10; // 10 * width
        let remainder = newWidth - sidebar * zoom - 20
        let oldWidth = this.width
        this.width = remainder / 40
        this.height = 17
         // this.width / 2 - 1;

        this.offsetX = (this.offsetX - 1 - oldWidth / 2) / oldWidth * this.width + this.width / 2 + 1;
        // this.offsetY = this.offsetY / oldWidth * this.width;
        this.buttons.length = 0;
        this.buttons.push(new Button(
            this.width * zoom + zoom / 2,
            zoom / 2,
            9 * zoom,
            zoom,
            "Toggle Wild",
            this.toggleWild.bind(this)
        ))
        this.buttons.push(new Button(
            this.width * zoom + zoom / 2,
            zoom / 2 + zoom * 2,
            9 * zoom,
            zoom,
            "Next Best Option",
            this.placeNextTopScore.bind(this)
        ))
        this.buttons.push(new Button(
            this.width * zoom + zoom / 2,
            zoom / 2 + zoom * 4,
            9 * zoom,
            zoom,
            "Reset",
            () =>
            {
                window.board = new LetterLeagueBoard()
                window.board.init(this.canvasContext)
            }
        ))
        this.buttons.push(new Button(
            this.width * zoom + zoom / 2,
            zoom / 2 + zoom * 6,
            9 * zoom,
            zoom,
            "Center Board",
            () =>
            {
                this.easeTo(
                    (this.width / 2) - 0.5,
                    (this.height / 2) - 0.5
                )
            }
        ))
    }
    pointLog = []
    render()
    {

        if (this.doEasing)
        {
            if (this.t == 0)
            {
                this.lastTimestamp = Date.now()
                this.t += 0.001
            } else
            {
                let delta = Date.now() - this.lastTimestamp
                this.lastTimestamp += delta
                this.t += delta / this.easeDuration;
            }
            if (this.t >= 1)
            {
                this.doEasing = false;
                this.t = 1;
            }
            this.offsetX = (1 - easeInOutQuad(this.t)) * this.startX + easeInOutQuad(this.t) * this.endX
            this.offsetY = (1 - easeInOutQuad(this.t)) * this.startY + easeInOutQuad(this.t) * this.endY
        }


        if (this.isClicking && (this.clickStartTime + 1250 < Date.now() || (this.mouseX - this.clickStartPos.x) ** 2 + (this.mouseY - this.clickStartPos.y) ** 2 > 100))
        {
            this.offsetX = (this.mouseX - this.clickStartPos.x) / zoom + this.clickStartPos.offsetX;
            this.offsetY = (this.mouseY - this.clickStartPos.y) / zoom + this.clickStartPos.offsetY;
        }


        let canvasContext = this.canvasContext;

        let height = this.height;
        let width = this.width || 0;
        let rect = this.canvasContext.canvas.getBoundingClientRect();

        canvasContext.clearRect(0, 0, width * zoom, height * zoom)

        canvasContext.canvas.width = width * zoom + 10 * zoom
        canvasContext.canvas.height = height * zoom + 3 * zoom
        let topLeftX = Math.floor(-this.offsetX)
        let topLeftY = Math.floor(-this.offsetY)
        for (let row = topLeftY; row < topLeftY + this.height + 1; row++)
        {
            for (let column = topLeftX; column < topLeftX + this.width + 1; column++)
            {
                let background = getBoardAtPoint(column, row)
                switch (background)
                {
                    case "Y":
                        canvasContext.fillStyle = "#ffd05f"
                        break;
                    case "G":
                        canvasContext.fillStyle = "#aef6ab"
                        break;
                    case "B":
                        canvasContext.fillStyle = "#abe6ff"
                        break;
                    case "R":
                        canvasContext.fillStyle = "#ff9e78"
                        break;
                    case "S":
                        canvasContext.fillStyle = "#fff7e3"
                        break;
                    default:
                        canvasContext.fillStyle = "#ffe5c6"
                }
                canvasContext.fillRect((this.offsetX + column) * zoom, (this.offsetY + row) * zoom, zoom, zoom)
                canvasContext.strokeStyle = "#fff6e1"
                canvasContext.strokeRect((this.offsetX + column) * zoom, (this.offsetY + row) * zoom, zoom, zoom)
            }
        }

        canvasContext.strokeStyle = "#7F7F7F"
        let relativeX = (this.mouseX - rect.left);
        let relativeY = (this.mouseY - rect.top);
        let insideX = Math.floor(
            (this.mouseX - rect.left - this.offsetX * zoom) / zoom) * zoom + this.offsetX * zoom;
        let insideY = Math.floor(
            (this.mouseY - rect.top - this.offsetY * zoom) / zoom) * zoom + this.offsetY * zoom;
        // console.log(insideX, insideY)
        // console.log(relativeX, relativeY)
        if (insideX > width * zoom || insideX < 0 || insideY > height * zoom || insideY < 0)
        {
            this.hoveredBox = { type: "none" };
        } else
        {
            canvasContext.strokeRect(insideX, insideY, zoom, zoom)
            this.hoveredBox = {
                x: insideX - this.offsetX * zoom,
                y: insideY - this.offsetY * zoom, type: "tilesquare"
            }
        }
        if (this.highlightedBox.type == "tilesquare")
        {
            canvasContext.strokeStyle = "#000000"
            canvasContext.strokeRect(
                this.highlightedBox.x + this.offsetX * zoom,
                this.highlightedBox.y + this.offsetY * zoom,
                zoom, zoom)
        }
        canvasContext.fillStyle = "#000000"
        canvasContext.font = `${zoom}px ${font}`
        canvasContext.textAlign = "center"
        canvasContext.textBaseline = "middle"
        for (let y = topLeftY; y < topLeftY + this.height + 1; y++)
        {
            for (let x = topLeftX; x < topLeftX + this.width + 1; x++)
            {
                if (!this.hasCell(x, y) && !this.hasTile(x, y)) continue;
                canvasContext.fillStyle = "#000000"
                if (this.hasTile(x, y) && this.getTile(x, y).isWild) canvasContext.fillStyle = "#0000FF"
                else if (this.hasCell(x, y) && this.getCell(x, y).isWild) canvasContext.fillStyle = "#0000FF"

                canvasContext.font = `${0.875 * zoom}px ${font}`
                canvasContext.textAlign = "center"
                canvasContext.textBaseline = "middle"
                if (this.hasCell(x, y)) canvasContext.fillText(this.getCell(x, y).letter.toLowerCase(), (this.offsetX + x) * zoom + (0.5 * zoom), (this.offsetY + y) * zoom + (0.5 * zoom))
                else canvasContext.fillText(this.getTile(x, y).letter.toLowerCase(), (this.offsetX + x) * zoom + (0.5 * zoom), (this.offsetY + y) * zoom + (0.5 * zoom))
                if (this.hasTile(x, y) && this.showTempwords)
                {
                    canvasContext.strokeStyle = "#FF0000"
                    canvasContext.strokeRect((this.offsetX + x) * zoom, (this.offsetY + y) * zoom, zoom, zoom)
                }
                canvasContext.fillStyle = "#1F1F1F"

                canvasContext.font = `${0.5 * zoom}px ${font}`
                canvasContext.textAlign = "right"
                canvasContext.textBaseline = "top"
                if (this.hasCell(x, y) && this.getCell(x, y).value > 0)
                {
                    canvasContext.fillText((this.getCell(x, y).value), (this.offsetX + x) * zoom + (zoom), (this.offsetY + y) * zoom)
                }
            }
        }
        canvasContext.fillStyle = "#000000"
        canvasContext.fillRect(this.width * zoom, 0, 2 * zoom, this.height * zoom + 2 * zoom)
        canvasContext.fillRect(0, this.height * zoom, this.width * zoom + 2 * zoom, 2 * zoom)
        canvasContext.fillStyle = "#F0F0F0"
        canvasContext.fillRect(width * (0.5 * zoom) - 0 * zoom, height * zoom + Math.floor(0.5 * zoom), 7 * 2 * zoom, 2 * zoom)
        for (let handTile in this.hand)
        {
            canvasContext.textBaseline = "middle"
            canvasContext.fillStyle = "#E0E0E0"
            canvasContext.fillRect(width * (0.5 * zoom) - 0 * zoom + 2 * zoom * handTile, height * zoom + Math.floor(0.5 * zoom), 2 * zoom, 2 * zoom)
            canvasContext.textAlign = "center"
            canvasContext.font = `${2 * zoom}px ${font}`
            canvasContext.fillStyle = "black"
            canvasContext.fillText(this.hand[handTile].toLowerCase(), width * (0.5 * zoom) - 0 * zoom + 2 * zoom * handTile + zoom, height * zoom + Math.floor(0.5 * zoom) + zoom)
        }
        if (this.hand.length == 0)
        {
            canvasContext.textBaseline = "top"
            canvasContext.textAlign = "center"
            canvasContext.font = `${1 * zoom}px ${font}`
            canvasContext.fillStyle = "#A0A0A0"
            canvasContext.fillText("Hand / Rack", width * (0.5 * zoom) - 0 * zoom + 2 * zoom * 1 + zoom, height * zoom + Math.floor(0.5 * zoom) + zoom)
        }

        if (relativeY > height * zoom + Math.floor(0.5 * zoom) && relativeY < height * zoom + 2 * zoom + Math.floor(0.5 * zoom))
        {
            canvasContext.strokeStyle = "#7F7F7F"
            canvasContext.strokeRect(width * (0.5 * zoom) - 0 * zoom, height * zoom + Math.floor(0.5 * zoom), 7 * 2 * zoom, 2 * zoom)
            this.hoveredBox = { type: "hand" }
        }
        if (this.highlightedBox.type == "hand")
        {
            canvasContext.strokeStyle = "#8F8F8F"
            canvasContext.strokeRect(width * (0.5 * zoom) - 0 * zoom, height * zoom + Math.floor(0.5 * zoom), 7 * 2 * zoom, 2 * zoom)
        }
        if (this.topScoringPredictions.length != 0)
        {
            let value = Math.floor(this.topScoringPredictions[this.topScoringIndex].points)
            this.canvasContext.fillStyle = "#FFFFFF"
            this.canvasContext.textAlign = "left"
            canvasContext.font = `${1 * zoom}px ${font}`
            canvasContext.textBaseline = "middle"
            this.canvasContext.fillText(`Pts: ${value}`, zoom / 2, height * zoom + Math.floor(0.5 * zoom) + zoom)
        }
        if (this.highlightedBox.type == "tilesquare") this.drawWordBoxes(this.highlightedBox.x / zoom, this.highlightedBox.y / zoom)
        for (let button of this.buttons)
        {
            canvasContext.strokeStyle = "#7f7f7f"
            if (pointInRect(relativeX, relativeY, button.x, button.y, button.x + button.width, button.y + button.height))
            {
                canvasContext.strokeStyle = "#000000"
            }
            canvasContext.fillStyle = "#7f7f7f"
            this.canvasContext.textAlign = "left"
            canvasContext.textBaseline = "top"
            canvasContext.font = `${zoom}px ${font}`
            canvasContext.strokeRect(button.x, button.y, button.width, button.height)
            canvasContext.fillText(button.title, button.x, button.y)

        }
    }
    hand = [];
    buttons = [];
    /** @type {Map<string, CellPlacement>} */
    placedTiles = new Map();
    highlightedBox = { type: "none" };
    hoveredBox = { type: "none" };
    onClick()
    {
        let canvasContext = this.canvasContext;
        let height = this.height;
        let width = this.width || 0;
        let rect = canvasContext.canvas.getBoundingClientRect();
        let insideX = (this.mouseX - rect.left);
        let insideY = (this.mouseY - rect.top);
        for (let button of this.buttons)
        {
            if (pointInRect(insideX, insideY, button.x, button.y, button.x + button.width, button.y + button.height))
            {
                return button.onClick()
            }
        }

        if (insideX < width * zoom || insideX > 0 || insideY < height * zoom || insideY > 0)
        {
            this.highlightedBox = this.hoveredBox;
        } else
        {

            this.highlightedBox = { type: "none" }
        }
        if (insideX < width * zoom && insideX > 0 && insideY < height * zoom && insideY > 0)
        {
            this.isClicking = true;
            this.clickStartTime = Date.now()
            this.clickStartPos = {
                x: this.mouseX,
                y: this.mouseY,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            }
        }

    }
    clickStartPos = {
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0
    }
    isClicking = false
    clickStartTime = 0
    onClickUp()
    {
        this.isClicking = false;
    }
    /**
     * Toggle whether the hovered space is a wildcard
     */
    toggleWild()
    {
        let hovered = this.getHovered();
        if (hovered.x)
        {
            if (this.hasTile(hovered.x, hovered.y))
            {
                this.getTile(hovered.x, hovered.y).isWild = !this.getTile(hovered.x, hovered.y).isWild;
            } else if (this.hasCell(hovered.x, hovered.y))
            {
                this.getCell(hovered.x, hovered.y).isWild = !this.getCell(hovered.x, hovered.y).isWild;
            }
        }
    }
    showTempwords = false
    onKeyboard(key)
    {
        let height = this.height;
        let width = this.width || 0;
        if (this.highlightedBox.type == "tilesquare")
        {
            this.showTempwords = false
            let x = this.highlightedBox.x / zoom;
            let y = this.highlightedBox.y / zoom;
            if (key.length == 1)
            {
                if ("abcdefghijklmnopqrstuvwxyz?*".includes(key))
                {
                    if (!this.hasCell(x, y))
                    {
                        let placement = new CellPlacement(x, y, key.toLowerCase(), false, this)
                        this.setTile(x, y, placement);
                    }
                }
            } else if (key == "ArrowDown")
            {
                this.highlightedBox.y += zoom
            } else if (key == "ArrowUp")
            {
                this.highlightedBox.y -= zoom
            } else if (key == "ArrowRight")
            {
                this.highlightedBox.x += zoom
            } else if (key == "ArrowLeft")
            {
                this.highlightedBox.x -= zoom
            } else if (key == "Backspace")
            {
                this.deleteTile(x, y)
            } else if (key == "Enter")
            {
                if (this.placedTiles.size != 0)
                {
                    let wordBox = new WordPointBox(0, 0, 0, 0, "#", "#")
                    let points = this.checkPointsForPlacement([...this.placedTiles.values()])
                    if (points == -1)
                    {
                        this.placedTiles.clear()
                        return;
                    }

                    if (points.find(value => !isValidWord(value.word)) || points.length == 0)
                    {
                        this.placedTiles.clear()
                    } else
                    {
                        let total = 0;
                        let xTotal = 0;
                        let yTotal = 0;
                        this.placedTiles.forEach(tile =>
                        {
                            total++;
                            xTotal += tile.x;
                            yTotal += tile.y;
                            wordBox.addLetter(tile)
                            tile.isTemp = false;
                            this.setCell(tile.x, tile.y, tile);
                        })
                        let logEntry = `${points.reduce((prev, curr) => prev + curr.getPoints(), 0)}: ${points.map(point => `${point.word.toUpperCase()}: ${point.getPoints()}`).join(", ")}`
                        this.pointLog.push(logEntry)
                        console.log(logEntry)
                        this.placedTiles.clear()
                        points.forEach(wpb => wpb.updateLetters())
                        this.firstMove = false
                        this.topScoringPredictions = []
                        this.easeTo(
                            Math.floor(-xTotal / total + this.width / 2),
                            Math.floor(-yTotal / total + this.height / 2)
                        )
                    }

                }
            } else if (key == "Delete")
            {
                this.deleteCell(x, y)
            }
        } else if (this.highlightedBox.type == "hand")
        {
            if (key.length == 1 && this.hand.length < 7)
            {
                if ("abcdefghijklmnopqrstuvwxyz?*".includes(key))
                {
                    if (key == "*") key = "?";
                    this.hand.push(key.toLowerCase());
                }
            } else if (key == "Backspace")
            {
                this.hand.length = Math.max(this.hand.length - 1, 0)
            } else if (key == "Enter")
            {
                console.log(`Running Solver ...`)
                console.time(`Solver Finished`)
                this.findBestMoveAsync()
                console.timeEnd(`Solver Finished`)
            }
        } else
        {
            if (key == "Enter")
            {
                if (Object.keys(this.placedTiles).length != 0)
                {
                    let wordBox = new WordPointBox(0, 0, 0, 0, "#", "#")
                    let points = this.checkPointsForPlacement(Object.values(this.placedTiles))
                    if (points == -1)
                    {
                        this.placedTiles.clear()
                        return;
                    }

                    if (points.find(value => !isValidWord(value.word)))
                    {
                        this.placedTiles.clear()
                    } else
                    {
                        for (let tile of Object.values(this.placedTiles))
                        {
                            wordBox.addLetter(tile)
                            tile.isTemp = false;
                            this.placedLetters[tile.x][tile.y] = tile
                        }
                        this.pointLog.push(`${points.reduce((prev, curr) => prev + curr.getPoints(), 0)}: ${points.map(point => `${point.word.toUpperCase()}: ${point.getPoints()}`).join(", ")}`)
                        this.placedTiles.clear()
                        points.forEach(wpb => wpb.updateLetters())
                        this.firstMove = false
                        this.topScoringPredictions = []
                    }

                }
            }
        }
    }
    /**
     * Draw a box on the screen
     * The screen gets rerenderered often
     * @param {Box} box 
     */
    drawBox(box)
    {
        let canvasContext = this.canvasContext;
        canvasContext.fillStyle = box.fill
        canvasContext.strokeStyle = box.stroke
        if (box.fill)
        {
            canvasContext.fillRect((this.offsetX + box.x) * zoom, (this.offsetY + box.y) * zoom, box.width * zoom, box.height * zoom)
        }
        if (box.stroke)
        {
            canvasContext.strokeRect((this.offsetX + box.x) * zoom, (this.offsetY + box.y) * zoom, box.width * zoom, box.height * zoom)
        }
    }
    maxX = 0;
    maxY = 0;
    minY = 0;
    minX = 0;
    hasCell(x, y)
    {
        x = Math.round(x)
        y = Math.round(y)
        return this.placedLetters.has(`(${x}, ${y})`)
    }
    getCell(x, y)
    {
        x = Math.round(x)
        y = Math.round(y)
        return this.placedLetters.get(`(${x}, ${y})`)
    }
    setCell(x, y, newCell)
    {
        x = Math.round(x)
        y = Math.round(y)
        this.placedLetters.set(`(${x}, ${y})`, newCell)
        if (this.maxX < x) this.maxX = x;
        if (this.minX > x) this.minX = x;
        if (this.maxY < y) this.maxY = y;
        if (this.minY > y) this.minY = y;
    }
    deleteCell(x, y)
    {
        x = Math.round(x)
        y = Math.round(y)
        this.placedLetters.delete(`(${x}, ${y})`)
    }
    hasTile(x, y)
    {
        x = Math.round(x)
        y = Math.round(y)
        return this.placedTiles.has(`(${x}, ${y})`)
    }
    getTile(x, y)
    {
        x = Math.round(x)
        y = Math.round(y)
        return this.placedTiles.get(`(${x}, ${y})`)
    }
    setTile(x, y, newTile)
    {
        x = Math.round(x)
        y = Math.round(y)
        this.placedTiles.set(`(${x}, ${y})`, newTile)
    }
    deleteTile(x, y)
    {
        x = Math.round(x)
        y = Math.round(y)
        this.placedTiles.delete(`(${x}, ${y})`)
    }
    /**
     * 
     * @param {number} startX the x value to start the search
     * @param {number} startY the x value to start the search
     * @param {boolean} draw whether to draw the boxes or just get the points 
     * @param {boolean} doX whether the calculation occurs in the x axis
     * @param {boolean} doY whether the calculation occurs in the y axis
     * @returns 
     */
    drawWordBoxes(startX, startY, draw = true, doX = true, doY = true)
    {
        if (draw) this.canvasContext.font = `${0.25 * zoom}px ${font}`
        if (!this.hasCell(startX, startY)) return {};
        let verticalBox = new WordPointBox(startX, startY, 1, 1, this.getCell(startX, startY), getBoardAtPoint(startX, startY));
        let horizontalBox = new WordPointBox(startX, startY, 1, 1, this.getCell(startX, startY), getBoardAtPoint(startX, startY));
        if (this.hasCell(startX, startY))
        {
            if (doY)
            {
                let stride = 1;
                while (this.hasCell(startX, startY + stride))
                {
                    verticalBox.expandDown(this.getCell(startX, startY + stride), getBoardAtPoint(startX, startY + stride))
                    stride += 1;
                }
                stride = 1;
                while (this.hasCell(startX, startY - stride))
                {
                    verticalBox.expandUp(this.getCell(startX, startY - stride), getBoardAtPoint(startX, startY - stride))
                    stride += 1;
                }
                if (verticalBox.area() > 1 && draw)
                {
                    this.canvasContext.font = `${0.5 * zoom}px ${font}`
                    this.canvasContext.fillStyle = "#000000"
                    this.canvasContext.textBaseline = "bottom"
                    this.canvasContext.textAlign = "left"
                    this.canvasContext.fillText(verticalBox.getPoints(), (this.offsetX + verticalBox.x) * zoom, (this.offsetY + verticalBox.y) * zoom)
                    this.drawBox(verticalBox)
                }
            }
            if (doX)
            {
                let stride = 1;
                while (this.hasCell(startX + stride, startY))
                {
                    horizontalBox.expandRight(this.getCell(startX + stride, startY), getBoardAtPoint(startX + stride, startY))
                    stride += 1;
                }
                stride = 1;
                while (this.hasCell(startX - stride, startY))
                {
                    horizontalBox.expandLeft(this.getCell(startX - stride, startY), getBoardAtPoint(startX - stride, startY))
                    stride += 1;
                }
                if (horizontalBox.area() > 1 && draw)
                {
                    this.canvasContext.font = `${0.5 * zoom}px ${font}`
                    this.canvasContext.fillStyle = "#000000"
                    this.canvasContext.textAlign = "right"
                    this.canvasContext.textBaseline = "top"
                    this.canvasContext.fillText(horizontalBox.getPoints(), (this.offsetX + horizontalBox.x) * zoom, (this.offsetY + horizontalBox.y) * zoom)
                    this.drawBox(horizontalBox)
                }
            }
        }
        if (doX && doY)
        {
            return {
                verticalBox,
                horizontalBox
            }
        } else if (doX)
        {
            return {
                horizontalBox
            }
        } else
        {
            return {
                verticalBox
            }
        }

    }
    /**
     * Check the point value a set of cells will get when placed on the board
     * @param {CellPlacement[]} tilePlacements 
     * @returns {WordPointBox[]}
     */
    checkPointsForPlacement(tilePlacements)
    {
        let boxes = []
        let col = undefined;
        let row = undefined;
        let rowOrCol = "U"
        for (let cell of tilePlacements)
        {
            Object.setPrototypeOf(cell, CellPlacement.prototype)
            if (row == cell.x && rowOrCol == "U") rowOrCol = "R"
            if (col == cell.y && rowOrCol == "U") rowOrCol = "C"
            if (row != cell.x && rowOrCol == "R") return -1;
            if (col != cell.y && rowOrCol == "C") return -1;
            if (col == undefined) col = cell.y;
            if (row == undefined) row = cell.x;

            cell.setReplacement(this.getCell(cell.x, cell.y));
            this.setCell(cell.x, cell.y, cell);
        }
        let first = true
        for (let cell of tilePlacements)
        {
            let theBoxes = this.drawWordBoxes(cell.x, cell.y, false, rowOrCol != "C" || first, rowOrCol != "R" || first)
            first = false
            boxes.push(...Object.values(theBoxes))
        }
        for (let cell of tilePlacements)
        {
            if (cell.oldCell) this.setCell(cell.x, cell.y, cell.oldCell);
            else this.deleteCell(cell.x, cell.y)
        }
        return boxes.filter(box => box.area() > 1)
    }
    /**
     * Gets the hovered tile
     * @returns The x and y coordinate of the cursor, in tilespace
     */
    getHovered()
    {
        if (this.highlightedBox.type != "tilesquare") return {}
        return {
            x: this.highlightedBox.x / zoom,
            y: this.highlightedBox.y / zoom
        }
    }
    /**
     * Gets the next highest scoring placing of tiles
     * @returns 
     */
    placeNextTopScore()
    {
        if (this.topScoringPredictions.length == 0) return
        this.topScoringIndex += 1;
        this.topScoringIndex %= this.topScoringPredictions.length
        this.placedTiles.clear()
        let total = 0;
        let xTotal = 0;
        let yTotal = 0;
        this.topScoringPredictions[this.topScoringIndex].word.forEach(/**@param{CellPlacement}letter*/(letter) =>
        {
            total++;
            xTotal += letter.x;
            yTotal += letter.y;
            return this.setTile(letter.x, letter.y, letter)
        })
        this.easeTo(
            Math.floor(-xTotal / total + this.width / 2),
            Math.floor(-yTotal / total + this.height / 2),
            1000
        )
        console.log(Math.floor(this.topScoringPredictions[this.topScoringIndex].points), this.topScoringPredictions[this.topScoringIndex].wdStr)
    }
    firstMove = true;
    topScoringPredictions = []
    topScoringIndex = 0;
    progress = {
        current: 0,
        total: 0,
        best: 0,
        shouldStop: false
    }
    /**
     * Finds the best moves and moves it to the `topScoringPredictions` field
     */
    async findBestMove()
    {
        this.topScoringPredictions = []
        this.topScoringIndex = 0
        this.progress.current = 0
        this.progress.best = 0
        this.progress.shouldStop = false
        if (this.firstMove)
        {
            let checkPointsForPlacement = this.checkPointsForPlacement.bind(this);
            let board = this;
            let center = this.center;
            board.progress.current = 0;
            /**
             * 
             * @param {String} hand 
             * @param {number} x 
             * @param {number} y 
             * @param {CellPlacement[]} stack 
             */
            function checkNext(hand, x, y, stack, legal, direction)
            {
                board.progress.current++;
                if (hand != "")
                {
                    let nextLegal = legal;
                    if (x == center.x && y == center.y) nextLegal = true
                    for (let index = 0; index < hand.length; index++)
                    {
                        let letter = hand[index];
                        if (!anyWordsStartWith(stack.map(v => v.letter).join("") + letter)) continue;
                        let newHand = hand.replace(letter, "")
                        let newCell = new CellPlacement(x, y, letter, false, board)
                        stack.push(newCell)
                        checkNext(newHand, x + direction.x, y + direction.y, stack, nextLegal, direction)
                        stack.pop()
                    }
                }
                if (!legal) return;
                let word = stack.map(a => a.letter).join("")
                if (!isValidWord(word)) return;
                let shouldDouble = hand.length == 0 && board.hand.length == 7;
                if (word.includes("?"))
                {

                    let wildPlaces = word.split("").map((a, i) =>
                    {
                        if (a == "?") return i;
                        return -1
                    }).filter(a => a >= 0)
                    let options = getMysteryLetterOptions(word)
                    let oldParts = []
                    for (let wildPlace of wildPlaces)
                    {
                        oldParts[wildPlace] = stack[wildPlace]
                    }
                    for (let option of options)
                    {
                        for (let optionPart in option)
                        {
                            let oldPart = oldParts[wildPlaces[optionPart]]
                            stack[wildPlaces[optionPart]] = new CellPlacement(oldPart.x, oldPart.y, option[optionPart], true, board)
                        }
                        let points = checkPointsForPlacement(stack)
                        if (points.length == 0) return;
                        let pts = points[0].getPoints();
                        board.topScoringPredictions.push({
                            points: (shouldDouble ? pts : 0) + pts + Math.random() / 5,
                            word: [...stack],
                            wdStr: stack.map(cell => cell.letter).join("")
                        })
                        if (board.progress.best < (shouldDouble ? pts : 0) + pts)
                        {
                            board.progress.best = (shouldDouble ? pts : 0) + pts
                        }
                    }
                    for (let wildPlace of wildPlaces)
                    {
                        stack[wildPlace] = oldParts[wildPlace]
                    }
                } else
                {
                    let points = checkPointsForPlacement(stack)
                    if (points.length == 0) return;
                    let pts = points[0].getPoints();
                    board.topScoringPredictions.push({
                        points: (shouldDouble ? pts : 0) + pts + Math.random() / 5,
                        word: [...stack],
                        wdStr: word
                    })
                    if (board.progress.best < (shouldDouble ? pts : 0) + pts)
                    {
                        board.progress.best = (shouldDouble ? pts : 0) + pts
                    }
                }
            }

            for (let offset = -6; offset <= 0; offset++)
            {
                checkNext(this.hand.join(""), center.x + offset, center.y, [], offset == 0, { x: 1, y: 0 })
                checkNext(this.hand.join(""), center.x, center.y + offset, [], offset == 0, { x: 0, y: 1 })
            }
            /** @type {WordPointBox} */
            // this.topScoringPredictions.sort((a, b) => b.points - a.points)
            // if (this.topScoringPredictions[0])
            // {
            //     this.placedTiles.clear()
            //     this.topScoringPredictions[0].word.forEach(/**@param{CellPlacement}letter*/(letter) => this.setTile(letter.x, letter.y, letter))
            //     this.hand = []
            //     this.offsetX = Math.floor(this.width / 2);
            //     this.offsetY = Math.floor(this.height / 2);
            //     console.log(Math.floor(this.topScoringPredictions[0].points), this.topScoringPredictions[0].wdStr)
            // }
        } else
        {
            let checkPointsForPlacement = this.checkPointsForPlacement.bind(this);
            let board = this;
            let startingHand = this.hand.join("")
            board.progress.current = 0;
            /**
             * 
             * @param {String} hand 
             * @param {number} x 
             * @param {number} y 
             * @param {CellPlacement[]} stack 
             * @returns {boolean} shouldCullFurtherChildren
             */
            function checkNext(hand, x, y, stack, legal, direction)
            {
                if (board.progress.shouldStop) return;
                board.progress.current++;
                let hasBefore = board.hasCell(x - direction.x, y - direction.y)
                if (hasBefore && !stack.find(Cell.equals(x - direction.x, y - direction.y)))
                {
                    return;
                }
                let alreadyFilled = board.hasCell(x, y)
                let hasNext = board.hasCell(x + direction.x, y + direction.y);

                if (alreadyFilled)
                {
                    let word = stack.map(a => a.letter).join("") + board.getCell(x, y).letter;
                    if (!anyWordsStartWith(word)) return;
                    stack.push(new NotACell(x, y, board.getCell(x, y).letter))
                    checkNext(hand, x + direction.x, y + direction.y, stack, true, direction)
                    stack.pop()
                } else
                {
                    for (let index = 0; index < hand.length; index++)
                    {
                        let letter = hand[index];
                        if (!anyWordsStartWith(stack.map(v => v.letter).join("") + letter)) continue;
                        let hasFilledSide = board.hasCell(x - direction.y, y - direction.x);
                        let hasFilledOtherside = board.hasCell(x + direction.y, y + direction.x);
                        let newHand = hand.replace(letter, "")
                        let newCell = new CellPlacement(x, y, letter, false, board)
                        stack.push(newCell)
                        checkNext(newHand, x + direction.x, y + direction.y, stack, legal || hasFilledSide || hasFilledOtherside, direction)
                        stack.pop()
                    }
                }

                if (startingHand == hand || hasNext || !legal) return;
                let word = stack.map(a => a.letter).join("");
                if (!isValidWord(word)) return;

                let shouldDouble = hand.length == 0 && board.hand.length == 7;
                if (word.includes("?"))
                {
                    let wildPlaces = word.split("").map((a, i) =>
                    {
                        if (a == "?") return i;
                        return -1
                    }).filter(a => a >= 0)
                    let options = getMysteryLetterOptions(word)
                    let oldParts = []
                    for (let wildPlace of wildPlaces)
                    {
                        oldParts[wildPlace] = stack[wildPlace]
                    }
                    for (let option of options)
                    {
                        for (let optionPart in option)
                        {
                            let oldPart = oldParts[wildPlaces[optionPart]]
                            stack[wildPlaces[optionPart]] = new CellPlacement(oldPart.x, oldPart.y, option[optionPart], true, board)
                        }
                        let onlyPlaceables = stack.filter(a => a instanceof CellPlacement);
                        let points = checkPointsForPlacement(onlyPlaceables)
                        if (points.length == 0) return;
                        if (points.find(v => v.getPoints() == -1)) return;

                        let pts = points.reduce(function (prev, current, index)
                        {
                            let pts = current.getPoints()
                            if (pts == -1 || prev == -1) return -1;
                            if (current.containingLetters.length == 7 && shouldDouble) pts = pts + pts;
                            return prev + pts;
                        }, 0)
                        board.topScoringPredictions.push({
                            points: pts + Math.random() / 5,
                            word: [...onlyPlaceables],
                            wdStr: stack.map(cell => cell.letter).join("")
                        })
                        if (board.progress.best < pts)
                        {
                            board.progress.best = pts
                        }
                    }
                    for (let wildPlace of wildPlaces)
                    {
                        stack[wildPlace] = oldParts[wildPlace]
                    }
                } else
                {
                    let onlyPlaceables = stack.filter(a => a instanceof CellPlacement);
                    let points = checkPointsForPlacement(onlyPlaceables)
                    if (points.length == 0) return;
                    if (points.find(v => v.getPoints() == -1)) return;

                    let pts = points.reduce(/**@param {WordPointBox} current */function (prev, current, index)
                    {
                        let pts = current.getPoints()
                        if (pts == -1 || prev == -1) return -1;
                        if (current.containingLetters.filter(a => a.isTemp).length == 7 && shouldDouble) pts = pts + pts;
                        return prev + pts;
                    }, 0)
                    board.topScoringPredictions.push({
                        points: pts + Math.random() / 5,
                        word: [...onlyPlaceables],
                        wdStr: word
                    })
                    if (board.progress.best < pts)
                    {
                        board.progress.best = pts
                    }
                }


            }
            function checkCollision(depth, x, y, direction)
            {
                for (let i = 0; i < depth; i++)
                {
                    let testX = x + direction.x * i;
                    let testY = y + direction.y * i;
                    let hasBelow = board.hasCell(testX, testY + 1);
                    let hasLeft = board.hasCell(testX - 1, testY);
                    let hasRight = board.hasCell(testX + 1, testY);
                    let hasAbove = board.hasCell(testX, testY - 1);
                    if (hasBelow || hasLeft || hasRight || hasAbove) return true;
                }
                return false;
            }

            for (let x = this.minX - 8; x < this.maxX - this.minX + 8; x++)
            {
                for (let y = this.minY - 8; y < this.maxY - this.minY + 8; y++)
                {
                    let hasBelow = this.hasCell(x, y + 1);
                    let hasLeft = this.hasCell(x - 1, y);
                    let hasRight = this.hasCell(x + 1, y);
                    let hasAbove = this.hasCell(x, y - 1);
                    let legal = hasBelow || hasLeft || hasRight || hasAbove;
                    if (checkCollision(7, x, y, { x: 1, y: 0 })) checkNext(this.hand.join(""), x, y, [], legal, { x: 1, y: 0 })
                    if (checkCollision(7, x, y, { x: 0, y: 1 })) checkNext(this.hand.join(""), x, y, [], legal, { x: 0, y: 1 })
                }
            }
            /** @type {WordPointBox} */
        }
        this.showTempwords = true
        clearCaches()
    }
    solving = false
    async findBestMoveAsync() {
        if (this.solving) return
        this.solving = true
        window.WORKER_THREAD.postMessage({
            type: "solveAsync",
            board: this.toJSON()
        })
        awaitResponse(({solutions})=>{
            this.topScoringPredictions = solutions
            this.topScoringPredictions.sort((a, b) => b.points - a.points)
            if (this.topScoringPredictions[0])
            {
                this.placedTiles.clear()
                let total = 0;
                let xTotal = 0;
                let yTotal = 0;
                this.topScoringPredictions[0].word.forEach(/**@param{CellPlacement}letter*/(letter) =>
                {
                    total++;
                    xTotal += letter.x;
                    yTotal += letter.y;
                    return this.setTile(letter.x, letter.y, letter)
                })
                this.easeTo(
                    Math.floor(-xTotal / total + this.width / 2),
                    Math.floor(-yTotal / total + this.height / 2),
                    1000
                )
                this.hand = []
                console.log(this.topScoringPredictions[0].points, this.topScoringPredictions[0].wdStr)
            }
            this.solving = false
        })
    }
    easeTo(newX, newY, duration = 500)
    {
        this.endX = newX;
        this.endY = newY;
        this.startX = this.offsetX;
        this.startY = this.offsetY;
        this.t = 0;
        this.doEasing = true;
        this.easeDuration = duration
    }
    /**
     * 
     * @param {*} object 
     * @returns {LetterLeagueBoard}
     */
    static fromJSON(object) {
        let place = new LetterLeagueBoard()
        place.placedLetters = object.placedLetters
        place.hand = object.hand
        place.firstMove = object.firstMove
        return place
    }
    toJSON() {
        return {
            placedLetters: this.placedLetters,
            hand: this.hand,
            firstMove: this.firstMove
        }
    }
}

let handler = ()=>{}

function awaitResponse(func, id) {
    handler = func
}



if (globalThis.window) {

    window.CellPlacement = CellPlacement

    window.WORKER_THREAD = new Worker("js/letterleagueworker.js", {type: "module"})

    window.WORKER_THREAD.onmessage = function (message) {
        // console.log(message)
        handler(message.data)
        handler = () => {}
    }
}
