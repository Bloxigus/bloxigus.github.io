const RAW_BOARD = [
    `___B__B_B__B___B__B_B__B___`,
    `_B___G___G___B___G___G___B_`,
    `____B_Y_Y_B_____B_Y_Y_B____`,
    `BGB____R____BGB____R____BGB`,
    `____B_Y_Y_B_____B_Y_Y_B____`,
    `_B___G___G___B___G___G___B_`,
    `___B__B_B__B___B__B_B__B___`,
    `____G_____G_____G_____G____`,
    `Y_Y____B____Y_Y____B____Y_Y`,
    `___G___G___G_S_G___G___G___`,// middle
    `Y_Y____B____Y_Y____B____Y_Y`,
    `____G_____G_____G_____G____`,
    `___B__B_B__B___B__B_B__B___`,
    `_B___G___G___B___G___G___B_`,
    `____B_Y_Y_B_____B_Y_Y_B____`,
    `BGB____R____BGB____R____BGB`,
    `____B_Y_Y_B_____B_Y_Y_B____`,
    `_B___G___G___B___G___G___B_`,
    `___B__B_B__B___B__B_B__B___`,
]
const RAW_LARGE_BOARD = [
    `G___B___G___G___B___G___G___B___G`,
    `__B___B__B_B__B___B__B_B__B___B__`,
    `_G_____G_____G_____G_____G_____G_`,
    `___Y_Y____B____Y_Y____B____Y_Y___`,
    `__G___G___G___G___G___G___G___G__`,
    `___Y_Y____B____Y_Y____B____Y_Y___`,
    `_G_____G_____G_____G_____G_____G_`,
    `__B___B__B_B__B___B__B_B__B___B__`,
    `G___B___G___G___B___G___G___B___G`,
    `_B_____B_Y_Y_B_____B_Y_Y_B_____B_`,
    `___BGB____R____BGB____R____BGB___`,
    `_B_____B_Y_Y_B_____B_Y_Y_B_____B_`,
    `G___B___G___G___B___G___G___B___G`,
    `__B___B__B_B__B___B__B_B__B___B__`,
    `_G_____G_____G_____G_____G_____G_`,
    `___Y_Y____B____Y_Y____B____Y_Y___`,
    `__G___G___G___G_S_G___G___G___G__`,// middle
    `___Y_Y____B____Y_Y____B____Y_Y___`,
    `_G_____G_____G_____G_____G_____G_`,
    `__B___B__B_B__B___B__B_B__B___B__`,
    `G___B___G___G___B___G___G___B___G`,
    `_B_____B_Y_Y_B_____B_Y_Y_B_____B_`,
    `___BGB____R____BGB____R____BGB___`,
    `_B_____B_Y_Y_B_____B_Y_Y_B_____B_`,
    `G___B___G___G___B___G___G___B___G`,
    `__B___B__B_B__B___B__B_B__B___B__`,
    `_G_____G_____G_____G_____G_____G_`,
    `___Y_Y____B____Y_Y____B____Y_Y___`,
    `__G___G___G___G___G___G___G___G__`,
    `___Y_Y____B____Y_Y____B____Y_Y___`,
    `_G_____G_____G_____G_____G_____G_`,
    `__B___B__B_B__B___B__B_B__B___B__`,
    `G___B___G___G___B___G___G___B___G`,
]
const zoom = 40;
import { isValidWord, WORDS_BY_LENGTH, anyWordsStartWith, getMysteryLetterOptions ,clearCaches } from "./wordvalidator.js";
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
        // this.containingLetters.reduce((prev, letter) => {
        //     return prev + letter.value
        // }, 0)
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
            // console.log(wordMultiplier, letterMultiplier, points)
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
}
class WordFillBox extends Box
{
    words = []
    constructor(x, y, width, height,)
    {
        super(x, y, width, height)
    }
    init(letters, hand)
    {
        this.hand = makeHand(hand);
        if (this.width == 1 || this.height == 1)
        {
            // console.log(this.hand)
            this.words = WORDS_BY_LENGTH[this.width * this.height] || []
            this.words = this.words.filter(possibleWord =>
            {
                let tempHand = { ...this.hand }
                for (let letterIndex in possibleWord)
                {
                    if (letters[letterIndex] != "?" && letters[letterIndex] == possibleWord[letterIndex]) continue;
                    if (letters[letterIndex] == "?" && tempHand[possibleWord[letterIndex]] > 0)
                    {
                        tempHand[possibleWord[letterIndex]] -= 1;
                        continue
                    } else if (letters[letterIndex] == "?" && tempHand["?"] > 0)
                    {
                        tempHand["?"] -= 1;
                        continue;
                    }
                    return false;
                }
                return true;
            })
        }
    }
}

function makeHand(handArray)
{
    let hand = {};
    for (let letter of handArray)
    {
        hand[letter] = (hand[letter] ?? 0) + 1
    }
    return hand;
}
window.WordFillBox = WordFillBox
class Cell
{
    static equals(x, y) {
        return function (cell2) {
            if (x == cell2.x && y && cell2.y) return true;
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
        this.baseMultiplier = board.placedLetters[x][y].baseMultiplier;
        this.baseWordMultiplier = board.placedLetters[x][y].baseWordMultiplier;
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
    placedLetters;
    mouseX = -1
    mouseY = -1
    bigBoard = false
    center = { x: 0, y: 0 }
    /**
     * 
     * @param {CanvasRenderingContext2D} canvasContext 
     */
    init(canvasContext, bigBoard = false)
    {
        this.bigBoard = bigBoard
        this.placedLetters = new Array((this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0].length).fill().map(() => new Array((this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length || 0).fill().map(() => new Cell()))
        for (let x in this.placedLetters)
        {
            for (let y in this.placedLetters[x])
            {
                this.placedLetters[x][y].baseMultiplier = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[y][x] == "Y" ? 3 : (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[y][x] == "B" ? 2 : 1
                this.placedLetters[x][y].baseWordMultiplier = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[y][x] == "R" ? 3 : (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[y][x] == "G" ? 2 : 1
                if ((this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[y][x] == "S")
                {
                    this.center = { x: x * 1, y: y * 1 }
                }
            }
        }
        let width = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0]?.length || 0;
        this.canvasContext = canvasContext;
        this.buttons.push(new Button(
            width * zoom + zoom / 2,
            zoom / 2,
            9 * zoom,
            zoom,
            "Toggle Wild",
            this.toggleWild.bind(this)
        ))
        this.buttons.push(new Button(
            width * zoom + zoom / 2,
            zoom / 2 + zoom * 2,
            9 * zoom,
            zoom,
            "Next Best Option",
            this.placeNextTopScore.bind(this)
        ))
        this.buttons.push(new Button(
            width * zoom + zoom / 2,
            zoom / 2 + zoom * 4,
            9 * zoom,
            zoom,
            "Reset",
            () => {
                window.board = new LetterLeagueBoard()
                window.board.init(canvasContext, bigBoard)
            }
        ))
    }
    pointLog = []
    render()
    {
        let canvasContext = this.canvasContext;
        let height = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length;
        let width = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0]?.length || 0;
        let rect = this.canvasContext.canvas.getBoundingClientRect();
        canvasContext.canvas.width = width * zoom + 10 * zoom
        canvasContext.canvas.height = height * zoom + 3 * zoom
        for (let row in (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD))
        {
            for (let column in (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[row])
            {
                let background = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[row][column]
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
                canvasContext.fillRect(column * zoom, row * zoom, zoom, zoom)
                canvasContext.strokeStyle = "#fff6e1"
                canvasContext.strokeRect(column * zoom, row * zoom, zoom, zoom)
            }
        }
        canvasContext.strokeStyle = "#7F7F7F"
        let relativeX = (this.mouseX - rect.left);
        let relativeY = (this.mouseY - rect.top);
        let insideX = Math.floor((this.mouseX - rect.left) / zoom) * zoom;
        let insideY = Math.floor((this.mouseY - rect.top) / zoom) * zoom;
        if (insideX > width * zoom - zoom || insideX < 0 || insideY > height * zoom - zoom || insideY < 0)
        {
            this.hoveredBox = { type: "none" };
        } else
        {
            canvasContext.strokeRect(insideX, insideY, zoom, zoom)
            this.hoveredBox = { x: insideX, y: insideY, type: "tilesquare" }
        }
        if (this.highlightedBox.type == "tilesquare")
        {
            canvasContext.strokeStyle = "#000000"
            canvasContext.strokeRect(this.highlightedBox.x, this.highlightedBox.y, zoom, zoom)
        }
        canvasContext.fillStyle = "#000000"
        canvasContext.font = `${zoom}px ${font}`
        canvasContext.textAlign = "center"
        canvasContext.textBaseline = "middle"
        for (let x in this.placedLetters)
        {
            for (let y in this.placedLetters[x])
            {
                canvasContext.fillStyle = "#000000"
                if (this.placedTiles[x + ":" + y] && this.placedTiles[x + ":" + y].isWild) canvasContext.fillStyle = "#0000FF"
                else if (this.placedLetters[x][y].isWild) canvasContext.fillStyle = "#0000FF"

                canvasContext.font = `${0.875 * zoom}px ${font}`
                canvasContext.textAlign = "center"
                canvasContext.textBaseline = "middle"
                if (!this.placedTiles[x + ":" + y]) canvasContext.fillText(this.placedLetters[x][y].letter.toLowerCase(), x * zoom + (0.5 * zoom), y * zoom + (0.5 * zoom))
                else canvasContext.fillText(this.placedTiles[x + ":" + y].letter.toLowerCase(), x * zoom + (0.5 * zoom), y * zoom + (0.5 * zoom))
                if (this.placedTiles[x + ":" + y] && this.showTempwords) {
                    canvasContext.strokeStyle = "#FF0000"
                    canvasContext.strokeRect(x * zoom, y * zoom, zoom, zoom)
                }
                canvasContext.fillStyle = "#1F1F1F"

                canvasContext.font = `${0.5 * zoom}px ${font}`
                canvasContext.textAlign = "right"
                canvasContext.textBaseline = "top"
                if (this.placedLetters[x][y].value != -1 && this.placedLetters[x][y].letter != "")
                {
                    canvasContext.fillText((this.placedLetters[x][y].value), x * zoom + (zoom), y * zoom)
                }

            }
        }
        canvasContext.fillStyle = "#F0F0F0"
        canvasContext.fillRect(width * (0.5 * zoom) - 7 * zoom, height * zoom + Math.floor(0.5 * zoom), 7 * 2 * zoom, 2 * zoom)
        for (let handTile in this.hand)
        {
            canvasContext.textBaseline = "middle"
            canvasContext.fillStyle = "#E0E0E0"
            canvasContext.fillRect(width * (0.5 * zoom) - 7 * zoom + 2 * zoom * handTile, height * zoom + Math.floor(0.5 * zoom), 2 * zoom, 2 * zoom)
            this.canvasContext.textAlign = "center"
            canvasContext.font = `${2 * zoom}px ${font}`
            canvasContext.fillStyle = "black"
            canvasContext.fillText(this.hand[handTile].toLowerCase(), width * (0.5 * zoom) - 7 * zoom + 2 * zoom * handTile + zoom, height * zoom + Math.floor(0.5 * zoom) + zoom)
        }

        if (relativeY > height * zoom + Math.floor(0.5 * zoom) && relativeY < height * zoom + 2 * zoom + Math.ceil(0.5 * zoom))
        {
            canvasContext.strokeStyle = "#7F7F7F"
            canvasContext.strokeRect(width * (0.5 * zoom) - 7 * zoom, height * zoom + Math.floor(0.5 * zoom), 7 * 2 * zoom, 2 * zoom)
            this.hoveredBox = { type: "hand" }
        }
        if (this.highlightedBox.type == "hand")
        {
            canvasContext.strokeStyle = "#000000"
            canvasContext.strokeRect(width * (0.5 * zoom) - 7 * zoom, height * zoom + Math.floor(0.5 * zoom), 7 * 2 * zoom, 2 * zoom)
        }
        if (this.topScoringPredictions.length != 0)
        {
            let value = Math.floor(this.topScoringPredictions[this.topScoringIndex].points)
            this.canvasContext.fillStyle = "#000000"
            this.canvasContext.textAlign = "left"
            canvasContext.font = `${0.5 * zoom}px ${font}`
            canvasContext.textBaseline = "middle"
            this.canvasContext.fillText(`Value: ${value}`, zoom, height * zoom + Math.floor(0.5 * zoom) + zoom)
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
    placedTiles = {};
    highlightedBox = { type: "none" };
    hoveredBox = { type: "none" };
    onClick()
    {
        let canvasContext = this.canvasContext;
        let height = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length;
        let width = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0]?.length || 0;
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
    }
    toggleWild()
    {
        let hovered = this.getHovered();
        if (hovered.x)
        {
            if (this.placedTiles[hovered.x + ":" + hovered.y]) {
                this.placedTiles[hovered.x + ":" + hovered.y].isWild = !this.placedTiles[hovered.x + ":" + hovered.y].isWild;
            } else {
                this.placedLetters[hovered.x][hovered.y].isWild = !this.placedLetters[hovered.x][hovered.y].isWild;
            }
        }
    }
    showTempwords = false
    onKeyboard(key)
    {
        let height = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length;
        let width = (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0]?.length || 0;
        if (this.highlightedBox.type == "tilesquare")
        {
            this.showTempwords = false
            let x = this.highlightedBox.x / zoom;
            let y = this.highlightedBox.y / zoom;
            if (key.length == 1)
            {
                if ("abcdefghijklmnopqrstuvwxyz?*".includes(key)) {
                    if (this.placedLetters[x][y].letter == "")
                    {
                        let placement = new CellPlacement(x, y, key.toLowerCase(), false, this)
                        this.placedTiles[x + ":" + y] = placement;
                    }
                }
            } else if (key == "ArrowDown" && this.highlightedBox.y < height * zoom - zoom)
            {
                this.highlightedBox.y += zoom
            } else if (key == "ArrowUp" && this.highlightedBox.y >= zoom)
            {
                this.highlightedBox.y -= zoom
            } else if (key == "ArrowRight" && this.highlightedBox.x < width * zoom - zoom)
            {
                this.highlightedBox.x += zoom
            } else if (key == "ArrowLeft" && this.highlightedBox.x >= zoom)
            {
                this.highlightedBox.x -= zoom
            } else if (key == "Backspace")
            {
                delete this.placedTiles[x + ":" + y]
            } else if (key == "Enter")
            {
                if (Object.keys(this.placedTiles).length != 0)
                {
                    let wordBox = new WordPointBox(0, 0, 0, 0, "#", "#")
                    let points = this.checkPointsForPlacement(Object.values(this.placedTiles))
                    if (points == -1)
                    {
                        this.placedTiles = {}
                        return;
                    }

                    if (points.find(value => !isValidWord(value.word)))
                    {
                        this.placedTiles = {}
                    } else
                    {
                        for (let tile of Object.values(this.placedTiles))
                        {
                            wordBox.addLetter(tile)
                            tile.isTemp = false;
                            this.placedLetters[tile.x][tile.y] = tile
                        }
                        this.pointLog.push(`${points.reduce((prev, curr) => prev + curr.getPoints(), 0)}: ${points.map(point => `${point.word.toUpperCase()}: ${point.getPoints()}`).join(", ")}`)
                        this.placedTiles = {}
                        points.forEach(wpb => wpb.updateLetters())
                        this.firstMove = false
                        this.topScoringPredictions = []
                    }

                }
            }
        } else if (this.highlightedBox.type == "hand")
        {
            if (key.length == 1 && this.hand.length < 7)
            {
                if ("abcdefghijklmnopqrstuvwxyz?*".includes(key)) {
                    if (key == "*") key = "?";
                    this.hand.push(key.toLowerCase());
                }
            } else if (key == "Backspace")
            {
                this.hand.length = Math.max(this.hand.length - 1, 0)
            } else if (key == "Enter")
            {
                console.log(`Running Solver ...`)
                this.findBestMove()
            }
        } else {
            if (key == "Enter")
                {
                    if (Object.keys(this.placedTiles).length != 0)
                    {
                        let wordBox = new WordPointBox(0, 0, 0, 0, "#", "#")
                        let points = this.checkPointsForPlacement(Object.values(this.placedTiles))
                        if (points == -1)
                        {
                            this.placedTiles = {}
                            return;
                        }
    
                        if (points.find(value => !isValidWord(value.word)))
                        {
                            this.placedTiles = {}
                        } else
                        {
                            for (let tile of Object.values(this.placedTiles))
                            {
                                wordBox.addLetter(tile)
                                tile.isTemp = false;
                                this.placedLetters[tile.x][tile.y] = tile
                            }
                            this.pointLog.push(`${points.reduce((prev, curr) => prev + curr.getPoints(), 0)}: ${points.map(point => `${point.word.toUpperCase()}: ${point.getPoints()}`).join(", ")}`)
                            this.placedTiles = {}
                            points.forEach(wpb => wpb.updateLetters())
                            this.firstMove = false
                            this.topScoringPredictions = []
                        }
    
                    }
                }
        }
    }
    /**
     * @param {Box} box 
     */
    drawBox(box)
    {
        let canvasContext = this.canvasContext;
        canvasContext.fillStyle = box.fill
        canvasContext.strokeStyle = box.stroke
        if (box.fill)
        {
            canvasContext.fillRect(box.x * zoom, box.y * zoom, box.width * zoom, box.height * zoom)
        }
        if (box.stroke)
        {
            canvasContext.strokeRect(box.x * zoom, box.y * zoom, box.width * zoom, box.height * zoom)
        }
    }
    drawWordBoxes(startX, startY, draw = true, doX = true, doY = true)
    {
        this.canvasContext.font = `${0.25 * zoom}px ${font}`
        if (this.placedLetters[startX][startY].letter == "") return {};
        let verticalBox = new WordPointBox(startX, startY, 1, 1, this.placedLetters[startX][startY], (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[startY][startX]);
        let horizontalBox = new WordPointBox(startX, startY, 1, 1, this.placedLetters[startX][startY], (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[startY][startX]);
        if (this.placedLetters[startX][startY].letter != "")
        {
            if (doY)
            {
                let stride = 1;
                while (this.placedLetters[0].length > startY + stride && this.placedLetters[startX][startY + stride].letter != "")
                {
                    verticalBox.expandDown(this.placedLetters[startX][startY + stride], (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[startY + stride][startX])
                    stride += 1;
                }
                stride = 1;
                while (0 <= startY - stride && this.placedLetters[startX][startY - stride].letter != "")
                {
                    verticalBox.expandUp(this.placedLetters[startX][startY - stride], (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[startY - stride][startX])
                    stride += 1;
                }
                if (verticalBox.area() > 1 && draw)
                {
                    this.canvasContext.fillStyle = "#000000"
                    this.canvasContext.textAlign = "left"
                    this.canvasContext.textBaseline = "top"
                    this.canvasContext.fillText(verticalBox.getPoints(), verticalBox.x * zoom, verticalBox.y * zoom)
                    this.drawBox(verticalBox)
                }
            }
            if (doX)
            {
                let stride = 1;
                while (this.placedLetters.length > startX + stride && this.placedLetters[startX + stride][startY].letter != "")
                {
                    horizontalBox.expandRight(this.placedLetters[startX + stride][startY], (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[startY][startX + stride])
                    stride += 1;
                }
                stride = 1;
                while (0 <= startX - stride && this.placedLetters[startX - stride][startY].letter != "")
                {
                    horizontalBox.expandLeft(this.placedLetters[startX - stride][startY], (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[startY][startX - stride])
                    stride += 1;
                }
                if (horizontalBox.area() > 1 && draw)
                {
                    this.canvasContext.fillStyle = "#000000"
                    this.canvasContext.textBaseline = "top"
                    this.canvasContext.textAlign = "left"
                    this.canvasContext.fillText(horizontalBox.getPoints(), horizontalBox.x * zoom, horizontalBox.y * zoom)
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
     * 
     * @param {CellPlacement[]} tilePlacements 
     * @returns {WordPointBox[]}
     */
    checkPointsForPlacement(tilePlacements)
    {
        let boxes = []
        let col = -1;
        let row = -1;
        let rowOrCol = "U"
        for (let cell of tilePlacements)
        {
            if (row == cell.x && rowOrCol == "U") rowOrCol = "R"
            if (col == cell.y && rowOrCol == "U") rowOrCol = "C"
            if (row != cell.x && rowOrCol == "R") return -1;
            if (col != cell.y && rowOrCol == "C") return -1;
            if (col == -1) col = cell.y;
            if (row == -1) row = cell.x;

            cell.setReplacement(this.placedLetters[cell.x][cell.y]);
            this.placedLetters[cell.x][cell.y] = cell;
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
            this.placedLetters[cell.x][cell.y] = cell.oldCell;
        }
        return boxes.filter(box => box.area() > 1)
    }
    getHovered()
    {
        if (this.highlightedBox.type != "tilesquare") return {}
        return {
            x: this.highlightedBox.x / zoom,
            y: this.highlightedBox.y / zoom
        }
    }
    placeNextTopScore()
    {
        if (this.topScoringPredictions.length == 0) return
        this.topScoringIndex += 1;
        this.topScoringIndex %= this.topScoringPredictions.length
        this.placedTiles = {}
        this.topScoringPredictions[this.topScoringIndex].word.forEach(/**@param{CellPlacement}letter*/(letter) => this.placedTiles[letter.x + ":" + letter.y] = letter)
        console.log(this.topScoringPredictions[this.topScoringIndex].points, this.topScoringPredictions[this.topScoringIndex].wdStr)
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
                if (board.progress.shouldStop) return;
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
                let shouldDouble = hand.length == 0;
                if (word.includes("?"))
                {
                    
                    let wildPlaces = word.split("").map((a, i) =>
                    {
                        if (a == "?") return i;
                        return -1
                    }).filter(a => a >= 0)
                    let options = getMysteryLetterOptions(word)
                    for (let option of options)
                    {
                        for (let optionPart in option)
                        {
                            stack[wildPlaces[optionPart]].letter = option[optionPart]
                            stack[wildPlaces[optionPart]].isWild = true
                        }
                        let points = checkPointsForPlacement(stack)
                        if (points.length == 0) return;
                        let pts = points[0].getPoints();
                        board.topScoringPredictions.push({
                            points: (shouldDouble?pts:0) + pts + Math.random() / 5,
                            word: [...stack],
                            wdStr: stack.map(cell => cell.letter).join("")
                        })
                        if (board.progress.best < (shouldDouble?pts:0) + pts) {
                            board.progress.best = (shouldDouble?pts:0) + pts
                        }
                    }
                    for (let wildPlace of wildPlaces)
                    {
                        stack[wildPlace].letter = "?"
                    }
                } else
                {
                    let points = checkPointsForPlacement(stack)
                    if (points.length == 0) return;
                    let pts = points[0].getPoints();
                    board.topScoringPredictions.push({
                        points: (shouldDouble?pts:0) + pts + Math.random() / 5,
                        word: [...stack],
                        wdStr: word
                    })
                    if (board.progress.best < (shouldDouble?pts:0) + pts) {
                        board.progress.best = (shouldDouble?pts:0) + pts
                    }
                }
            }

            for (let offset = -6; offset <= 0; offset++)
            {
                checkNext(this.hand.join(""), center.x + offset, center.y, [], offset == 0, { x: 1, y: 0 })
                checkNext(this.hand.join(""), center.x, center.y + offset, [], offset == 0, { x: 0, y: 1 })
            }
            /** @type {WordPointBox} */
            this.topScoringPredictions.sort((a, b) => b.points - a.points)
            if (this.topScoringPredictions[0])
            {
                this.placedTiles = {}
                this.topScoringPredictions[0].word.forEach(/**@param{CellPlacement}letter*/(letter) => this.placedTiles[letter.x + ":" + letter.y] = letter)
                this.hand = []
                console.log(this.topScoringPredictions[0].points, this.topScoringPredictions[0].wdStr)
            }
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
                let hasBefore = x - direction.x > 0 && y - direction.y > 0
                let beforeAlreadyFilled = hasBefore && board.placedLetters[x - direction.x][y - direction.y].letter != ""
                if (beforeAlreadyFilled && !stack.find(Cell.equals(x - direction.x, y - direction.y)))
                {
                    return;
                }
                let alreadyFilled = board.placedLetters[x][y].letter != ""
                let hasNext = x + direction.x < board.placedLetters.length && y + direction.y < board.placedLetters[0].length;
                let nextAlreadyFilled = hasNext && board.placedLetters[x + direction.x][y + direction.y].letter != ""

                if (alreadyFilled)
                {
                    let word = stack.map(a => a.letter).join("") + board.placedLetters[x][y].letter;
                    if (!anyWordsStartWith(word)) return;
                    stack.push(new NotACell(x, y, board.placedLetters[x][y].letter))
                    checkNext(hand, x + direction.x, y + direction.y, stack, true, direction)
                    stack.pop()
                } else
                {
                    if (hasNext) for (let index = 0; index < hand.length; index++)
                    {
                        let letter = hand[index];
                        if (!anyWordsStartWith(stack.map(v => v.letter).join("") + letter)) continue;
                        let hasFilledSide = x - direction.y > 0 && y - direction.x > 0;
                        let alreadyFilledSide = hasFilledSide && board.placedLetters[x - direction.y][y - direction.x].letter != "";
                        let hasFilledOtherside = x + direction.y < board.placedLetters.length && y + direction.x < board.placedLetters[0].length;
                        let alreadyFilledOtherside = hasFilledOtherside && board.placedLetters[x + direction.y][y + direction.x].letter != "";
                        let newHand = hand.replace(letter, "")
                        let newCell = new CellPlacement(x, y, letter, false, board)
                        stack.push(newCell)
                        checkNext(newHand, x + direction.x, y + direction.y, stack, legal || alreadyFilledSide || alreadyFilledOtherside, direction)
                        stack.pop()
                    }
                }

                if (startingHand == hand || nextAlreadyFilled || !legal) return;
                let word = stack.map(a => a.letter).join("");
                if (!isValidWord(word)) return;
                
                let shouldDouble = hand.length == 0;
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
                            if (index == 1 && shouldDouble) pts = pts + pts;
                            return prev + pts;
                        }, 0)
                        board.topScoringPredictions.push({
                            points: pts + Math.random() / 5,
                            word: [...onlyPlaceables],
                            wdStr: stack.map(cell => cell.letter).join("")
                        })
                        if (board.progress.best < (shouldDouble?pts:0) + pts) {
                            board.progress.best = (shouldDouble?pts:0) + pts
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

                    let pts = points.reduce(function (prev, current, index)
                    {
                        let pts = current.getPoints()
                        if (pts == -1 || prev == -1) return -1;
                        if (index == 1 && shouldDouble) pts = pts + pts;
                        return prev + pts;
                    }, 0)
                    board.topScoringPredictions.push({
                        points: (shouldDouble?pts:0) + pts + Math.random() / 5,
                        word: [...onlyPlaceables],
                        wdStr: word
                    })
                    if (board.progress.best < (shouldDouble?pts:0) + pts) {
                        board.progress.best = (shouldDouble?pts:0) + pts
                    }
                }


            }
            function checkCollision(depth, x, y, direction) {
                for (let i = 0; i < depth; i++) {
                    let testX = x + direction.x * i;
                    let testY = y + direction.y * i;
                    if (testY == (board.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length) return false;
                    if (testX == (board.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0].length) return false;
                    let hasBelow = testY < (board.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length - 1;
                    let hasLeft = testX > 1;
                    let hasRight = testX < (board.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0].length - 1;
                    let hasAbove = testY > 1;
                    let belowHasLetter = hasBelow && board.placedLetters[testX][testY+1].letter != ""
                    let aboveHasLetter = hasAbove && board.placedLetters[testX][testY-1].letter != ""
                    let rightHasLetter = hasRight && board.placedLetters[testX+1][testY].letter != ""
                    let leftHasLetter = hasLeft && board.placedLetters[testX-1][testY].letter != "";
                    if (belowHasLetter || aboveHasLetter || leftHasLetter || rightHasLetter) return true;
                }
                return false;
            }

            for (let x = 0; x < (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0].length; x++)
            {
                for (let y = 0; y < (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length; y++)
                {
                    let hasBelow = y < (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length - 1;
                    let hasLeft = x > 1;
                    let hasRight = x < (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0].length - 1;
                    let hasAbove = y > 1;
                    let belowHasLetter = hasBelow && this.placedLetters[x][y+1].letter != ""
                    let aboveHasLetter = hasAbove && this.placedLetters[x][y-1].letter != ""
                    let rightHasLetter = hasRight && this.placedLetters[x+1][y].letter != ""
                    let leftHasLetter = hasLeft && this.placedLetters[x-1][y].letter != "";
                    let legal = belowHasLetter || aboveHasLetter || leftHasLetter || rightHasLetter;
                    if (x != (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD)[0].length - 1 && checkCollision(7, x, y, {x: 1, y: 0})) checkNext(this.hand.join(""), x, y, [], legal, { x: 1, y: 0 })
                    if (y != (this.bigBoard ? RAW_LARGE_BOARD : RAW_BOARD).length - 1 && checkCollision(7, x, y, {x: 0, y: 1})) checkNext(this.hand.join(""), x, y, [], legal, { x: 0, y: 1 })
                }
            }
            /** @type {WordPointBox} */
            this.topScoringPredictions.sort((a, b) => b.points - a.points)
            if (this.topScoringPredictions[0])
            {
                this.placedTiles = {}
                this.topScoringPredictions[0].word.forEach(/**@param{CellPlacement}letter*/(letter) => this.placedTiles[letter.x + ":" + letter.y] = letter)
                this.hand = []
                console.log(this.topScoringPredictions[0].points, this.topScoringPredictions[0].wdStr)
            }
        }
        this.showTempwords = true
        clearCaches()
    }
}
window.CellPlacement = CellPlacement