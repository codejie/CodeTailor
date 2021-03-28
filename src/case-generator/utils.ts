
import path from "path";

export function resolveAbsolutePath(dirname: string | undefined, str: string): string {
    return path.resolve(dirname || __dirname, str);
    // if (path.isAbsolute(folder)) {
    //     return folder;
    // }
    // if (path.isAbsolute(dirname)) {
    //     return path.join(dirname, folder);
    // }
    // return path.join(__dirname, dirname, folder);
}

// export function makeFileAbsolutePath(dirname: string, file: string): string {
//     return path.resolve(dirname, file);
//     // const dir = path.isAbsolute(dirname) ? dirname : path.join(__dirname, dirname);
//     // const filePath = path.dirname()


//     // // check file
//     // const filePath: string = fs.
//     // // get process path
//     // // path.isAbsolute
//     // return '';
// }