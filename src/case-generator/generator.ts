import { loadConfig } from "../index-config";
import { IndexConfig } from "../index-config/definition";


export default abstract class Generator {

    indexConfig!: IndexConfig;
    constructor(indexFolder: string) {
        this.loadIndexConfig(indexFolder);
    } 
    
    loadIndexConfig(indexFolder: string): void {
        this.indexConfig = loadConfig(indexFolder);
    }

    abstract translate(target: string): Promise<void>;
}