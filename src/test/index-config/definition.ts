export interface Block {
    isBuiltIn?: boolean;
    name: string,
    base?: string,
    loop?: number
}

export interface Symbol {
    isBuiltIn?: boolean;
    name: string,
    base?: string,
    isTemplate?: boolean,
    template?: string,
    size?: number,
    delimiter?: string,
    output?: (indexConfig?: IndexConfig, nested?: Nested[], position?: number) => string,
    ext?: any,
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

export interface Nested {
    block: string,
    loop: number    
}

// export function defaultIndexOutput(indexConfig?: IndexConfig, nested?: Nested[], position?: number): string {
//     return this.ext.value;
// }