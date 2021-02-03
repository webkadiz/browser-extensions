const state = {}
const data = {}

function waitFor(selector, callback) {
    let el, timer, timePassed = 0

    timer = setInterval(() => {
        el = document.querySelector(selector)
        timePassed += 50

        if (timePassed > 3000) {
            console.error("timer timeout")
            clearInterval(timer)
        }

        if (el !== null) {
            clearInterval(timer)
            callback()
        }
    }, 50)
}

function hideSidebar() {
    document.querySelectorAll(data.sidebarSelector).forEach((sidebar) => {
        sidebar.style.display = "none"
    })

    state.sidebarIsOpen = false
}

function openSidebar() {
    document.querySelectorAll(data.sidebarSelector).forEach((sidebar) => {
        sidebar.style.display = ""
    })

    state.sidebarIsOpen = true
}

function fitVideoStream() {
    let videoStream = document.querySelector(data.videoStreamSelector)

    videoStream.parentElement.style.height = "100%"
    videoStream.style.height = "100%"
    videoStream.style.width = "100%"
}

function observeVideoStream() {
    new MutationObserver(() => {
        fitVideoStream()
    }).observe(document.querySelector(data.videoStreamSelector), {
        attributes: true
    })
}

function observeAppState() {
    new MutationObserver(() => {
        hideSidebar()
    }).observe(document.querySelector(data.appSelector), { attributes: true })
}

function setSidebarStateKeyboardHandler() {
    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === "KeyY" && state.sidebarIsOpen) {
            hideSidebar()
        } else if (
            e.ctrlKey &&
            e.shiftKey &&
            e.code === "KeyY" &&
            state.sidebarIsOpen === false
        ) {
            openSidebar()
        }
    })
}

function initState() {
    state.sidebarIsOpen = false
}

function initData() {
    data.appSelector = "ytd-app"
    data.sidebarSelector = "#secondary"
    data.videoStreamSelector = ".video-stream"
}

function start() {
    initState()
    initData()
    waitFor(data.sidebarSelector, hideSidebar)
    waitFor(data.appSelector, observeAppState)
    waitFor(data.videoStreamSelector, observeVideoStream)
    setSidebarStateKeyboardHandler()
}

start()
