import logger from "../logger";

import BlockIndexes from '../../test/block.json';

export interface Item {
    type: number, // 1: line, 2: block
    template?: string,
    items?: Item[]
}

interface BlockResult {
    pos: number,
    label: string,
    items: Item[]
}

// const items: Item[] = [];

const lines: string[] = [
    '@#header#@',
    'line1;',
    '@#Loop#@',
    'line2;',
    '@#aa#@',
    'line2.9;',
    'line3;',
    '@#aa#@',
    '@#Loop#@',
    'line4;',
    '@#header#@'
];

function scanItems(lines: string[]): Item[] {
    const ret: Item[] = [];

    let i = 0;
    while (i < lines.length) {
        const item = lines[i];
        const block = checkBlock(item);
        if (block) {
            const { pos, items } = scanBlockItems(block, lines, i + 1);
            ret.push({
                type: 2,
                template: block,
                items: items                
            });
            i = pos + 1;
        } else {
            ret.push({
                type: 1,
                template: item
            });
            
            ++ i;
        }
    }

    return ret;
}

function checkBlock(str: string): string | null {
    str = str.trim();
    if (str.length < 4) {
        return null;
    }

    if (str.charAt(0) !== '@' || str.charAt(1) !== '#'
        || str.charAt(str.length - 2) !== '#' || str.charAt(str.length - 1) !== '@') {
            return null;
    }

    return str.substring(2, str.length - 2);
}

function scanBlockItems(label: string, lines: string[], pos: number): BlockResult {
    const ret: Item[] = [];
    let i = pos;
    while (i < lines.length) {
        const item = lines[i];
        const block = checkBlock(item);
        if (block) {
            if (block !== label) {
                const { pos, items } = scanBlockItems(block, lines, i + 1);
                ret.push({
                    type: 2,
                    template: block,
                    items: items                
                });
                i = pos + 1;        
            } else {
                return {
                    pos: i,
                    label: label,
                    items: ret
                };
            }
        } else {
            ret.push({
                type: 1,
                template: item                
            });

            ++ i;
        }
    }
    throw new Error('illegal block - ' + label);
}

function generate(items?: Item[]): string[] {
    const ret: string[] = [];

    if (!items) {
        return ret;
    }
    items.forEach((item: Item) => {
        if (item.type === 2) {
            ret.push(...generateBlock(item));
        } else if (item.type === 1) {
            ret.push(generateLine(item));
        }
    });
    return ret;
}

function generateBlock(item: Item): string[] {
    const ret: string[] = [];
    logger.debug('block - ' + item.template);
    if (item.items) {
        item.items.forEach((item: Item) => {
            if (item.type === 2) {
                let loop = 1;
                if (item.template) {
                    const cfg: any | undefined = (BlockIndexes as any)[item.template];
                    if (cfg) {
                        loop = cfg?.loop;
                    }
                }
                for (let i = 0; i < loop; ++ i) {
                    ret.push(...generateBlock(item));
                }
            } else if (item.type === 1) {
                ret.push(generateLine(item));
            }
        });        
    }
    return ret;
}

function generateLine(item: Item): string {
    logger.debug('line - ' + item.template);
    return item.template || '';
}

export function testBlock(lines: string[]): string[]  {
    // logger.debug(scanItems(lines));
    const items: Item[] = scanItems(lines);
    const ret = generate(items);
    console.log(ret);
    return ret;
}