
import fs from 'fs';
import readline from 'readline';
import { loadBlockConfig, loadSymbolConfig } from './index-config';
import { IndexConfig } from './index-config/definition';

interface Template {
    name: string,
    desc?: string,
    author?: string,
    version?: string,
    indexConfig?: string,
    lines: string[],
}

interface Project {

}

export function loadTemplate(file: string): Promise<Template> {
    return new Promise<Template>((resolve, reject) => {
        const ret: any = {
            name: 'undefined',
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
                    if (label != 'template') {
                        ret[label] = ctx[1];
                    } else {
                        isTemplate = true;
                    }
                }
            } else {
                ret.lines.push(line);
            }
        });

        reader.on('close', () => {
            resolve(ret);
        });    
    });
}

export function loadProject(file: string): Project {
    return {}
}

export function loadTeIndex(indexConfig: IndexConfig, file: string): void {
    const index = require(file);
    if (index.block) {
        loadBlockConfig(indexConfig, index.block);
    }
    if (index.symbol) {
        loadSymbolConfig(indexConfig, index.symbol);
    }
}