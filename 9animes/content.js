window.addEventListener("load", () => {
	let bodyContainer = document.querySelector("#body-container"),
		sidebar = document.querySelector("#sidebar"),
		main = document.querySelector("#main")

	if (bodyContainer && main && sidebar) {
		bodyContainer.style["width"] = "1400px"
		bodyContainer.style["max-width"] = "1400px"
		main.style["padding-right"] = 0
		sidebar.remove()
	}
})
