exports.default = {
    name: 'int_incream',
    base: 'int',
    size: 1,
    output: function (indexConfig, nested, position) {
        return nested[nested.length - 1].loop.toString();        
    }
}