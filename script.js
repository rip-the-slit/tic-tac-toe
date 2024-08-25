const buildBoard = function() {
    const board = []

    const Cell = function(col, row) {
        let value = null
        return {col, row, value}
    }

    for(let col = 1; col <= 3; col++) {
        for (let row = 1; row <= 3; row++) {
            board.push(Cell(col, row))
        }
    }

    return board;
};

const GameController = (function() {
    const board = buildBoard()

    const mark = function(col, row) {
        board.forEach((cell) => {
            if (cell.col == col && cell.row == row) {
                cell.value = currentPlayer
            }
        })
        checkWin(col, row)
        switchPlayer()
    }

    const checkWin = function(col, row) {
        const searchCol = (function() {
            const thisCol = board.filter((cell) => cell.col == col)
            return thisCol.every((cell) => cell.value == currentPlayer)
        })()

        const searchRow = (function() {
            const thisRow = board.filter((cell) => cell.row == row)
            return thisRow.every((cell) => cell.value == currentPlayer)
        })()

        const searchDiagonal = (function() {
            const thisDiagonal = []
            for (let i = 1; i <= 3; i++) {
                thisDiagonal.push(board.find((cell) => cell.col == i && cell.row == i))
            }
            return thisDiagonal.every((cell) => cell.value == currentPlayer)
        })()

        const searchOtherDiagonal = (function() {
            const otherDiagonal = []
            for (let i = 1, j = 3; i <= 3 && j >= 1; i++, j--) {
                otherDiagonal.push(board.find((cell) => cell.col == j && cell.row == i))
            }
            return otherDiagonal.every((cell) => cell.value == currentPlayer)
        })()
        
        return searchCol || searchRow || searchDiagonal || searchOtherDiagonal
    }

    let currentPlayer = "x"

    const switchPlayer = function() {
        currentPlayer = (currentPlayer == "x") ? "o" : "x"
    }

    return {board, mark}
})();