
getRandomColor = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

hexToRgb= function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
    } : null;
}
__componentToHex =function (c) 
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

rgbToHex = function (r, g, b) 
{
    return ("#" + __componentToHex(r) + 
            __componentToHex(g) + 
            __componentToHex(b)).toUpperCase();
} 

