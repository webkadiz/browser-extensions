new MutationObserver(appShowUpHandler)
    .observe(document.querySelector("#root"), {
        childList: true
    })

function appShowUpHandler() {
    const pomoContainer = document.querySelector("#left-bottom-view")

    pomoContainer.prepend(timerContainer)

    this.disconnect()
}

let startTime
let endTime
let timePassed = 0
let timerInterval
let requestPayload

const timerContainer = document.createElement("div")
const styles = `
<style>

    .my-timer {
        padding: 12px 24px 12px 24px;    
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--theme-pomotimer-bg);
    }

    .my-timer .time {
        font-size: 18px;
        color: var(--theme-pomotimer-time-color);
    }

    .icon-panel {
        display: flex;
        width: auto;
        height: auto;
    }

    .icon-container {
        color: var(--theme);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 28px;
        border: 2px solid rgba(75,111,222,.36);
        border-color: rgba(var(--theme-pomotimer-progress-color-rgb),.36);
        border-radius: 50%;
        cursor: pointer;
    }

    .icon-container:hover {
        border-color: rgba(var(--theme-pomotimer-progress-color-rgb),.48);
    }

    .icon-container-stop {
        margin-right: 10px;
    }

    .icon-play {
        width: 10px;
        height: 10px;
        padding-left: 2px;
        fill: var(--theme-pomotimer-progress-color);
    }

    .icon-stop {
        width: 10px;
        height: 10px;
        background: var(--theme-pomotimer-progress-color);
        border-radius: 2px;
    }

    .icon-pause {
        display: flex;
        justify-content: space-between;
        width: 10px;
        height: 10px;
    }

    .icon-pause::before, .icon-pause::after {
        content: "";
        width: 3px;
        background: var(--theme-pomotimer-progress-color);
        border-radius: 1px;
    }

    .grey-theme .my-timer {
        background-color: #e5e8ee;
    }
    
    .grey-theme .icon-container {
        border: 2px solid rgba(75,111,222,.36);
    }

    .grey-theme .icon-container:hover {
        border: 2px solid rgba(75,111,222,.48);
    }

    .grey-theme .icon-play {
        fill: #4b6fde; 
    }

    .grey-theme .icon-stop {
        background: #4b6fde;
    }

    .grey-theme .icon-pause::before, .grey-theme .icon-pause::after {
        background: #4b6fde;
    }

    .state-play .icon-pause {
        display: none;
    }

    .state-pause .icon-play {
        display: none;
    }
</style>
`
const layout = `
    <div class="time">00:00:00</div>
    <div class="icon-panel">
        <div class="icon-container icon-container-stop">
            <div class="icon-stop"></div> 
        </div>
        <div class="icon-container icon-container-play-pause state-play">
            <div class="icon-pause"></div>
            <svg viewBox="0 0 8 11" class="icon-play"><path d="M7.3,4.2c1,0.7,1,1.9,0,2.6l-5.4,3.9c-1,0.7-1.8,0.2-1.8-1V1.4c0-1.3,0.8-1.7,1.8-1L7.3,4.2L7.3,4.2z"></path></svg>
        </div>
    </div>
`

timerContainer.classList.add("my-timer")
timerContainer.innerHTML = styles + layout 

const timeEl = timerContainer.querySelector(".time")
const playPauseEl = timerContainer.querySelector(".icon-container-play-pause")
const stopEl = timerContainer.querySelector(".icon-container-stop")

function genTimeStr(seconds) {
    let hours, minutes

    hours = Math.floor(seconds / 3600)
    seconds -= hours * 3600
    minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60

    hours = String(hours).length === 1 ? "0" + hours : "" + hours
    minutes = String(minutes).length === 1 ? "0" + minutes : "" + minutes
    seconds = String(seconds).length === 1 ? "0" + seconds : "" + seconds

    return `${hours}:${minutes}:${seconds}`
}

function genTickTickTimeFormat(date) {
    let timeStr = date.toISOString()

    timeStr = timeStr.slice(0, timeStr.length - 1) + "+0000"

    console.log(timeStr)
    return timeStr
}

function genRequestPayload(startTime, endTime) {
    return JSON.stringify([
        {
            local: true,
            startTime: genTickTickTimeFormat(startTime),
            endTime: genTickTickTimeFormat(endTime),
            status: 1,
            id: "id",
            tasks: [
                {
                    startTime: genTickTickTimeFormat(startTime),
                    endTime: genTickTickTimeFormat(endTime)
                }
            ]
        }
    ])
}

function makeRequestToTickTickPomodoro() {
    requestPayload = genRequestPayload(startTime, endTime)

    fetch("/api/v2/batch/pomodoro", {
        method: "POST",
        body: requestPayload,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    }).then(res => {
        return res.json()
    }).then(data => {
        if (Object.keys(data.id2error).length !== 0) {
            alert("fetch pomodoro, returns not json")
            console.log(data)
        }
    }).catch(err => {
        alert("fetch pomodoro" + err)
    })
}

function startTimer() {
    startTime = new Date()

    playPauseEl.classList.remove("state-play")
    playPauseEl.classList.add("state-pause")

    timerInterval = setInterval(() => {
        timePassed += 1
        timeEl.innerHTML = genTimeStr(timePassed)
    }, 1000)
}

function endTimer() {
    if (playPauseEl.classList.contains("state-play")) return

    endTime = new Date()

    playPauseEl.classList.remove("state-pause")
    playPauseEl.classList.add("state-play")

    makeRequestToTickTickPomodoro()    

    clearInterval(timerInterval)
}

playPauseEl.addEventListener("click", () => {
    if (playPauseEl.classList.contains("state-play")) {
        startTimer()
    } else {
        endTimer() 
    }
})

stopEl.addEventListener("click", () => {
    timePassed = 0
    timeEl.innerHTML = genTimeStr(timePassed)

    playPauseEl.classList.remove("state-pause")
    playPauseEl.classList.add("state-play")
})

window.addEventListener("beforeunload", () => {
    endTimer()
})
