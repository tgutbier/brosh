<!DOCTYPE html>
<html>
<head>
    <title>Brosh</title>
    <meta charset="UTF-8" />
    <link href="style.css" type="text/css" rel="stylesheet" />
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css">
    <script src="//code.jquery.com/jquery-1.10.2.js"></script>
    <script src="//code.jquery.com/ui/1.11.0/jquery-ui.js"></script>    
    <script type="text/javascript" src="lib.js"></script>
    <script type="text/javascript" src="app.js"></script>
    <script type="text/javascript" src="commands.js"></script>
</head>
<body id="brosh">

<div id="shell"></div>

<div id="input">
    <input id="inputenter" type="text" value="">
</div>

<div id="char"></div>

<div id="image"></div>

<div id="video">
    <div id="player"></div>
    <script>
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    </script>    
</div>

<div id="svg">
    <svg width="150" height="150" viewBox="-105 -105 210 210" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <ellipse cx="40" cy="40" rx="30" ry="15" style="stroke:#006600; fill:#00cc00"/>
    </svg>
</div>

</body>
</html>
