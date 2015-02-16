// The repository of AI engines that play tic-tac-toe.
// Also defines (loosely) the interface engines must implement.

var Ai = (function() {
    var me = {};
    var engines = {};

    // (name, type) pairs for what an "engine" must have.
    var engineInterface = {
        "getName": "function",
        "suggestMove": "function"
    };

    function satisfiesInterface(object, iface) {
        return Object.keys(iface).every(function(name) {
            return typeof object[name] === iface[name];
        });
    }

    function getEngine(name) {
        return engines[name];
    }

    function getEngines() {
        var result = {};
        Object.keys(engines).forEach(function(name) {
            result[name] = engines[name];
        });
        return result;
    }

    function addEngine(engine) {
        assert(satisfiesInterface(engineInterface));

        var name = engine.getName();
        assert(engines[name] === undefined);

        engines[name] = engine;
    }

    me.getEngine = getEngine;
    me.getEngines = getEngines;
    me.addEngine = addEngine;
})();

