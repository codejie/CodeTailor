import path from "path";
import { translateTemplate } from "./generate-utils";
import Generator from "./generator"
import { loadTemplate } from "./load-utils";
import { outputToConsole, outputToFile } from "./output-utils";

export default class TemplateGenerator extends Generator {
    async translate(target: string): Promise<void> {
        const template = await loadTemplate(this.indexConfig, target);

        const result: string[] = translateTemplate(template.lines, this.indexConfig);

        if (template.output) {
            await outputToFile(result, path.join(path.dirname(target), template.output));
        } else {
            await outputToConsole(result);
        }        
    }
}