/*
 * Software design.
 * 
 * Definitions
 * 
 * - A command line is a string (usually user input.)
 *   It can be part of the shell's history or of a script.
 * - A command mesage is a data structure consumed or yielded by a command.
 * - A parser creates command messages from a command line.
 * - A command specifies how a command string must be parsed into a command
 *   message.
 *   A parser provides standard conversions for typical input data types,
 *   e.g. temporal values, numbers, or intervals.
 */

var exampleCommand = {
    info: {
    },
    messageDefinition: {
        input: [],
        output: []
    },
    run: function(inputMessage) {
        return outputMessage;
    }
}

var CommandMessage = function() {
    var cmd = {};
    this.a = 1;
    
    cmd.f = function() {};
    
    return cmd;
}

var AbstractCommand = function() {
    var cmd = {};
    
    return cmd;
}