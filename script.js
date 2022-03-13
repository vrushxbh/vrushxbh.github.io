const video = document.querySelector("video")
const textElement = document.querySelector("[data-text]")
const playButton = document.getElementById("play-button")
const pauseButton = document.getElementById("pause-button")
const stopButton = document.getElementById("stop-button")
const speedInput = document.getElementById("speed")
const textInput = document.getElementById("text")
let currentCharacter

async function setup() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = stream

    video.addEventListener("playing", async () => {
        const worker = Tesseract.createWorker()
        await worker.load()
        await worker.loadLanguage("eng")
        await worker.initialize("eng")

        const canvas = document.createElement("canvas")
        canvas.width = video.width
        canvas.height = video.height

        document.addEventListener("keypress", async e => {
            if (e.code !== "Space") return
            canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height)
            const {
                 data: { text },
            } = await worker.recognize(canvas)
            textInput.disabled = false
            //speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, " ")))

            textElement.textContent = text

            playButton.addEventListener("click", () => {
                playText(textInput.value.replace(/\s/g, " "))
            })

            pauseButton.addEventListener("click", pauseText)
            stopButton.addEventListener("click", stopText)
            speedInput.addEventListener("input", () => {
                stopText()
                playText(utterence.text.substring(currentCharacter))
            })
        })

        
        
    })
}

const utterence = new SpeechSynthesisUtterance()
utterence.addEventListener("end", () => {
    textInput.disabled = false
})
utterence.addEventListener("boundary", e => {
    currentCharacter = e.charIndex
})

function playText(text) {
    
    if (speechSynthesis.paused && speechSynthesis.speaking) {
        return speechSynthesis.resume()
    }
    utterence.text = text
    utterence.rate = speedInput.value || 1
    textInput.disabled = true
    speechSynthesis.speak(utterence)
}

function pauseText() {
    if(speechSynthesis.speaking) speechSynthesis.pause()
}

function stopText() {
    speechSynthesis.resume()
    speechSynthesis.cancel()
}

setup()