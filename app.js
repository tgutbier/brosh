var Command = function(rawCommand) {
    this.raw = rawCommand;
    this.name = null;
    this.args = [];
    this.init();
};
Command.prototype.init = function() {
    this.raw = this.raw.trim();
    var arglist = this.raw.split(" ");
    this.name = arglist[0];
    this.args = arglist;
};
Command.prototype.update = function(rawCommand) {
    this.raw = rawCommand.trim();
    this.init();
};
Command.prototype.getRaw = function() {
    return this.raw;
};
Command.prototype.delChar = function() {
    this.raw = this.raw.slice(0, - 1);
    this.init();
    return this.raw;
};
var History = {
    current: null,
    commands: [],
    add: function(command) {
        this.commands.push(command);
        this.current = this.commands.length - 1;
    },
    getCurrent: function() {
        return this.commands[this.current];
    },
    last: function() {
        if (this.commands.length) {
            return this.commands[this.commands.length - 1];
        }
        return false;
    },
    next: function() {
        if (this.current < this.commands.length - 1) {
            this.current++;
            return this.getCurrent();
        }
        return false;
    },
    prev: function() {
        if (this.current > 0) {
            this.current--;
            return this.getCurrent();
        }
        return false;
    }
};
var Shell = function (selector) {
    this.domNode = $(selector);
    this.command = null;
    this.promptDomNode = null;
    this.outputDomNode = null;
    this.suspendState = false;
    this.addChar = function(keyValue) {
        this.promptDomNode.find('span.text').append(keyValue);
        var rawCommand = this.promptDomNode.find('span.text').html();
        this.command.update(rawCommand);
    };
    this.delChar = function() {
        this.command.delChar();
        this.promptDomNode.find('span.text').html(this.command.getRaw());
    };
    this.setPrompt = function(command) {
        this.promptDomNode.find('span.text').html(command.raw);
        this.command = command;
    };
    this.getCommand = function() {
        return this.command;
    };
    this.nextPrompt = function(str) {
        this.createPrompt(str);
    };
    this.createPrompt = function(str) {
        $('.cursor').removeClass('cursor');
        $('.text').removeClass('smog');
        this.promptDomNode = $('<p><span class="location">brosh:></span><span><span class="text smog">' + str + '</span></span><span class="cursor"> </span></p>');
        if (this.command === null || this.command.name.length > 0) {
            this.command = new Command('');
            History.add(this.command);
        }
        this.domNode.append(this.promptDomNode);
    };
    this.output = function(str) {
        this.outputDomNode = $('<p><span class="text">' + str + '</span></p>');
        this.domNode.append(this.outputDomNode);
    };
    this.outputLine = function(str) {
        this.output(str + '<br />');
    };
    this.clear = function() {
        this.domNode.html('');
    };
    this.alarm = function() {
        activeCursorClass = 'active-error';
        setTimeout(function () {
            activeCursorClass = 'active';
        }, 1000);
        var backerr = true;
        setTimeout(function() {
            backerr = false;
        }, 1500);
        setInterval(function() {
            if (backerr) {
                $('#brosh').toggleClass('errback');
            }
        }, 100);
    };
    this.scroll = function() {
        $(document).scrollTop($(document).height());
        return false;
    };
    this.suspend = function() {
        this.suspendState = true;
        $('body').unbind('keydown');
        brosh.domNode.find('span.cursor').removeClass('active');
    };
    this.resume = function() {
        this.suspendState = false;
        $('body').bind('keydown', ShellHandler);
    };
    this.cursorBlink = function() {
        if (!brosh.suspendState) {
            brosh.domNode.find('span.cursor').toggleClass('active');
        }
    };
    setInterval(this.cursorBlink, 750);
    this.createPrompt('');
};
var brosh = null;
$(function() {
    brosh = new Shell('#shell');
    $('body').bind('keydown', ShellHandler);
});
var ShellHandler = function(event) {
    event.preventDefault();
    $('div#char').html(event.key + '<span class="small">' + event.keyCode + ' </span> ');
    if (event.keyCode === 13) {
        var command = brosh.getCommand();
        brosh.scroll();
        var name = command.name;
        var args = command.args;
        if (name !== '') {
            try {
                if (typeof window.aliases[name] === 'function') {
                    window.aliases[name](args);
                } else {
                    window.commands[name](args);
                }
            }
            catch (error) {
                if (typeof window.commands[name] === 'undefined') {
                    commands.commandNotFound(args);
                } else {
                    commands.commandError(args);
                }
            }
        }
        brosh.nextPrompt('');
    } else if (event.keyCode === 8) {
        brosh.delChar();
    } else if (event.ctrlKey) {
        if (event.keyCode === 76) {
            brosh.clear();
            brosh.nextPrompt('');
        }
    } else if (event.keyCode >= 37 && event.keyCode <= 40) {
        // LEFT
        if (event.keyCode === 37) {
        }
        // UP
        if (event.keyCode === 38) {
            command = History.prev();
            if (command !== false) {
                brosh.setPrompt(command);
            }
        }
        // RIGHT
        if (event.keyCode === 39) {
        }
        // DOWN
        if (event.keyCode === 40) {
            command = History.next();
            if (command !== false) {
                brosh.setPrompt(command);
            }
        }
    } else if (event.keyCode > 30) {
        brosh.addChar(event.key);
    }
};
