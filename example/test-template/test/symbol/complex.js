
exports.default = {
    name: 'complex',
    output: function (indexConfig, nested, position){
        return '\n\tline in block \'' + nested[0].block.index + '\' at ' + position + ' loop'; 
    }
}