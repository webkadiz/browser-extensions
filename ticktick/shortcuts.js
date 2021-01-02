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
            document.querySelector(".CodeMirror textarea").focus()
        }
        if (e.code === "KeyE") {
            e.preventDefault()
            const searchForm = document.querySelector(".search-form") 
            const searchInput = document.querySelector(".search-box") 

            searchForm.classList.remove("inactive")
            searchForm.classList.add("active")
            searchInput.focus()

            searchInput.addEventListener("blur", () => {
                searchForm.classList.remove("active")
                searchForm.classList.add("inactive")
            })
        }
    }
})