exports.MAX_FLOAT = 3.40282347 * (10 ** 38);
exports.MIN_FLOAT = 1.40239846 * (10 ** -45);
exports.MID_FLOAT = 0.0;
exports.MAX_DOUBLE = 1.7976931348623157 * (10 ** 308);
exports.MIN_DOUBLE = 4.9406564584124654 * (10 ** -324);
exports.MID_DOUBLE = 0.0;

function makeFloatRandom(max, min) {
    return Math.random() * (max - min + 1) + min;
}

exports.makeFloatBoundary = function (nested, max, min, mid = 0) {
    const loop = nested[nested.length - 1].loop;
    switch (loop) {
        case 0:
            return max;
        case 1:
            return min;
        case 2:
            return mid;
        case 3:
            return 1.0;
        case 4:
            return -1.0;
        default:
            return makeFloatRandom(max, min);
    }       
}