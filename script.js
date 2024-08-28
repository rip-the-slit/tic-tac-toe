const buildBoard = function() {
    const board = []
    const getBoard = function() {return board}

    const Cell = function(col, row) {
        let value = null
        const getCol = function() {return col}
        const getRow = function() {return row}
        const getValue = function() {return value}
        const setValue = function(newValue) {value = newValue}
        return {getCol, getRow, getValue, setValue}
    }

    for(let col = 1; col <= 3; col++) {
        for (let row = 1; row <= 3; row++) {
            board.push(Cell(col, row))
            Display.addCellToContainer(col, row)
        }
    }

    let boardFull = false
    const checkBoardFull = function() {
        if (board.every((cell) => cell.getValue() !== null)) {
            boardFull = true
            toggleGameDone()
        } else boardFull = false
        return boardFull
    }
    let gameDone = false
    const getGameDone = function() {return gameDone}
    const toggleGameDone = function() {
        gameDone = true
    }

    return {getBoard, checkBoardFull, getGameDone, toggleGameDone};
};

const Display = (function() {
    const boardContainer = document.querySelector('.board-container')
    const status = document.querySelector('.status')
    const counters = document.querySelectorAll('.win-counters span')
    const inputs = document.querySelectorAll('.win-counters input')
    const restartButton = document.querySelector('.restart')
    const addCellToContainer = function(col, row) {
        const div = document.createElement('div')
        div.classList += 'cell'
        div.setAttribute('col', `${col}`)
        div.setAttribute('row', `${row}`)
        bindEvent(div, callController)
        boardContainer.appendChild(div)
    }
    const bindEvent = function(div, callback) {
        div.addEventListener('click', callback)
    }
    const callController = function(event) {
        if (animationRunning) {
            stopAnimation()
            updateStatus(`${GameController.getCurrentPlayer(true)} begins`, false)
        }
        else {
            if (!(event.target.getAttribute('value'))) {
                event.target.setAttribute('value', `${GameController.getCurrentPlayer()}`)
            }
            const col = +(event.target.getAttribute('col'))
            const row = +(event.target.getAttribute('row'))
            GameController.mark(col, row)
        }
    }
    const cleanContainer = function() {
        while (boardContainer.firstChild) {
            boardContainer.removeChild(boardContainer.firstChild)
        }
    }
    const updateStatus = function(text, importance) {
        if (text !== '') {status.textContent = text}
        status.setAttribute('important', `${importance}`)
    }
    const checkStatusImportance = function() {
        return status.getAttribute('important')
    }
    const animation = (function() {
        const cells = boardContainer.childNodes
        let index = 0
        let mark = 'x'
        const interval = setInterval(() => {
            if ((Math.random()) > 0.5) {
                mark = 'o'
            } else {mark = 'x'}
            if (index > 8) {index = 0}
            if (cells[index - 5]) {
                cells[index - 5].setAttribute('value', '')
            }
            if (index < 5) {
                cells[index + 4].setAttribute('value', '')
            }
            cells[index].setAttribute('value', `${mark}`)
            index++
        }, 350);
        return interval
    })()
    const stopAnimation = function() {
        clearInterval(animation)
        fakeCleanContainer()
        animationRunning = false
    }
    const fakeCleanContainer = function() {
        boardContainer.childNodes.forEach((cell) => {
            cell.setAttribute('value', '')
        })
    }
    let animationRunning = true
    const updateWins = function(mark, count) {
        if (mark == 'x') {
            counters[0].textContent = count
        } else {
            counters[1].textContent = count
        }
    }
    const getNames = function(mark) {
        if (mark == 'x') {return inputs[0].value}
        else {return inputs[1].value}
    }
    const restartController = function() {
        if (animationRunning) {stopAnimation()}
        else {fakeCleanContainer()}
        GameController.refreshBoard()
        updateStatus(`${GameController.getCurrentPlayer(true)} begins`, false)
    }
    bindEvent(restartButton, restartController)

    
    return {addCellToContainer, cleanContainer, updateStatus, checkStatusImportance, updateWins,
            getNames}
})();

const GameController = (function() {
    let gameboard = buildBoard()
    const refreshBoard = function() {
        gameboard = buildBoard()
    }
    const Player = function(mark) {
        const getMark = function() {return mark}
        let name = mark
        const updateName = function() {
            name = Display.getNames(mark)
        }
        const getName = function() {
            updateName()
            return name
        }
        let wins = 0
        const incrementWins = function() {
            wins++
            Display.updateWins(mark, wins)
        }
        return {getMark, incrementWins, getName}
    }
    const playerX = Player('x')
    const playerO = Player('o')
    const mark = function(col, row) {
        if(gameboard.getGameDone()) {
            Display.cleanContainer()
            Display.updateStatus('')
            refreshBoard()
        } else {
            const cell = gameboard.getBoard().find((cell) => cell.getCol() == col && cell.getRow() == row)        
            if (cell.getValue() == null) {
                cell.setValue(currentPlayer.getMark())
                console.log(`Col:${col} Row:${row} set to ${currentPlayer.getMark()}`)
                if (checkWin(col, row)) {
                    giveWin()
                } else if (gameboard.checkBoardFull()) {
                    Display.updateStatus('Nobody won', 'win')
                }
                switchPlayer()
            }
        }
    }
    const checkWin = function(col, row) {
        const searchCol = (function() {
            const thisCol = gameboard.getBoard().filter((cell) => cell.getCol() == col)
            return thisCol.every((cell) => cell.getValue() == currentPlayer.getMark())
        })()

        const searchRow = (function() {
            const thisRow = gameboard.getBoard().filter((cell) => cell.getRow() == row)
            return thisRow.every((cell) => cell.getValue() == currentPlayer.getMark())
        })()

        const searchDiagonal = (function() {
            const thisDiagonal = []
            for (let i = 1; i <= 3; i++) {
                thisDiagonal.push(gameboard.getBoard().find((cell) => cell.getCol() == i && cell.getRow() == i))
            }
            return thisDiagonal.every((cell) => cell.getValue() == currentPlayer.getMark())
        })()

        const searchOtherDiagonal = (function() {
            const otherDiagonal = []
            for (let i = 1, j = 3; i <= 3 && j >= 1; i++, j--) {
                otherDiagonal.push(gameboard.getBoard().find((cell) => cell.getCol() == j && cell.getRow() == i))
            }
            return otherDiagonal.every((cell) => cell.getValue() == currentPlayer.getMark())
        })()
        
        return searchCol || searchRow || searchDiagonal || searchOtherDiagonal
    }
    let currentPlayer = playerX
    const getCurrentPlayer = function(name) {
        if(name) {return currentPlayer.getName()}
        else {return currentPlayer.getMark()}
    }
    const switchPlayer = function() {
        currentPlayer = (currentPlayer.getMark() == "x") ? playerO : playerX
        if (Display.checkStatusImportance() !== 'win') {
            Display.updateStatus(`It's now ${currentPlayer.getName()}'s turn`, true)
        } else {Display.updateStatus('', false)}
    }
    const giveWin = function() {
        Display.updateStatus(`${currentPlayer.getName()} won!`, 'win')
        currentPlayer.incrementWins()
        gameboard.toggleGameDone()
    }

    return {mark, getCurrentPlayer, refreshBoard}
})();