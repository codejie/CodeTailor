import fs from "fs";
import path from "path";
import { Symbol, IndexConfig, Block, BlockNested } from "./definition";

export function scanIndeConfigFolder(folder: string): string[] {
    const ret: string[] = [];

    if (!fs.existsSync(folder)) {
        return [];
    }

    let files = fs.readdirSync(folder);
    files.forEach(file => {
        const filePath = path.join(folder, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            ret.push(...scanIndeConfigFolder(filePath));
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

    // const blocks = scanFolder(path.join(__dirname, folder + '/block'));
    const blocks = scanIndeConfigFolder(folder + '/block');

    blocks.forEach(cfg => {
        const block = require(cfg).default as Block;
        loadBlockConfig(ret, block);
    });

    // const symbols = scanFolder(path.join(__dirname, folder + '/symbol'));
    const symbols = scanIndeConfigFolder(folder + '/symbol');

    symbols.forEach(cfg => {
        const symbol = require(cfg).default as Symbol;
        loadSymbolConfig(ret, symbol);
    });

    return ret;        
}

export function loadBlockConfig(indexConfig: IndexConfig, block: Block): void {
    if (!block) {
        return;
    }
    if (block.base) {
        block = { ...indexConfig.block[block.base], ...block };
    }
    if (!block.loop) {
        block.loop = 1;
    }

    indexConfig.block[block.name] = block;
}

export function loadSymbolConfig(indexConfig: IndexConfig, symbol: Symbol): void {
    if (!symbol) {
        return;
    }
    if (symbol.base) {
        symbol = { ...indexConfig.symbol[symbol.base], ...symbol };
    }

    if (!symbol.size) {
        symbol.size = 1;
    }
    // if (!symbol.delimiter) {
    //     symbol.delimiter = '';
    // }
    // if (!symbol.ext) {
    //     symbol.ext = {
    //         // value: ''
    //     }
    // }
    if (!symbol.output) {
        symbol.output = function (indexConfig?: IndexConfig, nested?: BlockNested[], position?: number): string {
            return this.value!.toString() || '';// this.ext.value || '';
        }
    }
    indexConfig.symbol[symbol.name] = symbol;
}
