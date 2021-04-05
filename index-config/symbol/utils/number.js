
exports.MAX_INT8 = 127;
exports.MIN_INT8 = -128;
exports.MAX_UINT8 = 255;
exports.MIN_UINT8 = 0;
exports.MAX_INT16 = 32767;
exports.MIN_INT16 = -32768;
exports.MAX_UINT16 = 65535;
exports.MIN_UINT16 = 0;
exports.MAX_INT32 = 2147483647;
exports.MIN_INT32 = -2147483648;
exports.MAX_UINT32 = 4294967295;
exports.MIN_UINT32 = 0;

function makeNumberRandom(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.makeNumberSequence = function (indexConfig, nested, position) {
    return nested[nested.length - 1].loop;
}

exports.makeNumberBoundary = function (nested, max, min) {
    const loop = nested[nested.length - 1].loop;
    switch (loop) {
        case 0:
            return max;
        case 1:
            return min;
        case 2:
            return (max + min + 1) / 2;
        case 3:
            return 1;
        case 4:
            return -1;
        default:
            return makeNumberRandom(max, min);
    }       
}

// export function makeInt8Boundary (indexConfig, nested, position) {
//     return makeNumberBoundary(MAX_INT8, MIN_INT8); 
// }

