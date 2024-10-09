import { getResource } from "./resourcemanager.js"
let WORDS_RAW = (await getResource("resources/llwords.txt", "text"))
let words = WORDS_RAW.toLowerCase().split("\n")
const WORDS_BY_LENGTH = []
let out = {}
for (let word of words)
{
    let context = out
    for (let letter of word)
    {
        if (context[letter] == undefined)
        {
            context[letter] = {}
        }
        context = context[letter]
    }
    context[""] = 1;
    (WORDS_BY_LENGTH[word.length] = (WORDS_BY_LENGTH[word.length] || [])).push(word);
}
function compressTrie(value, key, parent)
{
    for (let key2 in value)
    {
        if (value[key2] && key2 && typeof value[key2] == "object") compressTrie(value[key2], key2, value)
    }
    if (Object.values(value).length == 1 && parent != undefined)
    {
        delete parent[key];
        let appendKey = Object.keys(value)[0]
        parent[key + appendKey] = value[appendKey]
    }
}
compressTrie(out, "", undefined)
let isValidWordCache = new Map()
function isValidWord(word)
{
    if (isValidWordCache.has(word)) return isValidWordCache.get(word);
    if (word.includes("?")) {
        let regex = new RegExp("^" + word.replaceAll("?","[a-z]") + "$", "m") 
        if (regex.test(WORDS_RAW)) {
            isValidWordCache.set(word, true)
            return true
        }
        isValidWordCache.set(word, false)
        return false;
    } else {
        if (words.includes(word)) {
            isValidWordCache.set(word, true)
            return true;
        }
        isValidWordCache.set(word, false)
        return false;
    }
}
function clearCaches() {
    isValidWordCache.clear();
    anyWordsStartWithCache.clear();
}
/**
 * 
 * @param {string} word 
 * @returns 
 */
function getMysteryLetterOptions(word) {
    let regex = new RegExp("^" + word.replaceAll("?","[a-z]") + "$") 
    let options = []
    for (let wordlistWord of words) {
        if (regex.test(wordlistWord)) {
            let option = [];
            for (let letter in word) {
                if (word[letter] == "?") {
                    option.push(wordlistWord[letter])
                }
            }
            options.push(option);
        }
    }
    return options;
}
let anyWordsStartWithCache = new Map()
/**
 * 
 * @param {string} startString 
 * @returns 
 */
function anyWordsStartWith(startString)
{
    if (anyWordsStartWithCache.has(startString)) return anyWordsStartWithCache.get(startString)
    if (startString.includes("?"))
    {
        let regex = new RegExp("^" + startString.replaceAll("?","[a-z]"), "m")
        if (regex.test(WORDS_RAW)) {
            anyWordsStartWithCache.set(startString, true)
            return true;
        }
        anyWordsStartWithCache.set(startString, false)
        return false;
    } else
    {
        let context = out;
        let key = ""
        for (let letter of startString)
        {
            key += letter;
            if (context == 1) {
                anyWordsStartWithCache.set(startString, false)
                return false;
            }
            if (key in context)
            {
                context = context[key]
                key = ""
            }
        }
        if (key == "")
        {
            anyWordsStartWithCache.set(startString, true)
            return true;
        }
        if (Object.keys(context).find(v => v.startsWith(key)))
        {
            anyWordsStartWithCache.set(startString, true)
            return true;
        }
        anyWordsStartWithCache.set(startString, false)
        return false;
    }
}

if (window)
{
    window.isValidWord = isValidWord;
    window.anyWordsStartWith = anyWordsStartWith;
    window.getMysteryLetterOptions = getMysteryLetterOptions;
}
export
{
    isValidWord,
    WORDS_BY_LENGTH,
    anyWordsStartWith,
    getMysteryLetterOptions,
    clearCaches
}