let container;
let col;

browser.runtime.onMessage.addListener(msg => {

    if (typeof msg.translation !== 'undefined') {
        //console.log("Received Translation")
        //console.log(msg)

        container = document.querySelector(".song_body");

        col = document.createElement("div");
        col.className = "column_layout-column_span column_layout-column_span--primary"

        let songBody = document.createElement("div");
        songBody.className = "song_body-lyrics"

        let header = document.createElement("div");
        header.className = "lyrics_controls custom-header"
        header.innerHTML = "<a href=\"https://translate.google.com/\">powered by Google Translate</a>"

        let removeButton = document.createElement("button");
        removeButton.className = "square_button close"
        removeButton.onclick = function () {
            container.removeChild(col)
        }

        let lyrics = document.createElement("div");
        lyrics.className = "lyrics"
        lyrics.innerText = msg.translation;

        header.appendChild(removeButton)
        songBody.appendChild(header)
        songBody.appendChild(lyrics)
        col.appendChild(songBody)

        container.insertBefore(col, container.firstChild)
    }
    else if (typeof msg.showLyrics !== 'undefined') {
        //console.log("reinsert Lyrics")
        container.insertBefore(col, container.firstChild)
    }
})
