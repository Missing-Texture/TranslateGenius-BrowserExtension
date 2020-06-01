let sl = "auto" // source Language
let tl = "de" // target Language
let gtURL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +sl+ "&tl=" +tl+ "&dt=t&q="

let isCsInserted = false;

browser.browserAction.onClicked.addListener(handleClick);

/**
 * Send message to Content Script asking to the show Lyrics again
 * 
 * Throws Error if Content Script was not injeted jet
 * injects Content Script
 */
function handleClick() {
    getActiveTabs()
    .then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {showLyrics: "true"})
        .catch((e) => {
            // the Content Script has not been injected jet
            browser.tabs.executeScript({
                file: "./content.js"
            })
        })
    })
}

browser.runtime.onMessage.addListener(onExecuted)

function onExecuted(result) {
    /**
     * @receives scraped Lyrics from Content Script
     * 
     * Translates Lyrics using the Google Translate API
     * stitches Answer together to one String
     * 
     * Sends Message to Content Script containing the Translation
     */
    if (typeof result.lyrics !== 'undefined') {
        console.log("recieved lyrics")
        console.log("=> MAKING API CALL")
        fetch(gtURL + encodeURI(result.lyrics))
        .then(data => {return data.json()})
        .then(data => {
            let tmp = [];
            data[0].forEach(e => {
                tmp.push(e[0])
            })
            lyrics = tmp.join(" ")
            
            getActiveTabs()
            .then((tabs) => browser.tabs.sendMessage(tabs[0].id, {translation: lyrics}))
        })
    }
    
    /**
     * @receives Flag to insert CSS
     * 
     * insertes CSS File into Webpage
     */
    if (typeof result.insertCSS !== 'undefined') {
        browser.tabs.insertCSS({
            file: "./style.css"
        })
    }
}

/**
 * @returns currently active Tab 
 */
function getActiveTabs() {
    return browser.tabs.query({active: true, currentWindow: true})
}