(() => {
    function fn2workerURL(fn) {
        const blob = new Blob([`(${fn.toString()})()`], { type: "text/javascript" });
        return URL.createObjectURL(blob);
    }
    let sw = _ => {
        let jobQueue = {}
        onmessage = (event) => {
            let target = event.data.target
            let values = event.data.values
            let jobId = event.data.jobId
            let action = event.data.action;
            if (action == "end") {
                jobQueue[jobId] = "stop"
            } else {
                jobQueue[jobId] = "open"
                forceNumberGame(target, values, jobId).then(a => {
                    console.log(a)
                    postMessage({
                        target,
                        values,
                        jobId,
                        bestValue: a[0],
                        equation: a[1],
                        flag: a[2],
                        type: "finished"
                    })
                })
            }
        }
        async function forceNumberGame(target = 0, values = [], jobId) {
            let operations = {
                add: {
                    enabled: true,
                    commutative: true,
                    func: (a, b, s, rev) => {
                        totalForced++;
                        if (rev) {
                            if (s) {
                                return [a + b, "(" + a + "+" + s + ") "];
                            }
                            return [a + b, "(" + a + "+" + b + ")"]
                        }
                        if (s) {
                            return [a + b, "(" + s + "+" + b + ")"];
                        }
                        return [a + b, "(" + a + "+" + b + ")"];
                    }
                },
                multiply: {
                    enabled: true,
                    commutative: true,
                    func: (a, b, s, rev) => {
                        totalForced++;
                        if (rev) {
                            if (s) {
                                return [a * b, "" + a + "x" + s + ""];
                            }
                            return [a * b, "" + a + "x" + b + ""]
                        }
                        if (s) {
                            return [a * b, "" + s + "x" + b + ""];
                        }
                        return [a * b, "" + a + "x" + b + ""]
                    }
                },
                subtract: {
                    enabled: true,
                    commutative: false,
                    func: (a, b, s, rev) => {
                        totalForced++;
                        if (rev) {
                            if (s) {
                                return [a - b, "(" + a + "-" + s + ")"];
                            }
                            return [a - b, "(" + a + "-" + b + ")"]
                        }
                        if (s) {
                            return [a - b, "(" + s + "-" + b + ")"];
                        }
                        return [a - b, "(" + a + "-" + b + ")"];
                    }
                },
                divide: {
                    enabled: true,
                    commutative: false,
                    func: (a, b, s, rev) => {
                        totalForced++;
                        if (rev) {
                            if (s) {
                                return [a / b, "" + a + "/" + s + ""];
                            }
                            return [a / b, "" + a + "/" + b + ""]
                        }
                        if (s) {
                            return [a / b, "" + s + "/" + b + ""];
                        }
                        return [a / b, "" + a + "/" + b + ""]
                    }
                },
                pow: {
                    enabled: true,
                    commutative: false,
                    func: (a, b, s, rev) => {
                        totalForced++;
                        if (rev) {
                            if (s) {
                                return [a ** b, "(" + a + ")^(" + s + ")"];
                            }
                            return [a ** b, "(" + a + ")^(" + b + ")"]
                        }
                        if (s) {
                            return [a ** b, "(" + s + ")^(" + b + ")"];
                        }
                        return [a ** b, "(" + a + ")^(" + b + ")"]
                    }
                },
            }

            function getNextEquations(baseEquation) {
                let newCombinations = [];
                let hasSolution = false;
                let closest = [0]
                for (let B in values) {
                    if (hasSolution) continue;
                    if (2 ** B & baseEquation.flags) continue
                    let a = baseEquation.value
                    let b = values[B];
                    let flag = baseEquation.flags + 2 ** B;
                    //console.log(a,b)
                    for (let operation of Object.values(operations)) {
                        if (!operation.enabled) continue;
                        let res = operation.func(a, b, baseEquation.equations)
                        if ((res[0] + "").includes(".")) {
                            dropped.DECIMAL += 1;
                            continue
                        }
                        if (res[0] > target * target) {
                            dropped.TOO_LARGE += 1;
                            continue;
                        }
                        if (newCombinations.findIndex(v => {
                            return v.flags == flag && v.value == res[0];
                        }) != -1) {
                            dropped.DUPLICATE += 1;
                            continue;
                        }
                        newCombinations.push({
                            flags: flag,
                            value: res[0],
                            equations: res[1]
                        })
                        if (res[0] == target) {
                            //console.log(res)
                            result = res
                            result[2] = flag
                            return [true, result, result[0]]
                        }
                        if (Math.abs(target - res[0]) < Math.abs(target - closest[0])) {
                            closest = [res[0], res[1], flag]
                        }
                    }
                    for (let operation of Object.values(operations)) {
                        if (!operation.enabled) continue;
                        if (operation.commutative) {
                            dropped.COMMUTATIVE += 1;
                            continue;
                        }
                        let res = operation.func(b, a, baseEquation.equations, true)
                        if ((res[0] + "").includes(".")) continue
                        if (res[0] > target * target) continue
                        if (newCombinations.findIndex(v => {
                            return v.flags == flag && v.value == res[0];
                        }) != -1) {
                            dropped.DUPLICATE += 1;
                            continue;
                        }
                        newCombinations.push({
                            flags: flag,
                            value: res[0],
                            equations: res[1]
                        })
                        if (res[0] == target) {
                            //console.log(res)
                            result = res
                            result[2] = flag
                            return [true, result, result[0]]
                        }
                        if (Math.abs(target - res[0]) < Math.abs(target - closest[0])) {
                            closest = [res[0], res[1], flag]
                        }
                    }
                }
                //console.log(closest)
                return [false, newCombinations, closest]
            }
            function recursiveSoln(depth, next, hasSolution, result, smallestDigits) {
                let shouldReturn = false;
                if (next) {
                    this.next = next;
                    this.hasSolution = hasSolution;
                    this.result = result;
                    this.smallestDigits = smallestDigits
                    this.closest = [0];
                    shouldReturn = true;
                }
                // cull off any unneeded depth
                if (this.smallestDigits <= depth + 1) return [this.hasSolution, this.result, this.smallestDigits];
                // the last version of next before we change it
                let lastNext = this.next
                if (depth >= values.length) return [this.hasSolution, this.result, this.smallestDigits]
                for (let B in lastNext[1]) {
                    let start = lastNext[1][B]
                    this.next = getNextEquations(start)
                    if (this.next[0] && this.smallestDigits > depth + 1) {
                        //console.log(this.next)
                        this.result = this.next[1]
                        this.hasSolution = true
                        this.smallestDigits = depth + 1;
                        return [this.hasSolution, this.result, this.smallestDigits, this.closest];
                    }
                    if (Math.abs(this.next[2][0] - target) < Math.abs(this.closest[0] - target)) this.closest = this.next[2];
                    recursiveSoln.call(this, depth + 1)
                }
                if (shouldReturn) {
                    return [this.hasSolution, this.result, this.smallestDigits, this.closest]
                }
            }
            function progressbar(length, max, fillChar = "=", emptyChar = " ") {
                let percent = length / max
                let progress = 0
                let hassoln = false;
                let closest = 0;
                let leastSize = 100
                let returnVal = {
                    update: () => {
                        progress++;
                        postMessage({
                            type: "progressUpdate",
                            jobId,
                            progress,
                            max,
                            closest,
                            hassoln,
                            leastSize
                        })
                    },
                    updateBest: (newBest) => {
                        hassoln = true;
                        leastSize = newBest;
                        postMessage({
                            type: "progressUpdate",
                            jobId,
                            progress,
                            max,
                            closest,
                            hassoln,
                            leastSize
                        })
                    },
                    updateClosest: (newBest) => {
                        //console.log(newBest)
                        if (hassoln) return;
                        if (Math.abs(newBest[0] - target) > Math.abs(closest[0] - target)) return;
                        closest = newBest
                        //console.log(closest)
                        closestx = closest;
                        postMessage({
                            type: "progressUpdate",
                            jobId,
                            progress,
                            max,
                            closest,
                            hassoln,
                            leastSize
                        })
                    }
                }
                Object.defineProperty(returnVal, "closest", {
                    get: () => {
                        return closest;
                    }
                })
                return returnVal;
            }
            let result = []
            let closestx = []
            async function do_stuff(nu) {
                let targ2 = target * target
                let combinations = [
                    {
                        flags: 0b0000000,
                        value: 0,
                        equations: 0
                    }
                ];
                combinations.pop()
                let hasSolution = false;
                let smallestDigits = values.length + 1
                for (let A in values) {
                    if (hasSolution) continue
                    if (values[A] == target) {
                        result = [values[A], values[A]+"", 0]
                        hasSolution = true
                        smallestDigits = 1
                        console.log([values[A], values[A], values[A]])
                        //return [values[A], values[A]+"", values[A]];
                    }
                    for (let B in values) {
                        if (A == B) continue
                        let a = values[A];
                        let b = values[B];
                        let flag = 2 ** A + 2 ** B;
                        for (let operation of Object.values(operations)) {
                            if (!operation.enabled) continue;
                            let res = operation.func(a, b)
                            if ((res[0] + "").includes(".")) continue
                            if (res[0] > targ2) continue
                            combinations.push({
                                flags: flag,
                                value: res[0],
                                equations: res[1]
                            })
                            if (res[0] == target && !hasSolution) {
                                //console.log(res)
                                hasSolution = true
                                smallestDigits = 2
                                result = [res[0], res[1], flag]
                            }
                        }
                    }
                }
                // recursive solution that *works*
                let progress = progressbar(60, combinations.length)
                for (let A in combinations) {
                    if (jobQueue[jobId] == "stop") continue;
                    progress.update()
                    if (smallestDigits == 2) continue;
                    let start = combinations[A]
                    let next = getNextEquations(start)
                    if (next[0] && smallestDigits > 3) {
                        result = next[1]
                        hasSolution = true
                        smallestDigits = 3;
                        continue;
                    }
                    // Starts a recurse with the current state
                    let recurseResults = recursiveSoln(3, next, hasSolution, result, smallestDigits)
                    //console.log(recurseResults)
                    if (recurseResults[3]) progress.updateClosest(recurseResults[3])
                    if (recurseResults[0]) {
                        if (recurseResults[2] < smallestDigits) {
                            hasSolution = true;
                            result = recurseResults[1]
                            smallestDigits = recurseResults[2]
                            progress.updateBest(smallestDigits)
                        }
                    }
                }
                if (result.length == 0) {
                    closestx = progress.closest
                    return closestx
                }
                combinations.length = 0;
                return closestx;
            }
            let totalForced = 0
            let searched = {}
            Object.defineProperty(searched, "total", { get: () => { return totalForced - (dropped.DECIMAL + dropped.TOO_LARGE + dropped.DUPLICATE) } })
            Object.defineProperty(searched, "totalWithDropped", { get: () => { return totalForced } })
            Object.defineProperty(searched, "totalDropped", { get: () => { return dropped.DECIMAL + dropped.TOO_LARGE + dropped.DUPLICATE } })
            Object.defineProperty(searched, "totalDroppedDecimal", { get: () => { return dropped.DECIMAL } })
            Object.defineProperty(searched, "totalDroppedTooLarge", { get: () => { return dropped.TOO_LARGE } })
            Object.defineProperty(searched, "totalDroppedDuplicate", { get: () => { return dropped.DUPLICATE } })
            Object.defineProperty(searched, "totalDroppedCommutative", { get: () => { return dropped.COMMUTATIVE } })
            let dropped = { DECIMAL: 0, TOO_LARGE: 0, DUPLICATE: 0, COMMUTATIVE: 0 }
            await do_stuff(0)
            if (result) {
                return result;
            } else {
                return closestx
            }
        }
    }
    const worker = new Worker(fn2workerURL(sw))
    const jobs = {};
    let jobIdGenerator = (() => {
        let counter = 0
        return function () {
            return counter++;
        }
    })()
    worker.onmessage = (ev) => {
        if (ev.data.type == "finished") {
            //console.log(ev.data)
            const finishedId = ev.data.jobId
            jobs[finishedId] ?. (ev.data);
        } else if (ev.data.type == "progressUpdate") {
            document.getElementsByClassName("box")[0].style.width = `${100*(ev.data.progress/ev.data.max)}%`
        }
    }
    let hasRunRunning = false;
    let latestJobId = -1;
    function solveNumberGame(target, values) {
        if (hasRunRunning) return;
        let jobId = jobIdGenerator()
        hasRunRunning = true;
        latestJobId = jobId;
        worker.postMessage({ target, values, jobId, action: "solve" })
        let promise = new Promise((resolve) => {
            hasRunRunning = false;
            jobs[jobId] = resolve;
        })
        return promise
    }
    function cancelLatestRun() {
        if (!hasRunRunning) return;
        worker.postMessage({ action: "end", latestJobId })
    }
    window.cancelLatestRun = cancelLatestRun;
    window.solveNumberGame = solveNumberGame;
    solveNumberGame.jobs = jobs;
    solveNumberGame.worker = worker
})()
const BRACKET_COLOUR = ""
const NUMBER_COLOUR = ""
const OPERATION_COLOUR = ""
function beautifyEquation(equation="") {
    let removeFirstBracket = (`[${equation}]`.includes("[ (") && `[${equation}]`.includes(") ]"))
    console.log(removeFirstBracket)
    if (removeFirstBracket) {
        equation = equation.replace("[(","[")
        equation[equation.lastIndexOf(")")] = "";
    }
    return equation
    .replaceAll("(", BRACKET_COLOUR + "(" + NUMBER_COLOUR)
    .replaceAll("-", OPERATION_COLOUR + " \u2212 " + NUMBER_COLOUR)
    .replaceAll("/", OPERATION_COLOUR + " \u00f7 " + NUMBER_COLOUR)
    .replaceAll("+", OPERATION_COLOUR + " \u002b " + NUMBER_COLOUR)
    .replaceAll("x", OPERATION_COLOUR + " \u00d7 " + NUMBER_COLOUR)
    .replaceAll(")", BRACKET_COLOUR + ")" + NUMBER_COLOUR)
    .replaceAll("^", OPERATION_COLOUR + "^" + ""+NUMBER_COLOUR)
    .replaceAll(/[\[\]]/g,"")
}
function addInputElement() {
    let ele = document.createElement("input")
    ele.classList.add("__number")
    ele.type = "number"
    ele.id = document.getElementById('numbers').children.length
    document.getElementById('numbers').appendChild(ele)
    let ele2 = document.createElement("button")
    let ele3 = document.createElement("br")
    ele2.onclick = ()=>{removeInputElement(ele);removeInputElement(ele2);removeInputElement(ele3)};
    ele2.innerText = "x"
    ele2.tabIndex = -1
    ele2.id = document.getElementById('numbers').children.length
    document.getElementById('numbers').appendChild(ele2)
    document.getElementById('numbers').appendChild(ele3)
    // <button onclick="removeInputElement(0)">❌</button>
}
function removeInputElement(element) {
    element.remove()
}
function doGameSolve() {
    document.getElementById("result").innerHTML = "solving"
    let values = [...document.getElementById('numbers').getElementsByClassName("__number")].map(a=>{return a.value*1}).filter(a=>a)
    let target = document.getElementsByName("target")[0].value
    //console.log(target,values)
    solveNumberGame(target,values).then(a=>{
        if (a.equation) {
        //console.log(a)
        document.getElementById("result").innerHTML = beautifyEquation(a.equation) + " = " + a.target
        } else {
            document.getElementById("result").innerHTML = "no solutions"
        }
    })
}
