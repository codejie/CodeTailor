import logger from "../logger";

// interface Item {
//     key: string,
//     value: string
// }

// const items: Item[] = [];

import Indexes from "../../test/line.json";

const template: string = 'byte[] temp = { @@value@@ }; @@value@@ ';

function scan(template: string): string {
    let ret = '';
    let found = false;
    let start: number  = 0;
    // let end = template.length - 1;
    let pos = template.indexOf('@@', start);
    while (pos !== -1) {
        if (found === false) {
            logger.debug('str = ' + template.substring(start, pos));
            ret += template.substring(start, pos);
            found = true;
        } else {
            logger.debug('index = ' + template.substring(start, pos));

            ret += translateIndex(template.substring(start, pos));

            found = false;
        }
        start = pos + 2;
        pos = template.indexOf('@@', start);
    }

    if (found) {
        throw new Error('template illegal.');
    }
    if (start < template.length - 1) {
        logger.debug('str = ' + template.substring(start));
        ret += template.substring(start);
    }
    return ret;
}

function translateIndex(index: string): string {
    const cfg: any = (Indexes as any)[index];
    if (cfg) {
        if (cfg.type === 'template') {
            if (!cfg.number) {
                cfg.number = 1;
            }
            let ret = '';
            for (let i = 0; i < cfg.number; ++ i) {
                ret += scan(cfg.template);
                if (i < cfg.number - 1) {
                    ret += cfg.split;
                }
            }
            return ret;
        } else if (cfg.type === 'Byte') {
            return cfg.attribute.value.toString();
        }
    }
    throw new Error('index not found - ' + index);
}


export function testLine(template: string): void {
    logger.debug(scan(template));
}