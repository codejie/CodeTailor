export interface Block {
    name: string,
    base?: string,
    loop?: number,
    values?: string[] // loop = this.values.length * this.loop
}

export interface Symbol {
    name: string,
    base?: string,
    isTemplate?: boolean, // false
    template?: string,
    size?: number, // 1
    delimiter?: string,
    output?: (indexConfig?: IndexConfig, nested?: BlockNested[], position?: number) => string,
    value?: string,
    // ext?: any,
    maxNested?:number, // 64
    desc?: string,
    example?: string
}

export interface BlackConfig {
    [key: string]: Block
}

export interface SymbolConfig {
    [key: string]: Symbol
}

export interface IndexConfig {
    block: BlackConfig,
    symbol: SymbolConfig
}

// export interface Nested {
//     block: string,
//     loop: number    
// }

export interface IndexParams {
    index: string,
    params?: any
}

export interface BlockNested {
    block: IndexParams,
    loop: number,
    value?: string   
}

export interface Template {
    name: string, // @name
    desc?: string, // @desc
    author?: string, // @author
    version?: string, // @version
    jsIndex?: string, // @jsIndex
    jsonIndex?: string, // @jsonIndex
    output?: string, // @output
    lines: string[] // @template

    file: string,
    indexConfig: IndexConfig, //
}

export interface Project { // project.config
    name: string, // @name
    desc?: string, // @desc
    author?: string, // @auth
    version?: string, // @version
    jsIndex?: string, // @jsIndex
    jsonIndex?: string, // @jsonIndex
    rootFolder: string, // @rootFolder
    recursion?: boolean, // @recursion default false
    //overTemplateOutput?: boolean
    outputFolder?: string, // @outputFolder default ./output
    outputExtension?: string, // @outputExtension default .o
    included?: RegExp[], // @included default *.template,
    excluded?: RegExp[], // @excluded

    file: string,
    indexConfig: IndexConfig,
    files: string[]
}

// export function defaultIndexOutput(indexConfig?: IndexConfig, nested?: Nested[], position?: number): string {
//     return this.ext.value;
// }