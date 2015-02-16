
var Game = (function() { 
    var me = {};

    var repeat = function(n, func) {
        for (var i = 0; i < n; ++i) {
            func();
        }
    };

    var dim = 3;
    
    // Make board a dim x dim array of blanks.
    var board = [];
    var clearBoard = function(b) {
        b.length = 0;
        repeat(dim, function() {
            var column = []
            repeat(dim, function() {
                column.push(blank);
            });
            board.push(column);
        });
    }
    clearBoard(board);

    var whoMoves = ex;
    var whoseMove = function() {
        return whoMoves;
    };
    var nextMove = function() {
        if (whoMoves === ex) {
            whoMoves = oh;
        }
        else {
            assert(whoMoves === oh);
            whoMoves = ex;
        }
    };

    var get = function(x, y) {
        return board[x][y];
    };

    var move = function(x, y) {
        // TODO: Validity checking and return value.
        board[x][y] = whoMoves;
        nextMove();
    }

    var reset = function() {
        clearBoard(board);
    };

    me.get = get;
    me.move = move;
    me.whoseMove = whoseMove;
    me.reset = reset;
    return me;
})();

