let container;
let col;


/** send scraped Lyrics on Init */
sendScrapedLyrics();

function sendScrapedLyrics() {
    browser.runtime.sendMessage({
        lyrics: document.querySelector(".lyrics").innerText
    })
}

browser.runtime.onMessage.addListener(msg => {
    /**
     * @receives translated Lyrics
     * 
     * Generates HTML Elements
     *  - Header containing 'powered by ' message and Close Button
     *  - Song Lyrics Body
     * 
     * Appends generated Elements to DOM
     * adds Style Classes accordingly
     */
    if (typeof msg.translation !== 'undefined') {
        container = document.querySelector(".song_body")
        container.className += " custom-length"

        col = document.createElement("div")
        col.className = "column_layout-column_span column_layout-column_span--primary"

        let songBody = document.createElement("div")
        songBody.className = "song_body-lyrics"

        let header = document.createElement("div")
        header.className = "lyrics_controls custom-header"
        header.innerHTML = "<a href=\"https://translate.google.com/\">powered by Google Translate</a>"

        let removeButton = document.createElement("button")
        removeButton.className = "square_button close"
        removeButton.onclick = function () {
            container.removeChild(col)
            container.className = "song_body column_layout" // remove custom Styling
        }

        let lyrics = document.createElement("div")
        lyrics.className = "lyrics"
        lyrics.innerText = msg.translation

        header.appendChild(removeButton)
        songBody.appendChild(header)
        songBody.appendChild(lyrics)
        col.appendChild(songBody)

        container.insertBefore(col, container.childNodes[2])
        browser.runtime.sendMessage({
            insertCSS: "true"
        })
    }
    /**
     * @receives Flag to show Lyrics again
     * 
     * Reinserts HTML Element into DOM
     * adds Style Classes accordingly
     */
    if (typeof msg.showLyrics !== 'undefined') {
        container.insertBefore(col, container.childNodes[2])
        container.className += " custom-length"
    }
    if (typeof msg.scrapeLyrics !== 'undefined') {
        sendScrapedLyrics()
    }
    if (typeof msg.removeOldTl !== 'undefined') {
        container.removeChild(col)
    }
})

