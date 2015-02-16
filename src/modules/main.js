
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
                cell.innerHTML = blank;
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
        if (getCellValue(x, y) === blank) {
            fadeCell(x, y);
            setCellValue(x, y, Game.whoseMove());
        }
    }

    function hidePossibleValue(row, col) {
        var x = row - 1,
            y = col - 1;
        if (Game.get(x, y) === blank) {
            setCellValue(x, y, blank);
            hideCell(x, y);
        }
    }

    // Clicking on cells
    //
    var clickHandler = (function() {
        return function(event, row, col) {
            var x = row - 1,
                y = col - 1;
            if (Game.get(x, y) === blank) {
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
            if (who === ex) {
                return clone(xPlayer);
            }
            else {
                assert(who === oh);
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

