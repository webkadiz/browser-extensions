window.addEventListener("keydown", e => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyY") {
        if (document.querySelector("#secondary").style.display === "none") {
            document.querySelector("#secondary").style.display = ""
        } else {
            document.querySelector("#secondary").style.display = "none"
        }
    }
})