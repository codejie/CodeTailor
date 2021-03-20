exports.default = {
    name: 'array_value',
    output: function (indexConfig, nested, position){
        const loop = nested[0].loop;
        switch(loop) {
            case 0:
                return '';
            case 1:
                return '(byte)0';
            case 2:
                return '(byte)0,(byte)1';
            case 3:
                return '(byte)0,(byte)0,(byte)0,(byte)0,(byte)0,(byte)0,(byte)0,(byte)0,(byte)0,(byte)0';
            default:
                return '';
        }
    }
}