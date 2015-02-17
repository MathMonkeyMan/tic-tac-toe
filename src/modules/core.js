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
    // TODO: In production, disable this code.
    if ( ! predicate) {
        var message = 'Assertion failed: ' + predicate;
        alert(message);
        throw {
            "message": message
        };
    }
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

    me.ex = ex;
    me.oh = oh;
    me.blank = blank;
    me.dim = dim;
    me.blankKeyChar = blankKeyChar;
    me.keyChar = keyChar;
    me.range = range;

    return me;
})();

