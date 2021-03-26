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
    name: string,
    file: string,
    desc?: string,
    author?: string,
    version?: string,
    indexConfig?: string,
    jsIndex?: string,
    jsonIndex?: string,
    output?: string,
    lines: string[],
}

export interface Project { // project.config
    name: string,
    desc?: string,
    author?: string,
    version?: string,
    jsIndex?: string,
    jsonIndex?: string,
    included?: string[],
    excluded?: string[],
    outputFolder?: string, // default ./output
    outputSuffix?: string // default .o
}

// export function defaultIndexOutput(indexConfig?: IndexConfig, nested?: Nested[], position?: number): string {
//     return this.ext.value;
// }