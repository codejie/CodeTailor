
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { loadBlockConfig, loadSymbolConfig, scanIndeConfigFolder } from '../index-config';
import { Block, Symbol, IndexConfig, Template, Project } from '../index-config/definition';
import logger from '../logger';
import { resolveAbsolutePath } from './utils';

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
                const ctx = line.trim().split(/[ \t]+/);
                if (ctx && ctx.length > 0 && ctx[0].length > 1) {
                    if (ctx[0].charAt(0) === '@' && ctx[0].charAt(1) === '!') {
                        const label = ctx[0].substring(2);
                        // if (label === '##') { // remark
                        //     // skip
                        // } else 
                        if (label === 'template') {
                            isTemplate = true;
                        } else {
                            ret[label] = ctx.slice(1).join(' ');//ctx[1];
                        }
                    }
                }
            } else {
                ret.lines.push(line);
            }
        });

        reader.on('close', () => {
            ret.indexConfig = mergeIndexConfig(indexConfig, path.dirname(ret.file), ret.jsonIndex, ret.jsIndex);
            // ret.indexConfig = mergeTemplateIndex(indexConfig, ret);
            resolve(ret);
        });    
    });
}

export async function loadProject(indexConfig: IndexConfig, file: string): Promise<Project> {
    return new Promise<Project>((resolve, reject) => {
        const ret: any = {
            name: 'undefined',
            file: file,
            files: []
        };

        const reader = readline.createInterface({
            input: fs.createReadStream(file)
        });
    
        reader.on('line', line => {
            const ctx = line.trim().split(/[ \t]+/);
            if (ctx && ctx.length > 0 && ctx[0].length > 1) {
                if (ctx[0].charAt(0) === '@' && ctx[0].charAt(1) === '!') {
                    const label = ctx[0].substring(2);
                    const value = ctx.slice(1).join(' ');
                    if (label === 'included' || label === 'excluded') {
                        ret[label] = AnalyseLineToRegExp(value);// AnlaparseLine(ctx[1]);
                    } else if (label === 'recursion') {
                        ret[label] = (value === 'true');
                    } else {
                        ret[label] = value;//ctx.slice(1).join(' ');// ctx[1];
                    }
                }
            }
        });

        reader.on('close', () => {
            // default attribute
            if (!ret.recursion) {
                ret.recursion = false;
            }
            ret.rootFolder = resolveAbsolutePath(undefined, ret.rootFolder);
            if (!ret.outputFolder) {
                ret.outputFolder = './output';
            }
            ret.outputFolder = resolveAbsolutePath(path.dirname(file), ret.outputFolder);
            if (!ret.outputExtension) {
                ret.outputExtension = '.output';
            }
            // load project indexConfig
            ret.indexConfig = mergeIndexConfig(indexConfig, ret.rootFolder, ret.jsonIndex, ret.jsIndex);
            // scan and filter files
            ret.files = scanTemplateFiles(ret.rootFolder, ret.recursion, ret.included, ret.excluded);
            resolve(ret);
        });    
    });    
    // return Promise.resolve();
}

function AnalyseLineToRegExp(line: string): RegExp[] {
    const items = line.split(/[,]+/);
    const ret: RegExp[] = [];
    items.forEach(item => {
        if (item.length > 0) {
            ret.push(makeWildcardRegExp(item));
        }
    });
    return ret;
}

function makeWildcardRegExp(wildcard: string): RegExp {
    const w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape 
    return new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`);
  }

function scanTemplateFiles(folder: string, recursion: boolean, included?: RegExp[], excluded?: RegExp[]): string[] {
    const ret: string[] = [];
    if (!fs.existsSync(folder)) {
        return ret;
    }
    let files: string[] = fs.readdirSync(folder);
    files.forEach(file => {
        if ((!excluded || !checkTemplateIncluded(excluded, file))) { // excluded
            const filePath = path.join(folder, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory() && recursion) {
                ret.push(...scanTemplateFiles(filePath, recursion, included, excluded));
            } else if (stats.isFile()) {
                if(!included || checkTemplateIncluded(included, file)) { // include
                    ret.push(path.join(folder, file));
                }
            }
        }
    });

    return ret;
}

function checkTemplateIncluded(included: RegExp[], file: string): boolean {
    for (let i = 0; i < included.length; ++ i) {
        if (included[i].test(file)) {
            return true;
        }
    }
    return false;
}

function mergeIndexConfig(indexConfig: IndexConfig, dirname: string, jsonIndex?: string, jsIndex?: string): IndexConfig {
    const ret = { ...indexConfig };

    if (jsonIndex) {
        loadJSONIndex(ret, resolveAbsolutePath(dirname, jsonIndex));// path.join(dirname, jsonIndex));
    }

    if (jsIndex) {
        loadJSIndex(ret, resolveAbsolutePath(dirname, jsIndex));// path.join(dirname, jsIndex));
    }

    return ret;
}

// function mergeTemplateIndex(indexConfig: IndexConfig, template: Template): IndexConfig {
//     const templatePath = path.dirname(template.file);;
//     const ret = { ...indexConfig };

//     if (template.jsonIndex) {
//         loadJSONIndex(ret, path.join(templatePath, template.jsonIndex));
//     }

//     if (template.jsIndex) {
//         loadJSIndex(ret, path.join(templatePath, template.jsIndex));
//     }

//     return ret;
// }

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

    const blocks = scanIndeConfigFolder(jsPath + '/block');

    blocks.forEach(cfg => {
        const block = require(cfg).default as Block;
        if (block) {
            loadBlockConfig(indexConfig, block);
        } else {
            logger.warn('load block failed - ' + cfg);
        }
    });

    const symbols = scanIndeConfigFolder(jsPath + '/symbol');

    symbols.forEach(cfg => {
        const symbol = require(cfg).default as Symbol;
        if (symbol) {
            loadSymbolConfig(indexConfig, symbol);
        } else {
            logger.warn('load symbol failed - ' + cfg);
        }
    });    
}
