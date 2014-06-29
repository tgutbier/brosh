var InputLine = function(rawCommand) {
    this.raw = rawCommand;
};
InputLine.prototype.getRaw = function() {
    return this.raw;
};
InputLine.prototype.getName = function() {
    return this.getArgs()[0];
};
InputLine.prototype.getArgs = function() {
    return this.getRaw().replace(/^\s+|\s+$|\s+(?=\s)/g, "").split(" ");
};
InputLine.prototype.update = function(rawCommand) {
    this.raw = rawCommand;
};
InputLine.prototype.delChar = function() {
    this.raw = this.getRaw().slice(0, -1);
    return this.raw;
};
var History = {
    currentIndex: null,
    inputLines: [],
    add: function(command) {
        this.inputLines.push(command);
        this.currentIndex = this.inputLines.length - 1;
    },
    getCurrent: function() {
        return this.inputLines[this.currentIndex];
    },
    last: function() {
        if (this.inputLines.length) {
            return this.inputLines[this.inputLines.length - 1];
        }
        return false;
    },
    next: function() {
        if (this.currentIndex < this.inputLines.length - 1) {
            this.currentIndex++;
            return this.getCurrent();
        }
        return false;
    },
    prev: function() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.getCurrent();
        }
        return false;
    }
};
var Shell = function (selector) {
    this.domNode = $(selector);
    this.inputLine = null;
    this.promptDomNode = null;
    this.outputDomNode = null;
    this.suspendState = false;
    this.showInputActive = broshSettings.showInput;
    this.addChar = function(keyValue) {
        this.promptDomNode.find('span.text').append(keyValue);
        var rawInputLine = this.promptDomNode.find('span.text').html();
        this.inputLine.update(rawInputLine);
    };
    this.delChar = function() {
        this.inputLine.delChar();
        this.promptDomNode.find('span.text').html(this.inputLine.getRaw());
    };
    this.setPrompt = function(inputLine) {
        this.promptDomNode.find('span.text').html(inputLine.getRaw());
        this.inputLine = inputLine;
        History.add(this.inputLine);
    };
    this.getInputLine = function() {
        return this.inputLine;
    };
    this.nextPrompt = function(str) {
        this.createPrompt(str);
    };
    this.createPrompt = function(str) {
        $('.cursor').removeClass('cursor');
        $('.text').removeClass('smog');
        this.promptDomNode = $('<p><span class="location">brosh:></span><span><span class="text smog">' + str + '</span></span><span class="cursor"> </span></p>');
        if (this.inputLine === null || this.inputLine.getName().length > 0) {
            this.inputLine = new InputLine('');
            History.add(this.inputLine);
        }
        this.domNode.append(this.promptDomNode);
        this.scroll();
    };
    this.output = function(str) {
        this.outputDomNode = $('<p><span class="text">' + str + '</span></p>');
        this.domNode.append(this.outputDomNode);
        this.scroll();
    };
    this.outputLine = function(str) {
        this.output(str);
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
        setTimeout(function(){
            $(document).scrollTop($(document).height());
        }, 20);
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
    this.showInput = function(event) {
        if (this.showInputActive) {
            $('div#char').html(event.key + '<span class="small">' + event.keyCode + ' </span> ');
        }
    };
    this.toggleShowInput = function() {
        this.showInputActive = !this.showInputActive;
        $('div#char').toggle(this.showInputActive);
    };
    this.closeShellWindow = function() {
        var shellWindow = $('#input');
        shellWindow.dialog('close');
        shellWindow.dialog('destroy');
        shellWindow.css('display', 'none');
    };
    this.createShellWindow = function(props) {
        var shellWindow = $('#input');
        shellWindow.css('display', 'block');
        var dialogSettings = {
            width: 400,
            height: 100,
            create: function(event, ui) {
                console.info('creating dialog');
                brosh.suspend();
            },
            close: function(event, ui) {
                console.info('closing dialog');
                brosh.resume();
            }
        };
        for (var key in props) {
            dialogSettings[key] = props[key];
        }
        shellWindow.dialog(dialogSettings);
        return shellWindow;
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
    brosh.showInput(event);
    if (event.keyCode === 13) {
        var inputLine = brosh.getInputLine();
        var name = inputLine.getName();
        var args = inputLine.getArgs();
        if (name !== '') {
            try {
                if (typeof aliases[name] === 'function') {
                    aliases[name](args);
                } else {
                    commands[name](args);
                }
            }
            catch (error) {
                if (typeof commands[name] === 'undefined') {
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
            inputLine = History.prev();
            if (inputLine !== false) {
                brosh.setPrompt(inputLine);
            }
        }
        // RIGHT
        if (event.keyCode === 39) {
        }
        // DOWN
        if (event.keyCode === 40) {
            inputLine = History.next();
            if (inputLine !== false) {
                brosh.setPrompt(inputLine);
            }
        }
    } else if (event.keyCode > 30) {
        brosh.addChar(event.key);
    }
};
