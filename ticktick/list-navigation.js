new MutationObserver(appShowUpHandler)
    .observe(document.querySelector("#root"), {
        childList: true
    })

function appShowUpHandler() {

    addCustomSmartListsToCommonListContainer()
    addDefaultSmartListsToCommonListContainer()
    makeListsResponsiveOnClick()
    removeExcessNodes()

    this.disconnect()
}

function addCustomSmartListsToCommonListContainer() {
    let commonListTab,
        customListTab,
        customSmartLists,
        commonListContainer

    commonListTab = document.querySelectorAll(".l-tab .text-def")[0]
    customListTab = document.querySelectorAll(".l-tab .text-def")[2]

    customListTab.click()
    
    customSmartLists = 
        [...document.querySelectorAll(".custom-smart-project")]
            .reverse()
            .map(smartList => smartList.cloneNode(true))
    
    commonListTab.click()

    commonListContainer = document.querySelector(".project-ul")

    customSmartLists
        .forEach(customSmartList => commonListContainer.prepend(customSmartList))
}

function addDefaultSmartListsToCommonListContainer() {
    const commonListContainer = document.querySelector(".project-ul")

    ;[...document.querySelectorAll(".smart-project-view-area .project")].reverse()
        .forEach(defaultSmartList => commonListContainer.prepend(defaultSmartList))

    ;[...document.querySelectorAll("#project-list-scroller > section .project")]
        .forEach(restDefaultSmartList => commonListContainer.append(restDefaultSmartList))
}

function makeListsResponsiveOnClick() {
    let listsAll = document.querySelectorAll(".project, .custom-smart-project, l-folder"),
        folderObserver

    listResponsiveClickHandler(listsAll)
    
    folderObserver = new MutationObserver(records => {
        let record = records[0],
            target = record.target
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
    let listsAll = document.querySelectorAll(".project, .custom-smart-project, l-folder")

    listsForHandler.forEach(listForHandler => {
        listForHandler.addEventListener("click", e => {
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
