const state = {
    isListMoving: false,
    savedListActiveElement: null
}

new MutationObserver(appShowUpHandler)
    .observe(document.querySelector("#root"), {
        childList: true
    })

function appShowUpHandler() {

    addCustomSmartListsToCommonListContainer()
    addDefaultSmartListsToCommonListContainer()
    makeListsResponsiveOnClick()
    removeExcessNodes()
    setClickOnProjectList()
    setListMovingHandler()

    this.disconnect()
}

function addCustomSmartListsToCommonListContainer() {
    let commonListTab, customListTab, customSmartLists, commonListContainer

    commonListTab = document.querySelectorAll(".l-tab .text-def")[0]
    customListTab = document.querySelectorAll(".l-tab .text-def")[2]

    customListTab.click()
    
    customSmartLists = 
        [...document.querySelectorAll(".custom-smart-project")]
            .reverse()
            .map(smartList => smartList.cloneNode(true))
    
    commonListTab.click()

    commonListContainer = document.querySelector(".project-ul")

    customSmartLists.forEach(customSmartList =>
        commonListContainer.prepend(customSmartList)
    )
}

function addDefaultSmartListsToCommonListContainer() {
    const commonListContainer = document.querySelector(".project-ul")

    ;[...document.querySelectorAll(".smart-project-view-area .project")]
        .reverse()
        .map(node => node.cloneNode(true))
        .forEach(defaultSmartList =>
            commonListContainer.prepend(defaultSmartList)
        )

    ;[...document.querySelectorAll("#project-list-scroller > section .project")]
        .map(node => node.cloneNode(true))
        .forEach(restDefaultSmartList =>
            commonListContainer.append(restDefaultSmartList)
        )
}

function makeListsResponsiveOnClick() {
    let
        listsAll = document
            .querySelector(".project-ul")
            .querySelectorAll(".project, .custom-smart-project, .f-header"),
        folderObserver

    listResponsiveClickHandler(listsAll)
    
    folderObserver = new MutationObserver(records => {
        let record = records[0],
            target = record.target,
            folderLists = target.querySelectorAll(".project")
        
        if (target.classList.contains("open")) {
            listResponsiveClickHandler(folderLists)            
        }
    })

    ;[...document.querySelectorAll(".l-folder")].forEach(folder => {
        folderObserver.observe(folder, {
            attributes: true
        })
    })  
}

function listResponsiveClickHandler(listsForHandler) {
    let
        listsAll = document
            .querySelector(".project-ul")
            .querySelectorAll(".project, .custom-smart-project, .f-header")

    listsForHandler.forEach(listForHandler => {
        listForHandler.addEventListener("click", e => {
            if (
                e.target.closest(".icon-more-for-folder") ||
                e.target.closest(".icon-chevron-folder-open")
            ) return

            listsAll.forEach(list => list.classList.remove("active"))
            e.currentTarget.classList.add("active")
        })
    })
}

function removeExcessNodes() {
    ;[...document.querySelectorAll(".l-divider")]
        .forEach(divider => divider.remove())

    document.querySelector(".l-new").remove()
}

function setClickOnProjectList() {
    document
        .querySelector(".project-list-inner")
        .addEventListener("click", e => {
            if (e.isTrusted === false) return
            listMovingStop()
        })
}

function setListMovingHandler() {
    window.addEventListener("keydown", listMovingHandler)
}

function listMovingHandler(e) {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyE" &&
        state.isListMoving === false
    ) {
        listMovingStart()
    }

    else if (e.ctrlKey && e.shiftKey && e.code === "KeyE" &&
            state.isListMoving === true
    ) {
        listMovingStop()
    }

    else if (e.code === "Enter" && state.isListMoving === true) {
        listMovingEnter()
    }

    else if (state.isListMoving && e.code === "ArrowUp") {
        let prevList = getPrevList()

        toggleActiveClass(prevList)
    }

    else if (state.isListMoving && e.code === "ArrowDown") {
        let nextList = getNextList()

        toggleActiveClass(nextList)
    }

    else if (state.isListMoving && e.code === "ArrowLeft") {
        foldFolder()
    }

    else if (state.isListMoving && e.code === "ArrowRight") {
        unfoldFolder()
    }
}

function listMovingStart() {
    if (state.isListMoving === true) return

    document.querySelector(".project-list-inner").classList.add("active")

    state.isListMoving = true
    setActiveElement()
}

function listMovingStop() {
    let listActiveElement

    if (state.isListMoving === false) return

    listActiveElement = findListActiveElement()

    listActiveElement?.classList.remove("active")
    state.savedListActiveElement?.classList.add("active")

    if (state.savedListActiveElement && findListActiveElement() === null) {
        document.querySelectorAll(".l-folder.open").forEach(folder => {
            folder.querySelector(".fold").click()
        })
    }

    document.querySelector(".project-list-inner").classList.remove("active")

    state.isListMoving = false
}

function listMovingEnter() {
    let
        listActiveElement = findListActiveElement(),
        listTitle = listActiveElement.querySelector(".l-title")

    listTitle.click()

    document.querySelector(".project-list-inner").classList.remove("active")

    state.isListMoving = false
}

function setActiveElement() {
    let
        activeElement = findListActiveElement(),
        folders = document.querySelectorAll(".l-folder"),
        taskView = document.querySelector("#task-list-view"),
        activeChildren

    if (taskView?.classList.contains("search")) {
        state.savedListActiveElement = activeElement
        activeElement =
            document.querySelector(".custom-smart-project, .project, .f-header")
        activeElement.classList.add("active")
    }
    else if (activeElement === null) {
        folders.forEach(folder => {
            if (activeChildren) return

            folder.querySelector(".fold").click()

            activeChildren = folder.querySelector(".project.active")

            if (activeChildren) return

            folder.querySelector(".fold").click()
        })

        state.savedListActiveElement = activeChildren
    } else {
        state.savedListActiveElement = activeElement
    }
}

function getPrevList() {
    let currentList = getCurrentList(), prevList, parentList, childrenList

    if (currentList === null) return

    prevList = currentList.previousElementSibling
    parentList = currentList.closest(".l-folder")

    if (prevList?.classList.contains("l-folder") &&
        prevList?.classList.contains("open")
    ) {
        childrenList = prevList.querySelector(".project:last-child")

        if (childrenList) prevList = childrenList
    }

    if (prevList === null && parentList && parentList !== currentList) {
        prevList = parentList
    }

    return prevList
}

function getNextList() {
    let currentList = getCurrentList(), nextList, parentList, childrenList

    if (currentList === null) return

    nextList = currentList.nextElementSibling
    parentList = currentList.closest(".l-folder")

    if (currentList.classList.contains("l-folder") &&
        currentList.classList.contains("open")
    ) {
        childrenList = currentList.querySelector(".project")

        if (childrenList) nextList = childrenList
    }

    if (nextList === null && parentList && parentList !== currentList) {
        nextList = parentList.nextElementSibling
    }

    return nextList
}

function getCurrentList() {
    let currentList = findListActiveElement()

    if (currentList?.classList.contains("f-header")) {
        currentList = currentList.closest(".l-folder")
    }

    return currentList
}

function findListActiveElement() {
    return document.querySelector(".project-ul").querySelector(
        ".custom-smart-project.active, .project.active, .f-header.active"
    )
}

function toggleActiveClass(newActiveList) {
    let
        activeElement = findListActiveElement(),
        newActiveElement

    if (newActiveList === null || activeElement === null) return

    activeElement.classList.remove("active")

    newActiveElement = newActiveList

    if (newActiveList.classList.contains("l-folder")) {
        newActiveElement = newActiveList.querySelector(".f-header")
    }

    newActiveElement.classList.add("active")
}

function foldFolder() {
    let currentList = getCurrentList(), parentList

    if (currentList.classList.contains("l-folder") &&
        currentList.classList.contains("open")
    ) {
        currentList.querySelector(".fold").click()
    } else {
        parentList = currentList.closest(".l-folder")

        if (parentList) toggleActiveClass(parentList)
    }
}

function unfoldFolder() {
    let currentList = getCurrentList()

    if (currentList.classList.contains("l-folder") &&
        !currentList.classList.contains("open")
    ) {
        currentList.querySelector(".fold").click()
        ;[...currentList.querySelectorAll(".project")].forEach(node => {
            node.classList.remove("active")
        })
    }
}
