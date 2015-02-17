
// Base class (more a protocol definition, really)
//
function Test(name) {
    var me = {};
    function run() {
        return { pass: true };
    }

    me.run = run;
    me.name = name;

    return me;
}

// Some utilties useful in testing
//
function testWrite(s) {
    document.getElementById('output').innerHTML += '<p>' + s + '</p>';
}

function dumpThing(test) {
    var s = '';
    Object.keys(test).forEach(function(key) {
        s += '(' + key + ', ' + test[key] + ')';
    });
    return s;
}

function runTest(test) {
    var result = test.run();
    if (!result.pass) {
        testWrite('FAIL ' + test.name + ': ' + result.error);
    }
    else {
        testWrite('SUCCESS ' + test.name);
    }
}

