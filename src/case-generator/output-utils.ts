import fs from 'fs';
import logger from "../logger";

export function outputToFile(lines: string[], file: string): Promise<void> {
    logger.debug(lines);

    // function write(fd)

    return new Promise<void>((resolve, reject) => {
        const fd = fs.createWriteStream(file, { flags: 'w' });
        lines.forEach(line => {
            fd.write(line + '\r\n');
        });
        fd.close();
        resolve();
    });
}

export function outputToConsole(lines: string[]): Promise<void> {
    lines.forEach(line => {
        console.log(line);
    });
    // console.log(lines);
    return Promise.resolve();
}