window.addEventListener("keydown", e => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyY") {
        document.querySelectorAll("#secondary").forEach(sidebar => {
            if (sidebar.style.display === "none") {
                sidebar.style.display = ""
            } else {
                sidebar.style.display = "none"
            }
        })
    }
})