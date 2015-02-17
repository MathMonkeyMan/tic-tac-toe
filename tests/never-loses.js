

var NeverLoses = (function () {

// Instances of NeverLoses can share repeatedString.
function repeatedString(s, n) {
    return Core.range(n).map(function () { return s; }).join('');
}

function pretty(key) {
    var s = '';
    Core.range(Core.dim).forEach(function(row) {
        s += key.substring(Core.dim * row, Core.dim * (row + 1)) + '<br>';
    });

    // Technically incorrect, but I don't feel like
    // baking Core.blankKeyChar into a Regex.
    return s.replace(/\./g, '_');
}

// Plays through every possible game with the engine
// corresponding to the given spec.engineName.
// Fails if the engine loses any game.
//
function neverLoses(spec) {
    var me = Test(spec.testName);
    var engine = Ai.getEngine(spec.engineName);

    // Start with an empty board.
    var board = repeatedString(Core.blankKeyChar, Math.pow(Core.dim, 2));

    // Play all possible games again engine where
    // engine goes second. If the engine loses any game,
    // throw an exception.
    function engineAsO(boardKey) {
        who = Core.whoMoves(boardKey);
        var beforeMove = boardKey;
        Core.possibleMoves(beforeMove).forEach(function(move) {
             var winner = Core.winner(move);
             if (winner === who) {
                 throw new Error('AI engine "' +
                                 engine.displayName() +
                                 '" lost due to my move from ' +
                                 beforeMove + ' to ' + move);
             }
             else if (winner) { // AI won
                 return;
             }
             else if (Core.full(move)) {
                 return;
             }

             // Game's not over, so let the AI move.
             var aiMove = engine.suggestMove(move);
             if (aiMove === undefined) {
                 return;
             }
             var aiMoveKey = Core.applyMove(move, 
                                            aiMove.x, 
                                            aiMove.y, 
                                            Core.other(who));
             engineAsO(aiMoveKey);
        });
    }

    // Play all possible games again engine where
    // engine goes first. If the engine loses any game,
    // throw an exception.
    function engineAsX(boardKey) {
        var aiMove = engine.suggestMove(boardKey);
        engineAsO(Core.applyMove(boardKey, aiMove.x, aiMove.y, Core.ex));
    }

    function run() {
        try {
            engineAsX(board);
            engineAsO(board);
            return { pass: true };
        }
        catch (e) {
            return {
                pass: false,
                error: e.message
            };
        }
    }

    me.run = run;
    return me;
}

return neverLoses;
})(); // module

