new MutationObserver(appShowUpHandler)
    .observe(document.querySelector("#root"), {
        childList: true
    })

function appShowUpHandler() {
    injectStyles()
    injectFontAwesomeScript()

    setOnWindowPopupApperHandler()
    setObserverForUpdatePopupBtn()

    if (checkTaskListViewExisting()) {
        injectTimePlannerPopupBtn()
    }

    this.disconnect()
}

function injectStyles() {
    let style = document.createElement("style")

    style.innerHTML = `
        .time-planner-popup {
            width: auto !important;
            height: auto !important;
            min-height: auto !important;
            position: fixed;
            left: 50%;
            transform: translateX(-50%) !important;
            z-index: 10;
        }

        [class*=-dark-theme] .time-planner-popup-btn {
            color: white;
        }

        .time-planner-popup-btn {
            display: flex;
            color: black;
            opacity: .36;
        }

        .time-planner-popup-btn:hover {
            opacity: .56;
        }
    `

    document.head.append(style)
}

function injectFontAwesomeScript() {
    let script = document.createElement("script")
    script.src = "https://kit.fontawesome.com/f69c76f886.js"

    document.head.append(script)
}

function injectTimePlannerPopupBtn() {
    let taskListHeader = document.querySelector(".tl-bar"),
        headerRightBar = taskListHeader.querySelector(".line-right"),
        timePlannerPopupBtn = headerRightBar.firstElementChild.cloneNode(true)
    

    timePlannerPopupBtn.firstElementChild.innerHTML = 
        `<div class="time-planner-popup-btn"><i class="fas fa-ruler"></i></div>`
    headerRightBar.prepend(timePlannerPopupBtn)

    timePlannerPopupBtn.addEventListener("click", timePlannerPopupApperHandler)
}

function timePlannerPopupApperHandler() {
    let 
        timePlannerPopupBtn = document.querySelector(".time-planner-popup-btn"),
        timePlannerPopup,
        appContainer = document.querySelector("#container-main")

    if (timePlannerPopupBtn.classList.contains("popup-open")) {
        timePlannerPopupBtn.classList.remove("popup-open")
        appContainer.querySelector(".time-planner-popup").remove()
    } else {
        timePlannerPopupBtn.classList.add("popup-open")
        timePlannerPopup = createTimePlannerPopup()
        appContainer.append(timePlannerPopup)
    }
}

function setOnWindowPopupApperHandler() {
    window.addEventListener("keydown", e => {
        if (e.ctrlKey && e.code === "KeyO") {
            e.preventDefault()
            timePlannerPopupApperHandler()
        }
    })
}

function setObserverForUpdatePopupBtn() {
    new MutationObserver(records => {
        records.forEach(record => {
            let 
                addedNodes = [...record.addedNodes],
                taskListViewArray = addedNodes.filter(addedNode => addedNode.id === "task-list-view")

            if (taskListViewArray.length !== 0) {
                injectTimePlannerPopupBtn()
            }
        })
    }).observe(document.querySelector("#container-main"), {
        childList: true
    })
}

function checkTaskListViewExisting() {
    return document.querySelector("#task-list-view")
}

function createTimePlannerPopup() {
    let markup,
        popupContainer = document.createElement("div"),
        timePredictionStr

    timePredictionStr = generateTimePredictionStr()

    popupContainer.className = "global-quick-add popup time-planner-popup"

    markup = `
        <div>${timePredictionStr}</div>
    `

    popupContainer.innerHTML = markup

    return popupContainer
}

function generateTimePredictionStr() {
    let 
        tags = document.querySelectorAll(".task:not(.checked) .tag-name"),
        time = 0,
        hours,
        minutes

    tags.forEach(tag => {
        let tagContent = tag.innerHTML.trim()

        if (tagContent.endsWith("min")) {
            time += parseInt(tagContent)
        } else if (tagContent.endsWith("hour")) {
            time += parseFloat(tagContent) * 60
        }
    })

    hours = Math.floor(time / 60)
    minutes = time - hours * 60

    return `${hours} hours ${minutes} minutes`
}
