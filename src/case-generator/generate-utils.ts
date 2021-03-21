import logger from "../logger";
import { BlockNested, IndexConfig, IndexParams } from "../index-config/definition";

interface Item {
    type: number, // 1: line, 2: block
    data: string | IndexParams,
    items?: Item[]
}

interface BlockResult {
    pos: number,
    block: IndexParams,
    items: Item[]
}

// interface IndexParams {
//     index: string,
//     params?: any
// }

// interface BlockNested {
//     block: IndexParams,
//     loop: number      
// }

function parseIndexParams(str: string): IndexParams {
    const begin = str.indexOf('{');
    if (begin !== -1) {
        const end = str.indexOf('}', begin + 1);
        if (end !== -1) {
            return {
                index: str.substring(0, begin).trim(),
                params: JSON.parse(str.substring(begin, end + 1))
            };
        } else {
            throw new Error('illegel Index - ' + str);
        }
    } else {
        return {
            index: str.trim()
        };
    }
}

function checkBlock(str: string): IndexParams | null {
    str = str.trim();
    if (str.length < 4) {
        return null;
    }

    if (str.charAt(0) !== '@' || str.charAt(1) !== '#'
        || str.charAt(str.length - 2) !== '#' || str.charAt(str.length - 1) !== '@') {
            return null;
    }

    str = str.substring(2, str.length - 2);
    // parse parameters
    return parseIndexParams(str);

    // return str.substring(2, str.length - 2);
}

function removeEscape(str: string): string {
    return str.replace(/`@/g, '@').replace(/`#/g, '#');
}

function parseTemplate(lines: string[]): Item[] {
    const ret: Item[] = [];

    let i = 0;
    while (i < lines.length) {
        let line = lines[i];
        const result = checkBlock(line);
        line = removeEscape(line);
        if (result) {
            const { pos, block, items } = scanBlockItems(result, lines, i + 1);
            ret.push({
                type: 2,
                data: block,
                items: items                
            });
            i = pos + 1;
        } else {
            ret.push({
                type: 1,
                data: line
            });
            
            ++ i;
        }
    }

    return ret;
}

function scanBlockItems(parent: IndexParams, lines: string[], pos: number): BlockResult {
    const ret: Item[] = [];
    let i = pos;
    while (i < lines.length) {
        let line = lines[i];
        const result = checkBlock(line); // index & params
        line = removeEscape(line);
        if (result) {
            if (result.index !== parent.index) {
                const { pos, block, items } = scanBlockItems(result, lines, i + 1);
                ret.push({
                    type: 2,
                    data: block,
                    // template: block,
                    items: items                
                });
                i = pos + 1;        
            } else {
                return {
                    pos: i,
                    block: parent,
                    items: ret
                    // label: label,
                    // items: ret
                };
            }
        } else {
            ret.push({
                type: 1,
                data: line             
            });

            ++ i;
        }
    }
    throw new Error('illegal block - ' + parent.index);
}

function generate(items: Item[], indexConfig: IndexConfig, nested: BlockNested[] = []): string[] {
    const ret: string[] = [];

    items.forEach((item: Item) => {
        if (item.type === 2) {
            ret.push(...generateBlock(item, indexConfig, nested));
        } else if (item.type === 1) {
            ret.push(generateLine(item, indexConfig, nested));
        }
    });
    return ret;
}

function generateBlock(item: Item, indexConfig: IndexConfig, nested: BlockNested[]): string[] {
    const ret: string[] = [];
    const block: IndexParams = (item.data as IndexParams);

    if (nested.length > 0) {
        logger.debug('block - %s nested:%s - %d', block.index, nested[nested.length - 1]?.block, nested[nested.length - 1]?.loop);
    } else {
        logger.debug('block - %s', block.index);
    }

    if (item.items) {
        let loop = 1;
        let cfg: any | undefined = indexConfig.block[block.index];
        if (cfg) {
            if (block.params) {
                cfg = { ...cfg, ...block.params };
            }
            if (cfg.loop) {
                loop = cfg.loop;
            }
        }
        // if (item.template) {
        //     const cfg: any | undefined = indexConfig.block[item.template];
        //     if (cfg && cfg.loop) {
        //         loop = cfg.loop;
        //     }
        // }

        for (let i = 0; i < loop; ++ i) {
            nested.push({
                block: block,
                loop: i
            });

            ret.push(...generate(item.items, indexConfig, nested));

            nested.pop();
        }    
    }
    return ret;
}

function generateLine(item: Item, indexConfig: IndexConfig, nested: BlockNested[]): string {
    const line: string = (item.data as string);

    if (nested.length > 0) {
        logger.debug('line - %s nested:%s - %d', line, nested[nested.length - 1].block, nested[nested.length - 1].loop);    
    } else {
        logger.debug('line - ' + line);
    }
    // if (line) {
    return scanSymbolItems(line, indexConfig, nested, 0);
    // }
    // return '';
}

function scanSymbolItems(line: string, indexConfig: IndexConfig, nested: BlockNested[], position: number): string {
    let ret = '';
    let found = false;
    let start: number  = 0;
    let pos = line.indexOf('@@', start);
    while (pos !== -1) {
        if (found === false) {
            logger.debug('str = ' + line.substring(start, pos));
            ret += removeEscape(line.substring(start, pos));
            found = true;
        } else {
            logger.debug('index = ' + line.substring(start, pos));
            const index = parseIndexParams(line.substring(start, pos));
            ret += translateSymbol(index, indexConfig, nested, position);
            // ret += translateSymbol(line.substring(start, pos), indexConfig, nested, position);

            found = false;
        }
        start = pos + 2;
        pos = line.indexOf('@@', start);
    }

    if (found) {
        throw new Error('template illegal.');
    }
    // if (start < template.length - 1) {
        logger.debug('str = ' + line.substring(start));
        ret += removeEscape(line.substring(start));
    // }
    return ret;
}

function translateSymbol(index: IndexParams, indexConfig: IndexConfig, nested: BlockNested[], position?: number): string {
    let cfg: any | undefined  = indexConfig.symbol[index.index];
    if (cfg) {
        if (index.params) {
            cfg = { ...cfg, ...index.params };
        }
        let ret: string = '';
        for (let i = 0; i < cfg.size; ++ i) {
            if (cfg.isTemplate) {
                ret += scanSymbolItems(cfg.template, indexConfig, nested, i);
            } else {
                ret += cfg.output(indexConfig, nested, i);
            }
            if (cfg.delimiter) {
                if (i < cfg.size - 1) {
                    ret += cfg.delimiter;
                }
            }
        }
        // if (cfg.isTemplate) {
        //     for (let i = 0; i < cfg.size; ++ i) {
        //         ret += scanSymbolItems(cfg.template, indexConfig, nested, i);
        //         if (cfg.delimiter) {
        //             if (i < cfg.size - 1) {
        //                 ret += cfg.delimiter;
        //             }
        //         }
        //     }
        // } else {
        //     ret = cfg.output(indexConfig, nested, position);
        // }

        return ret;
    }

    throw new Error('symbol not found - ' + index.index);
}

export function translateTemplate(template: string[], indexConfig: IndexConfig): string[] {
    const items: Item[] = parseTemplate(template);
    return generate(items, indexConfig);
}