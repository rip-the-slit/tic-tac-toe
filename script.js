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

    const mark = function(player, col, row) {
        board.forEach((cell) => {
            if (cell.col == col && cell.row == row) {
                cell.value = player
            }
        })
        return checkWin(player, col, row)
    }

    const checkWin = function(player, col, row) {
        const searchCol = (function() {
            const thisCol = board.filter((cell) => cell.col == col)
            return thisCol.every((cell) => cell.value == player)
        })()

        const searchRow = (function() {
            const thisRow = board.filter((cell) => cell.row == row)
            return thisRow.every((cell) => cell.value == player)
        })()

        const searchDiagonal = (function() {
            const thisDiagonal = []
            for (let i = 1; i <= 3; i++) {
                thisDiagonal.push(board.find((cell) => cell.col == i && cell.row == i))
            }
            return thisDiagonal.every((cell) => cell.value == player)
        })()

        const searchOtherDiagonal = (function() {
            const otherDiagonal = []
            for (let i = 1, j = 3; i <= 3 && j >= 1; i++, j--) {
                otherDiagonal.push(board.find((cell) => cell.col == j && cell.row == i))
            }
            return otherDiagonal.every((cell) => cell.value == player)
        })()
        
        return searchCol || searchRow || searchDiagonal || searchOtherDiagonal
    }

    return {board, mark}
})();