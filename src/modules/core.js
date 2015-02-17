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

// Fundamental tic-tac-toe items: The board format, checking for wins,
// ties, etc.

"use strict";

var assert = function(predicate) {
    // In production, comment out this code.
    //
    /*
    if ( ! predicate) {
        var message = 'Assertion failed: ' + predicate;
        alert(message);
        throw {
            "message": message
        };
    }
    */
}

var Core = (function() {
    var me = {};
    var ex = 'X',
        oh = 'O',
        blank = '&nbsp;',
        dim = 3,
        blankKeyChar = '.';

    function keyChar(c) {
        if (c === ex || c === oh) {
            return c;
        }
        else {
            return blankKeyChar;
        }
    }

    // e.g. range(3) === [0, 1, 2]
    //      range(2, 4) === [2, 3]
    //      range(0, 15, 3) === [0, 3, 6, 9, 12]
    //
    function range(a, b, inc) {
        assert(a !== undefined);
        var result = [];

        if (b === undefined) {
            var first = 0,
                onePastLast = a;
        }
        else {
            var first = a,
                onePastLast = b;
        }
        if (inc === undefined) {
            var increment = 1;
        }
        else {
            var increment = inc;
        }

        for (var i = first; i < onePastLast; i += increment) {
            result.push(i);
        }
        return result;
    }

    // [ [ (0,0), (1,0), (2,0) ], ... ]
    //
    function winningSequences() {
        // Array comprehensions would be really nice here.
        var nums = range(dim);
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
            return { 'x': i, 'y': dim - i - 1 };
        }));

        sequences.forEach(function(seq) {
            assert(seq.length === dim);
        });

        return sequences;
    }

    var wins = winningSequences();

    function keyAt(key, x, y) {
        return key[dim * y + x];
    }

    function sameValue(key, seq) {
        if (seq.length === 0) {
            return false;
        }

        var first = seq[0];
        var value = keyAt(key, first.x, first.y);
        if (seq.every(function(p) {
                return keyAt(key, p.x, p.y) === value;
           })) {
            return value;
        }
        else {
            return false;
        }
    }

    // Returns ex, oh, or undefined.
    function winner(key) {
        var whoWon;
        wins.forEach(function(seq) {
            var same = sameValue(key, seq);
            if (same === ex || same === oh) {
                whoWon = same;
            }
        });
        return whoWon;
    }

    function strForEach(s, func) {
        var length = s.length;
        for (var i = 0; i < length; ++i) {
            func(s[i], i, s);
        }
        return s;
    }

    // Assumes `before` and `after` differ by one more only.
    function moveMade(before, after) {
        var move = {};
        strForEach(after, function(ch, i) {
            if (before[i] === blankKeyChar && ch !== blankKeyChar) {
                move.x = i % dim;
                move.y = Math.floor(i / dim);
            }
        });

        return move;
    }

    function toArray(s) {
        return range(s.length).map(function(i) {
            return s[i];
        });
    }

    function applyMove(key, x, y, who) {
        var array = toArray(key);
        array[dim * y + x] = who;
        return array.join('');
    }

    function count(array, value) {
        return countIf(array, function(arg) {return arg === value;});
    }

    function countIf(array, predicate) {
        return sum(array.map(function(item) {
            return predicate(item) ? 1 : 0;
        }));
    }

    function sum(array) {
        return array.reduce(function(runningTotal, item) {
            return runningTotal + item;
            }, 0);
    }

    function whoMoves(key) {
        var chars = toArray(key);
        if (count(chars, ex) === count(chars, oh))
            return ex;
        else
            return oh;
    }

    function full(key) {
        return count(toArray(key), blankKeyChar) === 0;
    }

    function possibleMoves(key) {
        if (full(key) || winner(key)) {
            return [];
        }

        var who = whoMoves(key);
        var result = [];
        toArray(key).forEach(function(ch, i) {
            if (ch === blankKeyChar) {
                var move = toArray(key);
                move[i] = who;
                result.push(move.join(''));
            }
        });

        return result;
    }

    function other(who) {
        if (who === ex) {
            return oh;
        }
        else {
            assert(who === oh);
            return ex;
        }
    }

    me.other = other;
    me.ex = ex;
    me.oh = oh;
    me.blank = blank;
    me.dim = dim;
    me.blankKeyChar = blankKeyChar;
    me.keyChar = keyChar;
    me.range = range;
    me.strForEach = strForEach;
    me.winningSequences = winningSequences;
    me.moveMade = moveMade;
    me.whoMoves = whoMoves;
    me.applyMove = applyMove;
    me.possibleMoves = possibleMoves;
    me.winner = winner;
    me.full = full;

    return me;
})();

