
var Game = (function() { 
    var me = {};

    var repeat = function(n, func) {
        for (var i = 0; i < n; ++i) {
            func();
        }
    };

    // Make board a Core.dim by Core.dim array of blanks.
    var board = [];
    var clearBoard = function(b) {
        b.length = 0;
        repeat(Core.dim, function() {
            var column = []
            repeat(Core.dim, function() {
                column.push(Core.blank);
            });
            board.push(column);
        });
    }
    clearBoard(board);

    var whoMoves = Core.ex;
    var whoseMove = function() {
        return whoMoves;
    };
    var nextMove = function() {
        if (whoMoves === Core.ex) {
            whoMoves = Core.oh;
        }
        else {
            assert(whoMoves === Core.oh);
            whoMoves = Core.ex;
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

