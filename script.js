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
        return board
    }

    return {b, mark}
})();