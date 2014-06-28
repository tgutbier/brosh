function reverse(s)
{
    var o = '';
    for (var i = s.length - 1; i >= 0; i--) {
        o += s[i];
    }
    return o;
}
function delchar(str, pos)
{
    console.info('delpos: ' + str);
    return str.slice(0, pos-1) + str.slice(pos);
}
function isUndefined(args, indexes) {
    var i;
    for (i = 0; i < indexes.length; i++) {
        if (typeof args[indexes[i]] === 'undefined') {
            return true;
        }
    }
    return false;
}
