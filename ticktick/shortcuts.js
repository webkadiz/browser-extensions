new MutationObserver(appShowUpHandler).observe(
	document.querySelector("#root"),
	{
		childList: true
	}
)

window.addEventListener("keydown", (e) => {
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
			if (document.querySelector(".CodeMirror textarea")) {
				setTaskInputMovingHandler()
				document.querySelector(".CodeMirror textarea").focus()
			}
		}
		if (e.code === "KeyD") {
			// focus on editor
			e.preventDefault()
			if (document.querySelectorAll(".CodeMirror textarea")[2])
				document.querySelectorAll(".CodeMirror textarea")[2].focus()
		}
	}
})

function appShowUpHandler() {
	setTaskInputMovingHandler()
}

function setTaskInputMovingHandler() {
	let codeMirror = document.querySelector(".CodeMirror textarea"),
		taskInput = document.querySelector(".task-input")

	if (taskInput && codeMirror.onfocus === null) {
		codeMirror.onfocus = () => {
			console.log("focus")
			document.querySelector(".task-input").classList.add("focus")
			document.querySelector(".task.active")?.classList.remove("active")
			document
				.querySelector(".task.selected")
				?.classList.remove("selected")
			window.addEventListener("keydown", taskInputMovingHandler)
		}
	}
}

function taskInputMovingHandler(e) {
	if (e.code === "ArrowDown") {
		document.querySelector(".task").classList.add("active")
		document.querySelector(".task").classList.add("selected")
		document.querySelector(".task .inline-editor div").focus()

		document.querySelector(".task-input").classList.remove("focus")
		window.removeEventListener("keydown", taskInputMovingHandler)
	}
}
