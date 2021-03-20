import logger from "../logger";
import { loadConfig } from "./index-config";
import { IndexConfig, Nested } from "./index-config/definition";

interface Item {
    type: number, // 1: line, 2: block
    template: string,
    items?: Item[]
}

interface BlockResult {
    pos: number,
    label: string,
    items: Item[]
}

function parseTemplate(lines: string[]): Item[] {
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

function generate(items: Item[], indexConfig: IndexConfig, nested: Nested[] = []): string[] {
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

function generateBlock(item: Item, indexConfig: IndexConfig, nested: Nested[]): string[] {
    const ret: string[] = [];
    if (nested.length > 0) {
        logger.debug('block - %s nested:%s - %d', item.template, nested[nested.length - 1]?.block, nested[nested.length - 1]?.loop);
    } else {
        logger.debug('block - %s', item.template);
    }

    if (item.items) {
        let loop = 1;
        if (item.template) {
            const cfg: any | undefined = indexConfig.block[item.template];
            if (cfg && cfg.loop) {
                loop = cfg.loop;
            }
        }
        for (let i = 0; i < loop; ++ i) {

            nested.push({
                block: item.template,
                loop: i
            });

            ret.push(...generate(item.items, indexConfig, nested));

            nested.pop();
        }    
    }
    return ret;
}

function generateLine(item: Item, indexConfig: IndexConfig, nested: Nested[]): string {
    if (nested.length > 0) {
        logger.debug('line - %s nested:%s - %d', item.template, nested[nested.length - 1].block, nested[nested.length - 1].loop);    
    } else {
        logger.debug('line - ' + item.template);
    }
    if (item.template) {
        return scanLineTemplate(item.template, indexConfig, nested, 0);
    }
    return '';
}

function scanLineTemplate(template: string, indexConfig: IndexConfig, nested: Nested[], position: number): string {
    let ret = '';
    let found = false;
    let start: number  = 0;
    let pos = template.indexOf('@@', start);
    while (pos !== -1) {
        if (found === false) {
            logger.debug('str = ' + template.substring(start, pos));
            ret += template.substring(start, pos);
            found = true;
        } else {
            logger.debug('index = ' + template.substring(start, pos));

            ret += translateIndex(template.substring(start, pos), indexConfig, nested, position);

            found = false;
        }
        start = pos + 2;
        pos = template.indexOf('@@', start);
    }

    if (found) {
        throw new Error('template illegal.');
    }
    // if (start < template.length - 1) {
        logger.debug('str = ' + template.substring(start));
        ret += template.substring(start);
    // }
    return ret;
}

function translateIndex(index: string, indexConfig: IndexConfig, nested: Nested[], position?: number): string {
    const cfg: any = indexConfig.symbol[index];
    if (cfg) {
        let ret: string = ''
        if (cfg.isTemplate) {
            for (let i = 0; i < cfg.size; ++ i) {
                ret += scanLineTemplate(cfg.template, indexConfig, nested, i);
                if (cfg.delimiter) {
                    if (i < cfg.size - 1) {
                        ret += cfg.delimiter;
                    }
                }
            }
        } else {
            ret = cfg.output(indexConfig, nested, position);
            // if (cfg.output) {
            //     ret = cfg.output(indexConfig, nested, position);
            // } else {
            //     ret = cfg.ext.value || '';
            // }
        }

        return ret;
    }

    throw new Error('index not found - ' + index);
}

const templates: string[] = [
    'class Test {',
    '@#case#@',
    '   void test_@@case_name@@() {',
    '       byte[] temp = { @@value@@ };',
    '       system.out.println(temp);',
    '   }',
    '@#case#@',
    '}'
];

// import indexConfig from '../../test/template.json';

export function testTemplate(): void {
    const indexConfig = loadConfig();
    const items: Item[] = parseTemplate(templates);
    const ret: string[] = generate(items, indexConfig);
    console.log(ret);

}
