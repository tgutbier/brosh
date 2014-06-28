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
        $.each(args, function(index, value) {
            if (index !== 0) {
                brosh.outputLine(value);
            }
        });
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
    blink: function(args) {
        $('#image').css('display', 'block');
        setInterval(function() {
            $('#image').toggleClass('blank');
            console.info('blank');
        }, 2000);
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
            window.player = new YT.Player('player', {
                videoId: (typeof args[1] === 'undefined') ? '26mGJIXloCA' : args[1],
                width:   (typeof args[2] === 'undefined') ? '640' : args[2],
                height:  (typeof args[3] === 'undefined') ? '390' : args[3]
            });
        } else if (args[1] === 'off') {
            $('#video').css('display', 'none');
        } else if (args[1] === 'play') {
            window.player.playVideo();
        } else if (args[1] === 'stop') {
            window.player.stopVideo();
        } else if (args[1] === 'style') {
            $('#video').toggleClass('trans');
        } else {
            brosh.outputLine('usage: video on|off|play|stop|style|height <height>|width <width>');
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
        $('#input').css('display', 'block');
        $('#input').dialog({
            width: 400,
            height: 100
        });
        $('#inputenter').focus();
        brosh.suspend();
        $('#inputenter').bind('keypress', function(event) {
            if (event.which === 13) {
                var value = $('#inputenter').val();
                $('#inputenter').val('');
                $('#inputenter').blur();
                $('#input').css('display', 'none');
                command = new Command(value);
                brosh.setPrompt(command);
                
                $('#input').dialog('close');
                $('#inputenter').unbind('keypress');
                brosh.resume();
            }
        });
    },
    svg: function(args) {
        $('#svg').css('display', 'block');
    },
    less: function(args) {
        if (args[1] === 'on') {
            $('#image').css('display', 'block');
        } else if (args[1] === 'off') {
            $('#image').css('display', 'none');
        } else {
            brosh.outputLine('usage: less on|off');
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
