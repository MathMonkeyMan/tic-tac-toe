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

    var over = false;

    function repeat(n, func) {
        for (var i = 0; i < n; ++i) {
            func();
        }
    }

    // Make board a Core.dim by Core.dim array of blanks.
    // e.g. if Core.dim === 3, then board[1][1] is the center cell.
    //
    var board = [];
    function clearBoard(b) {
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
    
    function whoseMove() {
        return whoMoves;
    }

    function nextMove() {
        if (whoMoves === Core.ex) {
            whoMoves = Core.oh;
        }
        else {
            assert(whoMoves === Core.oh);
            whoMoves = Core.ex;
        }
    }

    function get(x, y) {
        return board[x][y];
    }

    function full() {
        return board.every(function(column) {
                return column.every(function(cell) {
                    return cell !== Core.blank;
                });
        });
    }

    function cellsEqual(points) {
        if (points.length === 0) {
            return true; // by definition
        }

        var first = points[0];
        var value = board[first.x][first.y];
        return points.every(function(point) {
            return board[point.x][point.y] === value;
        });
    }

    // returns { winner, winningSequence }
    //
    var checkForWin = (function() {
        var nums = Core.range(Core.dim);
        
        // Array comprehensions would be really nice here.
        var sequences = [];

        // columns and rows
        sequences = sequences.concat(nums.map(function(x) {
            return nums.map(function(y) {
                return {'x': x, 'y': y};
            });
        })).concat(nums.map(function(y) {
            return nums.map(function(x) {
                return {'x': x, 'y': y};
            });
        }));

        // backslash diagonal
        sequences.push(nums.map(function(i) {
            return { 'x': i, 'y': i };
        }));

        // forward slash diagonal
        sequences.push(nums.map(function(i) {
            return { 'x': i, 'y': Core.dim - i };
        }));

        sequences.forEach(function(seq) {
            assert(seq.length === Core.dim);
        });

        // A bit ugly, I admit.
        return function() {
            var winner;
            var winningSequence;
            if (sequences.some(function(seq) {
                    if (cellsEqual(seq)) {
                        var p = seq[0];
                        var value = board[p.x][p.y];
                        if (value === Core.ex || value === Core.oh) {
                            winner = value;
                            winningSequence = seq;
                            return true;
                        }
                    }
                    return false;
                })) {
                return {
                    "winner": winner,
                    "winningSequence": winningSequence
                };
            }
            else {
                return {};
            }
        };
    })();

    function move(x, y, canCheat) {
        assert(canCheat || board[x][y] === Core.blank);
          
        assert(!over);

        board[x][y] = whoMoves;

        var winInfo = checkForWin();
        if (winInfo.winner) {
            over = true;
            return {
                gameOver: true,
                winner: winInfo.winner,
                winningSequence: winInfo.winningSequence
            };
        }
        else if (full()) {
            over = true;
            return {
                gameOver: true
            };
        }
        else {
            nextMove();
            return {};
        }
    }

    function reset() {
        clearBoard(board);
        whoMoves = Core.ex;
        over = false;
    }

    function boardKey() {
        key = '';
        Core.range(Core.dim).forEach(function(y) {
            Core.range(Core.dim).forEach(function(x) {
                key += Core.keyChar(board[x][y]);
            });
        });
        // alert('Here is the current board key: ' + key);
        return key;
    }

    function isOver() {
        return over;
    }

    me.isOver = isOver;
    me.get = get;
    me.move = move;
    me.whoseMove = whoseMove;
    me.reset = reset;
    me.boardKey = boardKey;

    return me;
})();

