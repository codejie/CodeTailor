import { IndexConfig, Nested } from "../definition";

export default {
    name: 'case_name',
    base: 'string',
    // desc: 'used by case name',
    size: 1,
    ext: {
        value: 'abc'
    },
    output: function (indexConfig?: IndexConfig, nested?: Nested[], position?: number): string {
        return this.ext.value + (nested ? nested[0].block : '');
    }
}