exports.default = {
    name: 'array_byte',
    output: function (indexConfig, nested, position){
        const loop = nested[0].loop;
        let ret = '';
        for (let i = 0; i < loop; ++ i) {
            ret += '(byte)' + i % 255;
            if (i != loop - 1) {
                ret += ', ';
            }
        }
        return ret;
    }
}