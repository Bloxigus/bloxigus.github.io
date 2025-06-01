import {
    getResource
} from "./resourcemanager.js"
let WORDS_RAW = (await getResource("resources/llwords.txt", "text"))
let words = WORDS_RAW.toLowerCase().split("\n")
let out = {}

function timer(name) {
    let lastStart = 0
    let started = false
    let totalMillis = 0
    return {
        start: () => {
            if (started) return
            lastStart = performance.now()
            started = true
        },
        stop: () => {
            if (!started) return
            totalMillis += performance.now() - lastStart
            lastStart = 0
            started = false
        },
        log: () => {
            if (started) {
                console.log(`Timer ${name}: ${totalMillis + (performance.now() - lastStart)}ms`)
            } else {
                console.log(`Timer ${name}: ${totalMillis}ms`)
            }
        }
    }
}

for (let word of words) {
    let context = out
    for (let letter of word) {
        if (context[letter] == undefined) {
            context[letter] = {}
        }
        context = context[letter]
    }
    context[""] = 1;
}

let isValidWordCache = new Map()
/**
 * Checks if a word is a valid english word
 * Supports "?" as a wildcard
 * @param {String} word 
 */
function isValidWord(word) {
    if (isValidWordCache.has(word)) return isValidWordCache.get(word);
    if (word.includes("?")) {
        let contexts = [out];
        let results = [""]
        for (let letter of word) {
            for (let i in contexts) {
                if (contexts[i] != undefined) {
                    if (letter == "?") {
                        for (let contextOption in contexts[i]) {
                            if (contextOption != "") {
                                contexts.push(contexts[i][contextOption])
                                results[contexts.length - 1] = results[i] + contextOption
                            }
                        }
                        contexts[i] = undefined
                        results[i] = undefined
                    } else {
                        if (letter in contexts[i]) {
                            results[i] = results[i] + letter
                            contexts[i] = contexts[i][letter]
                        } else {
                            results[i] = undefined
                            contexts[i] = undefined
                        }
                    }
                }
            }
            contexts = contexts.filter(a => a)
            results = results.filter(a => a)
        }
        if (results.length >= 1 && contexts.some(a => a[""] != undefined)) {
            isValidWordCache.set(word, true)
            return true
        }
        isValidWordCache.set(word, false)
        return false;
    } else {
        let context = out;
        for (let letter of word) {
            if (context == 1 || context == undefined) {
                isValidWordCache.set(word, false)
                return false;
            }
            if (letter in context) {
                context = context[letter]
            } else {
                isValidWordCache.set(word, false)
                return false;
            }
        }
        if (context[""] != undefined) {
            isValidWordCache.set(word, true)
            return true;
        }
        isValidWordCache.set(word, false)
        return false;
    }
}
/**
 * Clears the cache of know substrings
 * Clearing this for repeat operations slows down 
 * performance for a decrease in memory usage
 */
function clearCaches() {
    isValidWordCache.clear();
    anyWordsStartWithCache.clear();
}
/**
 * Get possible replacements for a wildcard ("?")
 * @param {string} word 
 * @returns 
 */
function getMysteryLetterOptions(word) {
    let contexts = [out];
    let results = [""]
    for (let letter of word) {
        for (let i in contexts) {
            if (contexts[i] != undefined) {
                if (letter == "?") {
                    for (let contextOption in contexts[i]) {
                        if (contextOption != "") {
                            contexts.push(contexts[i][contextOption])
                            results[contexts.length - 1] = results[i] + contextOption
                        }
                    }
                    contexts[i] = undefined
                    results[i] = undefined
                } else {
                    if (letter in contexts[i]) {
                        results[i] = results[i] + letter
                        contexts[i] = contexts[i][letter]
                    } else {
                        results[i] = undefined
                        contexts[i] = undefined
                    }
                }
            }
        }
        contexts = contexts.filter(a => a)
        results = results.filter(a => a)
    }
    let options = []
    for (let result of results) {
        let option = []
        for (let letter in word) {
            if (word[letter] == "?") {
                option.push(result[letter])
            }
        }
        options.push(option)
    }
    return options;
}
let anyWordsStartWithCache = new Map()
/**
 * Checks if any words start with a given substring. 
 * Includes full words
 * Supports "?" as a wildcard
 * @param {string} startString 
 * @returns 
 */
function anyWordsStartWith(startString) {
    if (anyWordsStartWithCache.has(startString)) return anyWordsStartWithCache.get(startString)
    if (startString.includes("?")) {
        let contexts = [out];
        let results = [""]
        for (let letter of startString) {
            for (let i in contexts) {
                if (contexts[i] != undefined) {
                    if (letter == "?") {
                        for (let contextOption in contexts[i]) {
                            if (contextOption != "") {
                                contexts.push(contexts[i][contextOption])
                                results[contexts.length - 1] = results[i] + contextOption
                            }
                        }
                        contexts[i] = undefined
                        results[i] = undefined
                    } else {
                        if (letter in contexts[i]) {
                            results[i] = results[i] + letter
                            contexts[i] = contexts[i][letter]
                        } else {
                            results[i] = undefined
                            contexts[i] = undefined
                        }
                    }
                }
            }
        }
        if (results.some(v => v != undefined)) {
            anyWordsStartWithCache.set(startString, true)
            return true;
        }

        anyWordsStartWithCache.set(startString, false)
        return false;
    } else {
        let context = out;
        for (let letter of startString) {
            if (context == 1 || context == undefined) {
                anyWordsStartWithCache.set(startString, false)
                return false;
            }
            if (letter in context) {
                context = context[letter]
            } else {
                anyWordsStartWithCache.set(startString, false)
                return false;
            }
        }
        if (context != undefined) {
            anyWordsStartWithCache.set(startString, true)
            return true;
        }
        anyWordsStartWithCache.set(startString, false)
        return false;
    }
}

if (window) {
    // Apply some variables to global scope
    window.isValidWord = isValidWord;
    window.anyWordsStartWith = anyWordsStartWith;
    window.getMysteryLetterOptions = getMysteryLetterOptions;
}
export {
    isValidWord,
    anyWordsStartWith,
    getMysteryLetterOptions,
    clearCaches
}