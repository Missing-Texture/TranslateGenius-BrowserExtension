let sl = "auto" // source Language
let tl = "de" // target Language
let gtURL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +sl+ "&tl=" +tl+ "&dt=t&q="

let isCsInserted = false;

browser.browserAction.onClicked.addListener(handleClick);

function handleClick() {
    browser.tabs.executeScript({
        file: "./scraper.js",
    })
}

browser.runtime.onMessage.addListener(onExecuted)

function onExecuted(result) {
    if (typeof result.lyrics !== 'undefined') {

        /**
         * Send message to Content Script
         * 
         * Throws Error if Content Script was not injeted jet
         * catches Error, sets isCsInserted Flag to false, calls function insertTranslationScript()
         * 
         * Checks if isisCsInserted Flag is true
         * sends Message to Content Script that requests the lyrics to be shown again
         */
        getActiveTabs()
        .then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {areYouThere: "?"})
            .catch((e) => {
                isCsInserted = false;
                //console.log("cs NOT THERE -> changed cs Inserted to = " + isCsInserted)
                insertTranslationScript(result)
            })
            .then(() => {
                if (isCsInserted) {
                    browser.tabs.sendMessage(tabs[0].id, {showLyrics: "true"})
                }
            })
        })
        
    }
}

/**
 * Fetches Translation of Lyrics from Google Translate API
 * stitches Answer together to one String
 * 
 * Executes insertTranslation Script 
 * inserts style.css
 * sends Message to Content Script containing the translated lyrics
 * 
 * sets isCsInserted Flag to true
 * 
 * @param {string} result   scraped lyrics 
 */
function insertTranslationScript(result) {
    //console.log("cs Inserted? = " + isCsInserted)
    if (!isCsInserted) {
        console.log("=> MAKING API CALL")
        fetch(gtURL + encodeURI(result.lyrics))
        .then(data => {return data.json()})
        .then(data => {
            let tmp = [];
            data[0].forEach(e => {
                tmp.push(e[0])
            })
            lyrics = tmp.join(" ")
            
            browser.tabs.executeScript({
                file: "./insertTranslation.js",
            })
            .then(() => {
                browser.tabs.insertCSS({
                    file: "./style.css"
                })
                getActiveTabs()
                .then((tabs) => browser.tabs.sendMessage(tabs[0].id, {translation: lyrics}))
            })
        })
        isCsInserted = true;
    }
}

function getActiveTabs() {
    return browser.tabs.query({active: true, currentWindow: true})
}