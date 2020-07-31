var sl = "auto" // source Language
var tl // target Language
var lastTl
var lyricsWereInsertedPreviously = false
const gtURL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="

browser.runtime.onMessage.addListener(handleMessages)

function handleMessages(msg) {
    /**
     * @receives selected Target Language for Translation
     * 
     * Saves selected Target Language in local variable
     * 
     * If current TargetLanguage is equal to last TargetLanguage
     * send message to Content Script asking to the show Lyrics again
     * 
     * Else
     * send message to Content Script requesting the scraped lyrics of the song
     * 
     * Throws Error if Content Script was not injeted jet
     * injects Content Script
     */
    if (typeof msg.popupClicked !== 'undefined') {
        tl = msg.targetLang

        getActiveTabs()
            .then((tabs) => {
                if (tl == lastTl) {
                    browser.tabs.sendMessage(tabs[0].id, {
                            showLyrics: "true"
                        })
                        .catch((e) =>
                            // the Content Script has not been injected jet
                            insertContentScript()
                        )
                } else {
                    browser.tabs.sendMessage(tabs[0].id, {
                            scrapeLyrics: "true"
                        })
                        .catch((e) =>
                            // the Content Script has not been injected jet
                            insertContentScript()
                        )
                }
            })
    }

    /**
     * @receives scraped Lyrics from Content Script
     * 
     * Translates Lyrics using the Google Translate API
     * stitches Answer together to one String
     * 
     * Send Message to Content Script containing the Translation
     * decide if the HTML Elements need to be gereated first
     * based on if the lyrics were insterted previously
     * 
     * set 'lyricsWereInsertedPreviously' Flag to true
     * set lastTranslation to curent Translation
     */
    if (typeof msg.lyrics !== 'undefined') {
        fetch(gtURL + sl + "&tl=" + tl + "&dt=t&q=" + encodeURI(msg.lyrics))
            .then(data => {
                return data.json()
            })
            .then(data => {
                let tmp = [];
                data[0].forEach(e => {
                    tmp.push(e[0])
                })
                lyrics = tmp.join(" ")

                if (!lyricsWereInsertedPreviously) {
                    getActiveTabs()
                        .then((tabs) => browser.tabs.sendMessage(tabs[0].id, {
                            translation: lyrics
                        }))
                } else {
                    getActiveTabs()
                        .then((tabs) => browser.tabs.sendMessage(tabs[0].id, {
                            newTranslation: lyrics
                        }))
                }

                lyricsWereInsertedPreviously = true
                lastTl = tl
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
    return browser.tabs.query({
        active: true,
        currentWindow: true
    })
}

function insertContentScript() {
    browser.tabs.executeScript({
        file: "./content.js"
    })
    lyricsWereInsertedPreviously = false
}