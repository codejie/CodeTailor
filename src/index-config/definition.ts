export interface Block {
    name: string,
    base?: string,
    loop?: number
}

export interface Symbol {
    name: string,
    base?: string,
    isTemplate?: boolean,
    template?: string,
    size?: number,
    delimiter?: string,
    output?: (indexConfig?: IndexConfig, nested?: BlockNested[], position?: number) => string,
    value?: string,
    // ext?: any,
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
    loop: number      
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
    indexConfig?: string, // default ./index
    included?: string[],
    excluded?: string[],
    output?: string, // default ./output
}

// export function defaultIndexOutput(indexConfig?: IndexConfig, nested?: Nested[], position?: number): string {
//     return this.ext.value;
// }