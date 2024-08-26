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
        }
    }

    const cleanBoard = function() {
        board.forEach((cell) => cell.setValue(null))
    }

    return {getBoard, cleanBoard};
};

const GameController = (function() {
    const gameboard = buildBoard()

    const mark = function(col, row) {
        const cell = gameboard.getBoard().find((cell) => cell.getCol() == col && cell.getRow() == row)
                
        if (cell.getValue() == null) {
            cell.setValue(currentPlayer)
            console.log(`Col:${col} Row:${row} set to ${currentPlayer}`)
            if (checkWin(col, row)) {
                giveWin()
            }
            switchPlayer()
        }
        else {
            console.log('Cell already marked')
        }
    }

    const checkWin = function(col, row) {
        const searchCol = (function() {
            const thisCol = gameboard.getBoard().filter((cell) => cell.getCol() == col)
            return thisCol.every((cell) => cell.getValue() == currentPlayer)
        })()

        const searchRow = (function() {
            const thisRow = gameboard.getBoard().filter((cell) => cell.getRow() == row)
            return thisRow.every((cell) => cell.getValue() == currentPlayer)
        })()

        const searchDiagonal = (function() {
            const thisDiagonal = []
            for (let i = 1; i <= 3; i++) {
                thisDiagonal.push(gameboard.getBoard().find((cell) => cell.getCol() == i && cell.getRow() == i))
            }
            return thisDiagonal.every((cell) => cell.getValue() == currentPlayer)
        })()

        const searchOtherDiagonal = (function() {
            const otherDiagonal = []
            for (let i = 1, j = 3; i <= 3 && j >= 1; i++, j--) {
                otherDiagonal.push(gameboard.getBoard().find((cell) => cell.getCol() == j && cell.getRow() == i))
            }
            return otherDiagonal.every((cell) => cell.getValue() == currentPlayer)
        })()
        
        return searchCol || searchRow || searchDiagonal || searchOtherDiagonal
    }

    let currentPlayer = "x"
    const switchPlayer = function() {
        currentPlayer = (currentPlayer == "x") ? "o" : "x"
        console.log(`It's now ${currentPlayer}'s turn`)
    }

    let playerXWins = 0
    let playerOWins = 0
    const giveWin = function() {
        console.log(`${currentPlayer} won!`)
        if (currentPlayer == "x") playerXWins++
        else playerOWins++
        gameboard.cleanBoard()
    }

    return {gameboard, mark}
})();