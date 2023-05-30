//variável do grid
const gridWidth = 10
//variáveis dos audios
const shapeFreezeAudio = new Audio("./audios/audios_tetraminoFreeze.wav")
const completedLineAudio = new Audio("./audios/audios_completedLine.wav")
const gameOverAudio = new Audio("./audios/audios_gameOver.wav")

//Aqui ficará os shapes dos elementos
const l1Shape = [
    [1, 2, gridWidth + 1, gridWidth*2 +1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth*2 + 2], 
    [1, gridWidth + 1, gridWidth*2,  gridWidth*2 + 1 ],
    [gridWidth, gridWidth*2, gridWidth*2 + 1, gridWidth*2 + 2]
]

const l2Shape = [
    [1, gridWidth + 1, gridWidth*2, gridWidth*2 + 1 ],
    [0, gridWidth, gridWidth + 1, gridWidth + 2],
    [0, 1, gridWidth, gridWidth*2],
    [0, 1, 2, gridWidth + 2]
]

const z1Shape = [
    [1, gridWidth, gridWidth + 1, gridWidth*2],
    [0, 1, gridWidth + 1, gridWidth + 2],
    [1, gridWidth, gridWidth + 1, gridWidth*2],
    [0, 1, gridWidth + 1, gridWidth + 2]
]

const z2Shape = [
    [0, gridWidth, gridWidth + 1, gridWidth*2 + 1],
    [1, 2, gridWidth, gridWidth + 1],
    [0, gridWidth, gridWidth + 1, gridWidth*2 + 1],
    [1, 2, gridWidth, gridWidth + 1]
]

const tShape = [
    [1, gridWidth, gridWidth + 1, gridWidth + 2],
    [0, gridWidth, gridWidth + 1, gridWidth*2],
    [0, 1, 2, gridWidth + 1],
    [1, gridWidth, gridWidth + 1, gridWidth*2 + 1]
]

const oShape = [
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1]
]

const iShape = [
    [0, gridWidth, gridWidth*2, gridWidth*3],
    [0, 1, 2, 3],
    [0, gridWidth, gridWidth*2, gridWidth*3],
    [0, 1, 2, 3]
]

const allShapes = [l1Shape, l2Shape, z1Shape, z2Shape, tShape, oShape, iShape]

const colors = ["blue", "yellow", "red", "orange", "cian", "green", "purple"]
let currentColor = Math.floor(Math.random() * colors.length)
let nextColor = Math.floor(Math.random() * colors.length)

//Aqui vem a aleatorização de elementos, e posição
let currentPosition = 4
let currentRotation = 0
let randomShape = Math.floor(Math.random() * allShapes.length)
let currentShape = allShapes[randomShape][currentRotation]
let $gridSquares = Array.from(document.querySelectorAll(".grid div"))

function draw() {
    currentShape.forEach(squareIndex => {
      $gridSquares[squareIndex + currentPosition].classList.add("shapePainted", `${colors[currentColor]}`)
    })
}
draw()

function undraw() {
    currentShape.forEach(squareIndex => {
      $gridSquares[squareIndex + currentPosition].classList.remove("shapePainted", `${colors[currentColor]}`)
    })
}

const $restartButton = document.getElementById("restart-button")
$restartButton.addEventListener("click", () => {
    window.location.reload()
})

//setInterval(moveDown, 500)
let timeMoveDown = 600
let timerId = null
const $startStopButton = document.getElementById("start-button")
$startStopButton.addEventListener("click", () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        timerId = setInterval(moveDown, timeMoveDown)
    }
})

function moveDown() {
    freeze()

    undraw()
    currentPosition += 10
    draw()
}

function freeze() {
    if (currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + gridWidth].classList.contains("filled")
    )) {
        currentShape.forEach(squareIndex => $gridSquares[squareIndex + currentPosition].classList.add("filled"))
       
        currentPosition = 4
        currentRotation = 0
        randomShape = nextRandomShape
        currentShape = allShapes[randomShape][currentRotation]
        currentColor = nextColor
        draw()

        checkIfRowIsFilled()

        updateScore(13)

        shapeFreezeAudio.play()

        displayNextShape()

        gameOver()
    }
}

function moveLeft() {
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
    if (isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition - 1].classList.contains("filled")
        )
    if (isFilled) return

    undraw()
    currentPosition--
    draw()
}

function moveRight() {
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === gridWidth - 1)
    if (isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + 1].classList.contains("filled") 
    ) 
    if (isFilled) return
    
    undraw()
    currentPosition++
    draw()
}

function previousRotation() {
    if (currentShape == 0) {
        currentRotation = currentShape.length - 1
    } else {
        currentRotation--
    }

    currentShape = allShapes[randomShape][currentRotation]
}

function rotate() {
    undraw()

    if (currentRotation == currentShape.length - 1) {
        currentRotation = 0
    } else {
        currentRotation++
    }

    currentShape = allShapes[randomShape][currentRotation]

    const isLeftEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth == 0)
    const isRightEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth == gridWidth - 1)
    if(isLeftEdgeLimit && isRightEdgeLimit) {
        previousRotation()
    }


    const isFilled = currentShape.some(squareIndex => 
        $gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )
    if (isFilled) {
        previousRotation()
    }
    

    draw()
}

let $grid = document.querySelector(".grid")

function checkIfRowIsFilled () {
    for (var row = 0; row < $gridSquares.length; row += gridWidth){
        let currentRow = []

        for (var square = row; square < row + gridWidth; square++ ) {
            currentRow.push(square)
        }

        const isRowPainted = currentRow.every(square =>
            $gridSquares[square].classList.contains("shapePainted")    
        )

        if (isRowPainted) {
            const squaresRemoved = $gridSquares.splice(row, gridWidth)
            squaresRemoved.forEach(square => 
                square.removeAttribute("class")
            )
            $gridSquares = squaresRemoved.concat($gridSquares)
            $gridSquares.forEach(square => $grid.appendChild(square))
            
            updateScore(97)

            completedLineAudio.play()
        }
    }
}

const $miniGridSquares = document.querySelectorAll(".mini-grid div")
const miniGridWidth = 6
const nextPosition = 2
const possibleNextShapes = [
    [1, 2, miniGridWidth + 1, miniGridWidth*2 +1],
    [1, miniGridWidth + 1, miniGridWidth*2, miniGridWidth*2 + 1 ],
    [1, miniGridWidth, miniGridWidth + 1, miniGridWidth*2],
    [0, miniGridWidth, miniGridWidth + 1, miniGridWidth*2 + 1],
    [1, miniGridWidth, miniGridWidth + 1, miniGridWidth + 2],
    [0, 1, miniGridWidth, miniGridWidth + 1],
    [0, miniGridWidth, miniGridWidth*2, miniGridWidth*3]
]

let nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)

function displayNextShape() {
    $miniGridSquares.forEach(square => square.classList.remove("shapePainted", `${colors[nextColor]}`))
    nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
    nextColor = Math.floor(Math.random() * colors.length)
    const nextShape = possibleNextShapes[nextRandomShape]
    nextShape.forEach(squareIndex => 
        $miniGridSquares[squareIndex + nextPosition + miniGridWidth].classList.add("shapePainted", `${colors[nextColor]}`)
    )
}
displayNextShape()

const $score = document.querySelector(".score")
let score = 0
function updateScore(updateValue) {
    score += updateValue
    $score.textContent = score

    clearInterval(timerId)
    if(score <= 450) {
        timeMoveDown = 500;
    } else if(450 < score && score <= 1000) {
        timeMoveDown = 400;
    } else if(100 < score && score <= 1700) {
        timeMoveDown = 300;
    }

    timerId = setInterval(moveDown, timeMoveDown)
}

function gameOver() {
    if (currentShape.some(squareIndex => 
        $gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )) {
        updateScore(-13)
        clearInterval(timerId)
        timerId = null
        $startStopButton.disabled = true
        gameOverAudio.play()
        $score.innerHTML += "<br />" + "Game Over"
    }
}

document.addEventListener("keydown", controlkeyboard)

function controlkeyboard(event) {
    if (timerId){
        if (event.key == "ArrowLeft") {
            moveLeft()
        } else if (event.key == "ArrowRight") {
            moveRight()
        } else if (event.key == "ArrowDown") {
            moveDown()
        } else if (event.key == "ArrowUp") {
            rotate()
        }
    }
    
}




