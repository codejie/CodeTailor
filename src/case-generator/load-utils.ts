
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { loadBlockConfig, loadSymbolConfig, scanFolder } from '../index-config';
import { Block, Symbol, IndexConfig, Template } from '../index-config/definition';

// interface Template {
//     name: string,
//     desc?: string,
//     author?: string,
//     version?: string,
//     indexConfig?: string,
//     output?: string,
//     lines: string[],
// }

export function loadTemplate(indexConfig: IndexConfig, file: string): Promise<Template> {
    return new Promise<Template>((resolve, reject) => {
        const ret: any = {
            name: 'undefined',
            file: file,
            lines: []
        };
        let isTemplate = false;
        
        const reader = readline.createInterface({
            input: fs.createReadStream(file)
        });
    
        reader.on('line', line => {
            if (!isTemplate) {
                const ctx = line.split(/[ \t]+/);
                if (ctx && ctx.length > 0 && ctx[0].length > 1) {
                    const label = ctx[0].substring(1);
                    if (label === '##') { // remark
                        // skip
                    } else if (label === 'template') {
                        isTemplate = true;
                    } else {
                        ret[label] = ctx[1];
                    }
                    // if (label != 'template') {
                    //     ret[label] = ctx[1];
                    // } else {
                    //     isTemplate = true;
                    // }
                }
            } else {
                ret.lines.push(line);
            }
        });

        reader.on('close', () => {
            ret.indexConfig = mergeTemplateIndex(indexConfig, ret);
            resolve(ret);
        });    
    });
}

export async function loadProject(file: string): Promise<void> {
    return Promise.resolve();
}

function mergeTemplateIndex(indexConfig: IndexConfig, template: Template): IndexConfig {
    const templatePath = path.dirname(template.file);;
    const ret = { ...indexConfig };

    if (template.jsonIndex) {
        loadJSONIndex(ret, path.join(templatePath, template.jsonIndex));
    }

    if (template.jsIndex) {
        loadJSIndex(ret, path.join(templatePath, template.jsIndex));
    }

    return ret;
}

function loadJSONIndex(indexConfig: IndexConfig, file: string): void {
    const index = require(file);
    if (index.block) {
        index.block.forEach((item: Block) => {
            loadBlockConfig(indexConfig, item);
        });
    }
    if (index.symbol) {
        index.symbol.forEach((item: Symbol) => {
            loadSymbolConfig(indexConfig, item);
        });
    }
}

function loadJSIndex(indexConfig: IndexConfig, jsPath: string): void {

    const blocks = scanFolder(jsPath + '/block');

    blocks.forEach(cfg => {
        const block = require(cfg).default as Block;
        loadBlockConfig(indexConfig, block);
    });

    const symbols = scanFolder(jsPath + '/symbol');

    symbols.forEach(cfg => {
        const symbol = require(cfg).default as Symbol;
        loadSymbolConfig(indexConfig, symbol);
    });    
}
