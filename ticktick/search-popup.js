const store = {
    searchFormSpy: null,
    searchForm: null,
    searchInput: null,
    appContainer: null,
}

new MutationObserver(appShowUpHandler)
    .observe(document.querySelector("#root"), {
        childList: true
    })

function appShowUpHandler() {
    fillStore()
    setSearchPopupHandler()
    setSearchInputHandlers()
}

function fillStore() {
    store.searchForm = document.querySelector(".search-form")
    store.searchInput = document.querySelector(".search-box")
    store.appContainer = document.querySelector("#container-main")
}

function setSearchPopupHandler() {
    window.addEventListener("keydown", e => {
        if (e.ctrlKey && e.code === "KeyE") {            
            const isPopupOpen = store.searchForm.classList.contains("popup")

            e.preventDefault()

            store.searchInput.blur()

            if (!isPopupOpen) {
                handleSearchPopup()
            }
        }
    })
}

function handleSearchPopup() {
    store.searchFormSpy = spyForSearchForm()
    searchFormAddClasses()
    processSearchInput()
}

function spyForSearchForm() {
    const spy = new MutationObserver(processSearchFormDynamicElements)

    processSearchFormDynamicElements()
    
    spy.observe(store.searchForm, { childList: true })

    return spy
}

function processSearchFormDynamicElements() {
    let 
        searchSuggest = document.querySelector(".search-suggest"),
        searchClose = document.querySelector(".delete.fake-del")
     
    if (searchSuggest) {
        searchSuggest.style = `
            right: auto;
            top: 50px;
        `

        searchClose.style = `
            display: none;
        `            
    }
}

function searchFormAddClasses() {
    store.searchForm.classList.remove("inactive")
    store.searchForm.classList.add("active")
    store.searchForm.classList.add("global-quick-add")
    store.searchForm.classList.add("popup")
    store.searchForm.classList.add("popup-extension")
}

function searchFormRemoveClasses() {
    store.searchForm.classList.remove("global-quick-add")
    store.searchForm.classList.remove("popup")
    store.searchForm.classList.remove("popup-extension")
    store.searchForm.classList.remove("active")
    store.searchForm.classList.add("inactive")
}

function processSearchInput() {
    store.searchInput.value = ""
    store.searchInput.style = `
        position: static;
    `
    store.searchInput.focus()
}

function setSearchInputHandlers() {
    store.searchInput.addEventListener("focus", searchInputFocusHandler)
    store.searchInput.addEventListener("blur", searchInputBlurHandler)
    store.searchInput.addEventListener("input", searchInputInputHandler)
    store.searchInput.addEventListener("keydown", searchInputKeydownHandler)
}

function searchInputFocusHandler() {
    let searchSuggest = document.querySelector(".search-suggest")

    store.searchInput.value = ""

    if (searchSuggest) {
        searchSuggest.classList.add("d-none")
    }
}

function searchInputBlurHandler() {
    store.searchInput.style = ""
    
    searchFormRemoveClasses()        

    store.appContainer.dispatchEvent(new Event("click", { bubbles: true }))

    if (store.searchFormSpy) {
        store.searchFormSpy.disconnect()
    }
}

function searchInputInputHandler() {
    let searchSuggest = document.querySelector(".search-suggest")

    if (searchSuggest) {
        searchSuggest.classList.remove("d-none")
    }
}

function searchInputKeydownHandler(e) {
    if (e.code === "Enter") {
        store.searchInput.blur()
    }
}
