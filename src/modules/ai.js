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
// The repository of AI engines that play tic-tac-toe.
// Also defines (loosely) the interface engines must implement.

var Ai = (function() {
    var me = {};
    var engines = {};

    // (name, type) pairs for what an "engine" must have.
    var engineInterface = {
        "getName": "function",
        "getDisplayName": "function",
        "suggestMove": "function",
        "canCheat": "function"
    };

    function satisfiesInterface(object, iface) {
        return Object.keys(iface).every(function(name) {
            return typeof object[name] === iface[name];
        });
    }

    function getEngine(name) {
        var engine = engines[name];
        assert(engine !== undefined);

        return engine;
    }

    function getEngines() {
        var result = {};
        Object.keys(engines).forEach(function(name) {
            result[name] = engines[name];
        });
        return result;
    }

    function addEngine(engine) {
        assert(satisfiesInterface(engine, engineInterface));

        var name = engine.getName();
        assert(engines[name] === undefined);

        engines[name] = engine;
    }

    me.getEngine = getEngine;
    me.getEngines = getEngines;
    me.addEngine = addEngine;
    return me;
})();

