import { loadConfig } from "../index-config";
import { IndexConfig } from "../index-config/definition";
import { resolveAbsolutePath } from "./utils";


export default abstract class Generator {

    indexConfig!: IndexConfig;
    constructor(indexFolder?: string) {
        if (indexFolder) {
            this.loadIndexConfig(resolveAbsolutePath(undefined, indexFolder));
        } else {
            this.indexConfig = {
                block: {},
                symbol: {}
            }
        }
    } 
    
    loadIndexConfig(indexFolder: string): void {
        this.indexConfig = loadConfig(indexFolder);
    }

    abstract translate(target: string): Promise<void>;
}