import fs from "fs";
import path from "path";
import { Symbol, IndexConfig, Nested, Block } from "./definition";

function scanFolder(folder: string): string[] {
    const ret: string[] = [];

    let files = fs.readdirSync(folder);
    files.forEach(file => {
        const filePath = path.join(folder, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            ret.push(...scanFolder(filePath));
        } else if (stats.isFile()) {
            if (filePath.split('.').pop() === 'js') {
                ret.push(filePath);
            }
        }
    });
    return ret;
}

export function loadConfig(folder: string = '.'): IndexConfig {
    const ret: IndexConfig = {
        block: {},
        symbol: {}
    };

    const blocks = scanFolder(path.join(__dirname, folder + '/block'));

    blocks.forEach(cfg => {
        const block = require(cfg).default as Block;
        loadBlockConfig(ret, block);
    });

    const symbols = scanFolder(path.join(__dirname, folder + '/symbol'));

    symbols.forEach(cfg => {
        const symbol = require(cfg).default as Symbol;
        loadSymbolConfig(ret, symbol);
    });

    return ret;        
}

export function loadBlockConfig(indexConfig: IndexConfig, block: Block): void {
    if (!block.loop) {
        block.loop = 1;
    }

    indexConfig.block[block.name] = block;
}

export function loadSymbolConfig(indexConfig: IndexConfig, symbol: Symbol): void {
    if (symbol.base) {
        symbol = { ...indexConfig.symbol[symbol.base], ...symbol };
    }

    if (!symbol.size) {
        symbol.size = 1;
    }
    // if (!symbol.delimiter) {
    //     symbol.delimiter = '';
    // }
    if (!symbol.ext) {
        symbol.ext = {
            // value: ''
        }
    }
    if (!symbol.output) {
        symbol.output = function (indexConfig?: IndexConfig, nested?: Nested[], position?: number): string {
            return this.ext.value || '';
        }
    }

    indexConfig.symbol[symbol.name] = symbol;
}
