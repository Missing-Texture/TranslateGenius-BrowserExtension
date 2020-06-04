function messageBs() {
    let select = document.getElementById("targetLang");
    browser.runtime.sendMessage({
        popupClicked: "true",
        targetLang: select.options[select.selectedIndex].value
    })
}

document.getElementById("translate").addEventListener("click", messageBs);