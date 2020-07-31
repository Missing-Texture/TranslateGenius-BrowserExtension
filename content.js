/**
 * Predefine HTML Elements for later access by other functions
 */
var container;
var col;
var lyrics;


/**  
 * @onInit send scraped Lyrics
 */
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
        col.setAttribute("id", "col")

        var songBody = document.createElement("div")
        songBody.className = "song_body-lyrics"

        var header = document.createElement("div")
        header.className = "lyrics_controls custom-header"
        header.innerHTML = "<a href=\"https://translate.google.com/\">powered by Google Translate</a>"

        var removeButton = document.createElement("button")
        removeButton.className = "square_button close"
        removeButton.onclick = function () {
            container.removeChild(col)
            container.className = "song_body column_layout" // remove custom Styling
        }

        lyrics = document.createElement("div")
        lyrics.className = "lyrics tmp"
        lyrics.innerText = msg.translation

        header.appendChild(removeButton)
        songBody.appendChild(header)
        songBody.appendChild(lyrics)
        col.appendChild(songBody)

        container.insertBefore(col, container.childNodes[2])
        browser.runtime.sendMessage({
            insertCSS: "true"
        })

        /*
        .then(() => {
            console.log(document.querySelector(".lyrics").clientHeight);
            lyrics.clientHeight = document.querySelector(".lyrics").clientHeight + "px";
            //lyrics.style.width = 425+"px";
            //document.querySelector(".lyrics").clientHeight;
            container.clientWidth = document.querySelector(".lyrics").clientWidth + lyrics.style.width +"px";
            console.log(container.style.width)
        })*/
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

    /**
     * @receives Flag 
     * 
     * Updates the 'lyrics' Element with newly translated lyrics
     * Reinsertes the 'lyrics' Element into DOM if it is not present
     */
    if (typeof msg.newTranslation !== 'undefined') {
        lyrics.innerText = msg.newTranslation

        if (document.getElementById("col") == null) {
            container.insertBefore(col, container.childNodes[2])
            container.className += " custom-length"
        }
    }

    if (typeof msg.removeOldTl !== 'undefined') {
        container.removeChild(col)
    }
})