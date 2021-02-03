function waitFor(selector, callback) {
    let el, timer

    timer = setInterval(() => {
        el = document.querySelector(selector)

        if (el !== null) {
            clearInterval(timer)
            callback()
        }
    }, 50)
}

function hideSidebar() {
    document.querySelectorAll(sidebarSelector).forEach((sidebar) => {
        sidebar.style.display = "none"
    })

    sidebarIsOpen = false
}

function openSidebar() {
    document.querySelectorAll(sidebarSelector).forEach((sidebar) => {
        sidebar.style.display = ""
    })

    sidebarIsOpen = true
}

function fitVideoStream() {
    let videoStream = document.querySelector(videoStreamSelector)

    videoStream.parentElement.style.height = "100%"
    videoStream.style.height = "100%"
    videoStream.style.width = "100%"
}

function observeVideoStream() {
    new MutationObserver(() => {
        fitVideoStream()
    }).observe(document.querySelector(videoStreamSelector), {
        attributes: true
    })
}

function observeAppState() {
    new MutationObserver(() => {
        hideSidebar()
    }).observe(document.querySelector(appSelector), { attributes: true })
}

function start() {
    window.addEventListener("load", () => {
        waitFor(sidebarSelector, hideSidebar)
        waitFor(appSelector, observeAppState)
        waitFor(videoStreamSelector, observeVideoStream)
    })

    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === "KeyY" && sidebarIsOpen) {
            hideSidebar()
        } else if (
            e.ctrlKey &&
            e.shiftKey &&
            e.code === "KeyY" &&
            sidebarIsOpen === false
        ) {
            openSidebar()
        }
    })
}

let appSelector = "ytd-app",
    sidebarSelector = "#secondary",
    videoStreamSelector = ".video-stream",
    sidebarIsOpen = false

start()
