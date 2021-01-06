window.addEventListener("keydown", e => {
    if (e.ctrlKey) {
        if (e.code === "KeyB" && e.shiftKey) {
            e.preventDefault()
            const mouseover = new Event("mouseover", { bubbles: true })
            const click = new Event("click", { bubbles: true })
            
            document.querySelector("#left-menu-t").dispatchEvent(mouseover)
            document.querySelector("#left-menu-t").dispatchEvent(click)
        }
        if (e.code === "KeyF") {
            e.preventDefault()
            if (document.querySelector(".CodeMirror textarea"))
                document.querySelector(".CodeMirror textarea").focus()
        }
        if (e.code === "KeyD") { // focus on editor
            e.preventDefault()
            if (document.querySelectorAll(".CodeMirror textarea")[2])
                document.querySelectorAll(".CodeMirror textarea")[2].focus()
        }
    }
})