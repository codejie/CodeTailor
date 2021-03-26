exports.default = {
    name: 'name-with-case-value',
    output: function (indexConfig, nested, position){
        const block = nested[nested.length - 1];
        return block.value;
    }
}