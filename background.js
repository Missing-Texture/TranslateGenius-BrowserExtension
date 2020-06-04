let sl = "auto" // source Language
let tl // target Language
let gtURL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="

browser.runtime.onMessage.addListener(handleMessages)

function handleMessages(msg) {
    /**
     * @receives Flag if Popup was clicked
     * @receives selected Target Language for Translation
     * 
     * Saves selected Target Language in local variable
     * 
     * Send message to Content Script asking to the show Lyrics again
     * 
     * Throws Error if Content Script was not injeted jet
     * injects Content Script
     */
    if (typeof msg.popupClicked !== 'undefined') {

        if (tl !== msg.targetLang) {
            tl = msg.targetLang
        }
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
    /**
     * @receives scraped Lyrics from Content Script
     * 
     * Translates Lyrics using the Google Translate API
     * stitches Answer together to one String
     * 
     * Sends Message to Content Script containing the Translation
     */
    if (typeof msg.lyrics !== 'undefined') {
        console.log("=> MAKING API CALL")
        fetch(gtURL +sl+ "&tl=" +tl+ "&dt=t&q=" + encodeURI(msg.lyrics))
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
    if (typeof msg.insertCSS !== 'undefined') {
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