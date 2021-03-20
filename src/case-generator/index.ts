import path from "path";
import { loadConfig } from "../index-config";
import { IndexConfig } from "../index-config/definition";
import { translateTemplate } from "./generate-utils";
import { loadTemplate } from "./load-utils";
import { outputToConsole, outputToFile } from "./output-utils";

interface CaseGeneratorConfig {
    indexConfigFolder: string
}

export class CaseGenerator {
    config: CaseGeneratorConfig;
    indexConfig!: IndexConfig;
    constructor(config: CaseGeneratorConfig) {
        this.config = config;

        this.loadIndexConfig();
    }

    loadIndexConfig(): void {
        this.indexConfig = loadConfig(this.config.indexConfigFolder);
    }

    translateProject(): void {

    }

    async translateTemplate(file: string): Promise<void> {
        const template = await loadTemplate(this.indexConfig, file);

        // const dir = path.dirname(file);

        // if (template.indexConfig) {
        //     const index = path.join(dir, template.indexConfig);
        //     loadTemplateIndex(this.indexConfig, index);//template.indexConfig);
        // }
        const result: string[] = translateTemplate(template.lines, this.indexConfig);

        if (template.output) {
            await outputToFile(result, path.join(path.dirname(file), template.output));
        } else {
            await outputToConsole(result);
        }
    }
}