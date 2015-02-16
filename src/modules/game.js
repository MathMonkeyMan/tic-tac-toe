/*
    Tic-Tac-Toe web browser game
    Copyright (C) 2015 David Goffredo

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

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

