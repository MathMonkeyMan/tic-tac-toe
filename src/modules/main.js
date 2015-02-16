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
"use strict";

var assert = function(predicate) {
    // TODO: In production, disable this code.
    if ( ! predicate) {
        throw {
            message: 'Assertion failed: ' + predicate
        };
    }
}

var main = (function() {
    var me = {};
    var cells;

    window.onload = function() {
        cells = [ [ document.getElementById("cell1,1"), 
                    document.getElementById("cell1,2"),
                    document.getElementById("cell1,3") ],
                  [ document.getElementById("cell2,1"),
                    document.getElementById("cell2,2"),
                    document.getElementById("cell2,3") ],
                  [ document.getElementById("cell3,1"),
                    document.getElementById("cell3,2"),
                    document.getElementById("cell3,3") ] ];
    };

    function clearCells() {
        cells.forEach(function(column) {
            column.forEach(function(cell) {
                setOpacity(cell, 0.0);
                cell.innerHTML = Core.blank;
            });
        });
    }

    function setOpacity(div, zeroToOne) {
        div.style.opacity = zeroToOne; //For real browsers
        div.style.filter = 'alpha(opacity=' + (zeroToOne * 100) + ')'; //For IE
    }

    function setCellValue(x, y, value) {
        cells[x][y].innerHTML = value;
    }

    function getCellValue(x, y) {
        var value = cells[x][y].innerHTML;
        return value;
    }

    function hideCell(x, y) {
        setOpacity(cells[x][y], 0.0);
    }

    function fadeCell(x, y) {
        setOpacity(cells[x][y], 0.2);
    }

    function unfadeCell(x, y) {
        setOpacity(cells[x][y], 1.0);
    }

    function showPossibleValue(row, col) {
        var x = row - 1,
            y = col - 1;
        if (getCellValue(x, y) === Core.blank) {
            fadeCell(x, y);
            setCellValue(x, y, Game.whoseMove());
        }
    }

    function hidePossibleValue(row, col) {
        var x = row - 1,
            y = col - 1;
        if (Game.get(x, y) === Core.blank) {
            setCellValue(x, y, Core.blank);
            hideCell(x, y);
        }
    }

    // Clicking on cells
    //
    var clickHandler = (function() {
        return function(event, row, col) {
            var x = row - 1,
                y = col - 1;
            // TODO: If it's a human's turn, make the move.
            //       Otherwise, do nothing.
            //       Then, if the next player is not human,
            //       make an AI move.
            //       Always check if the game is over.

            if (Game.get(x, y) === Core.blank) {
                unfadeCell(x, y);
                setCellValue(x, y, Game.whoseMove());
                Game.move(x, y);
            }
        }
    })();

    var Players = (function() {
        var me = {};

        var xPlayer = {
            name: 'human',
            aiEngine: undefined
        };
        var oPlayer = {
            name: 'human',
            aiEngine: undefined
        };

        var clone = function(spec) {
            return {
                name: spec.name,
                aiEngine: spec.aiEngine
            };
        };

        var reset = function(xSpec, oSpec) {
            xPlayer = clone(xSpec);
            oPlayer = clone(ySpec);
        };
        
        var get = function(who) {
            if (who === Core.ex) {
                return clone(xPlayer);
            }
            else {
                assert(who === Core.oh);
                return clone(oPlayer);
            }
        };

        me.reset = reset;
        me.get = get;
        return me;
    })();

    // New game popup initially.
    window.location.href = "#newGame";

    function newGame() {
        // alert(document.getElementById('xPlayer').value);
        var xPlayer = document.getElementById('xPlayer').value;
        var oPlayer = document.getElementById('oPlayer').value;
        // alert('Player X is "' + xPlayer + '" and player O is "' + oPlayer + '"');
        /*
        if (xPlayer !== 'human') {
            alert('X player is nonhuman "' + xPlayer + '"');
            // TODO load AI
        }
        if (oPlayer !== 'human') {
            alert('O player is nonhuman "' + oPlayer + '"');
            // TODO load AI
        }
        */
        Game.reset();
        clearCells();
        // TODO Board.reset();
        window.location.href = '#'; // Hide "new game" popup. 
    }

    me.showPossibleValue = showPossibleValue;
    me.hidePossibleValue = hidePossibleValue;
    me.clickHandler = clickHandler;
    me.newGame = newGame;
    return me;
})(); // var main

