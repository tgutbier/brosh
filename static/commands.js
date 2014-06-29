var commands = {
    commandNotFound: function(args) {
        var name = args[0];
        brosh.outputLine('BroSh: Command not found!> &laquo;<span class="error">' + name + '</span>&raquo;');
    },
    commandError: function(args) {
        var name = args[0];
        brosh.outputLine('BroSh: Error in command!> &laquo;<span class="error">' + name + '</span>&raquo;');
    },
    echo: function(args) {
        if (args[1] === '-nl') {
            $.each(args.slice(2), function(index, value) {
                brosh.outputLine(value);
            });
            return;
        }
        brosh.outputLine(args.slice(1).join(' '));
    },
    ls: function(args) {
        for (var key in this) {
            brosh.outputLine(key);
        }
    },
    delpos: function(args) {
        var pos = args[1];
        var str = args[2];
        brosh.outputLine(delchar(str, pos));
    },
    clear: function(args) {
        brosh.clear();
    },
    alarm: function(args) {
        brosh.alarm();
    },
    reload: function(args) {
        window.location.reload();
    },
    goto: function(args) {
        window.open('http://' + args[1]);
    },
    play: function(args) {
        args.push('play');
        this.vid(args);
    },
    stop: function(args) {
        args.push('stop');
        this.vid(args);
    },
    unvid: function(args) {
        args.push('off');
        this.vid(args);
    },
    vid: function(args) {
        if (args[1] === 'on') {
            $('#video').css('display', 'block');
            var videoId = (typeof args[2] === 'undefined') ? '26mGJIXloCA' : args[2];
            console.log(videoId);
            window.player = new YT.Player('player', {
                videoId: videoId,
                width:   '640',
                height:  '390'
            });
        } else if (args[1] === 'hide') {
            $('#video').css('opacity', '0');
        } else if (args[1] === 'show') {
            $('#video').css('opacity', '1');
        } else if (args[1] === 'off') {
            window.player = null;
            $('#video').css('display', 'none');
        } else if (args[1] === 'strong') {
            $('#video').toggleClass('strong');
        } else if (args[1] === 'play') {
            window.player.playVideo();
        } else if (args[1] === 'stop') {
            window.player.stopVideo();
        } else if (args[1] === 'style') {
            $('#video').toggleClass('trans');
        } else {
            brosh.outputLine('usage: video on [video-id]|off|hide|show|play|stop|style');
        }
    },
    range: function(args) {
        console.info(args);
        var start = parseInt((typeof args[1] === 'undefined') ? 1 : args[1]);
        var end = parseInt((typeof args[2] === 'undefined') ? 10 : args[2]);
        var nl = typeof args[3] !== 'undefined';
        for (var i = start; i <= end; i++) {
            if (nl) {
                brosh.outputLine(i);
            } else {
                brosh.output(i + ' ');
            }
        }
    },
    input: function(args) {
        var shellWindow = brosh.createShellWindow();
        shellWindow.html('<input id="inputline" type="text" value="">');
        var inputLine = $('#inputline');
        if (typeof args[1] !== 'undefined') {
            inputLine.val(args.slice(1).join(' '));
        }
        var strLength = inputLine.val().length;
        inputLine.focus();
        inputLine[0].setSelectionRange(strLength, strLength);
        inputLine.bind('keypress', function(event) {
            if (event.which === 13) {
                var value = inputLine.val();
                inputLine.val('');
                inputLine.blur();
                inputLine.unbind('keypress');
                brosh.setPrompt(new InputLine(value));
                brosh.closeShellWindow();
            }
        });
    },
    svg: function(args) {
        $('#svg').css('display', 'block');
    },
    less: function(args) {
        var image = $('#image');
        if (args[1] === 'on') {
            if (typeof broshSettings.backgroundImage !== 'undefined') {
                image.css('background-image', 'url(' + broshSettings.backgroundImage + ')');
            } else {
                brosh.outputLine('warning: backgroundImage is undefined in settings');
            }
            image.css('display', 'block');
        } else if (args[1] === 'off') {
            image.css('display', 'none');
        } else if (args[1] === 'blink') {
            if (image.css('display') === 'block') {
                setInterval(function() {
                    image.toggleClass('blank');
                }, 2000);
            } else {
                brosh.outputLine('warning: Image is not visible. Use less on to show it.');
            }
        } else {
            brosh.outputLine('usage: less on|off|blink');
        }
    },
    unless: function(args) {
        $('#image').css('display', 'none');
    },
    repeat: function(args) {
        if (isUndefined(args, [1, 2])) {
            brosh.outputLine('usage: repeat number cmd arguments');
            return;
        }
        var n = args[1];
        var cmd = args[2];
        var newArgs = [];
        var i;
        for (i = 2; i < args.length; i++) {
            newArgs.push(args[i]);
        }
        for (i = 1; i <= n; i++) {
            window.commands[cmd](newArgs);
        }
    },
    times: function(args) {
        var text = args[2];
        args[2] = 'echo';
        args[3] = text;
        this.repeat(args);
    },
    rev: function(args) {
        if (typeof args[1] === 'undefined') {
            brosh.outputLine('usage: rev string');
            return;
        }
        brosh.output(reverse(args[1]) + '<br />');
    },
    ver: function(args) {
        brosh.outputLine('BroSh - Version ' + broshSettings.version);
    },
    errtest: function(args) {
        brosh.outputLine(undefinedVariable);
    },
    keys: function(args) {
        brosh.toggleShowInput();
    },
    iter: function(args) {
        var cmd = args[1];
        var i;
        for (i = 2; i < args.length; i++) {
            window.commands[cmd]([cmd, args[i]]);
        }
    }
};
var aliases = {
    cls: commands.clear,
    F5: commands.reload,
    f5: commands.reload
};
