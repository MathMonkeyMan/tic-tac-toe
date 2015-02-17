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

var main = (function() {
    var me = {};
    var cells;

    window.onload = function() {
        cells = [ [ document.getElementById("cell0,0"), 
                    document.getElementById("cell0,1"),
                    document.getElementById("cell0,2") ],
                  [ document.getElementById("cell1,0"),
                    document.getElementById("cell1,1"),
                    document.getElementById("cell1,2") ],
                  [ document.getElementById("cell2,0"),
                    document.getElementById("cell2,1"),
                    document.getElementById("cell2,2") ] ];
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
        div.style.opacity = zeroToOne; 
        // IE
        div.style.filter = 'alpha(opacity=' + (zeroToOne * 100) + ')'; 
    }

    function setCellValue(x, y, value) {
        // alert('Setting cell (' + x + ', ' + y + ') to ' + value);
        cells[x][y].innerHTML = value;
    }

    function getCellValue(x, y) {
        var value = cells[x][y].innerHTML;
        return value;
    }

    // Utilities for the hover "move preview"
    //
    function hideCell(x, y) {
        setOpacity(cells[x][y], 0.0);
    }

    function fadeCell(x, y) {
        setOpacity(cells[x][y], 0.2);
    }

    function unfadeCell(x, y) {
        setOpacity(cells[x][y], 1.0);
    }

    function showPossibleValue(x, y) {
        if (Game.isOver()) {
            return;
        }
        if (getCellValue(x, y) === Core.blank) {
            fadeCell(x, y);
            setCellValue(x, y, Game.whoseMove());
        }
    }

    function hidePossibleValue(x, y) {
        if (Game.get(x, y) === Core.blank) {
            setCellValue(x, y, Core.blank);
            hideCell(x, y);
        }
    }

    // Clicking on cells
    //
    function dummyClickHandler(event, x, y) {
        if (Game.get(x, y) === Core.blank) {
            unfadeCell(x, y);
            setCellValue(x, y, Game.whoseMove());
            Game.move(x, y);
        }
    }

    function makeMove(x, y, who, canCheat) {
        if (!canCheat && Game.get(x, y) !== Core.blank) {
            // Invalid move
            return {};
        }
        // Cheating will become significant when Neo is written.

        unfadeCell(x, y);
        setCellValue(x, y, who);
        var moveResult = Game.move(x, y, canCheat);

        return moveResult;
    }

    function isHuman(player) {
        return player.aiEngine === undefined;
    }

    function setEndGameMessage(msg) {
        document.getElementById('gameOverMessage').innerHTML = msg;
    }

    function reportEnd(winner, winningSequence) {
        if (winner) {
            setEndGameMessage(winner + ' wins.');
        }
        else {
            setEndGameMessage('Tie game.');
        }
        window.location.href = "#gameOver";
    }

    /*
     * example "moveResult": {
     *     winner: ex|oh|undefined,
     *     winningSequence: [Point]|undefined,
     *     gameOver: True|False
     * }
     */

    function isGameOverAfterMove(x, y, who, canCheat) {
        var moveResult = makeMove(x, y, 
                                  who, 
                                  canCheat);
        if (moveResult.gameOver) {
            reportEnd(moveResult.winner, 
                      moveResult.winningSequence);
            return true; // Game over.
        }
        else {
            return false; // Game continues.
        }
    }

    function clickHandler(event, x, y) {
        if (Game.isOver()) {
            return;
        }

        var whoNow = Game.whoseMove();
        var currentPlayer = Players.get(whoNow);

        if (isHuman(currentPlayer)) {
            if (isGameOverAfterMove(x, y, 
                                    whoNow,
                                    currentPlayer.canCheat())) {
                return; // Game over.
            }

            // Otherwise, let's see if the next player is AI.
            whoNow = Game.whoseMove();
            currentPlayer = Players.get(whoNow);
            if (isHuman(currentPlayer)) {
                return; // Let the human go.
            }

            var move = currentPlayer.aiEngine.suggestMove(
                    Game.boardKey());
            assert(move !== undefined);

            if (isGameOverAfterMove(move.x, move.y, 
                                    whoNow,
                                    currentPlayer.canCheat())) {
                return; // Game over.
            }
        }
        else {
            alert("Not your turn!"); // TODO: Remove
        }
    }

    var Players = (function() {
        var me = {};

        // A "player" has a name and an aiEngine.
        // If the player is human, aiEngine === undefined.
        //
        var xPlayer = {
            name: 'human',
            aiEngine: undefined,
            canCheat: function() {
                return false;
            }
        };
        var oPlayer = {
            name: 'human',
            aiEngine: undefined,
            canCheat: function () {
                return false;
            }
        };

        function clone(spec) {
            var canICheat = spec.canCheat();

            return {
                name: spec.name,
                aiEngine: spec.aiEngine,
                canCheat: function() {
                    return canICheat;
                }
            };
        }

        function reset(xSpec, oSpec) {
            xPlayer = clone(xSpec);
            oPlayer = clone(oSpec);
        }
        
        function get(who) {
            if (who === Core.ex) {
                return clone(xPlayer);
            }
            else {
                assert(who === Core.oh);
                return clone(oPlayer);
            }
        }

        me.reset = reset;
        me.get = get;
        return me;
    })();

    // New game popup initially.
    window.location.href = "#newGame";

    function lookupEngine(playerName) {
        if (playerName === "human") {
            return undefined; // Roll over, Turing
        }
        else {
            return Ai.getEngine(playerName);
        }
    }

    function makePlayer(name) {
        var engine = lookupEngine(name);
        function canCheat() {
            if (engine === undefined) {
                return false; // No human cheating
            }
            else {
                return engine.canCheat();
            }
        }

        return {
            "name": name,
            "aiEngine": engine,
            "canCheat": canCheat
        };
    }

    function newGame() {
        var xPlayer = document.getElementById('xPlayer').value;
        var oPlayer = document.getElementById('oPlayer').value;

        Players.reset(makePlayer(xPlayer), makePlayer(oPlayer));
        
        Game.reset();
        clearCells();

        window.location.href = '#'; // Hide "new game" popup. 

        var whoNow = Game.whoseMove();
        var currentPlayer = Players.get(whoNow);
        while (!isHuman(currentPlayer)) {
            var move = currentPlayer.aiEngine.suggestMove(
                    Game.boardKey());
            // alert(whoNow + ' is making the move (' + move.x + ', ' + move.y + ')');
            assert(move !== undefined);

            if (isGameOverAfterMove(move.x, move.y, 
                                    whoNow,
                                    currentPlayer.canCheat())) {
                return; // Game over.
            }

            whoNow = Game.whoseMove();
            currentPlayer = Players.get(whoNow);
        }
    }

    me.showPossibleValue = showPossibleValue;
    me.hidePossibleValue = hidePossibleValue;
    me.clickHandler = clickHandler;
    me.newGame = newGame;

    return me;
})(); // var main

