import path from "path";
import { translateTemplate } from "./generate-utils";
import Generator from "./generator";
import { loadProject, loadTemplate } from "./load-utils";
import { outputToFile } from "./output-utils";
import { resolveAbsolutePath } from "./utils";

export default class ProjectGenerator extends Generator {
    async translate(target: string): Promise<void> {
        const project = await loadProject(this.indexConfig, target);

        for (let i = 0; i < project.files.length; ++ i) {
            const tfile = project.files[i];
            const template = await loadTemplate(project.indexConfig, tfile);
            template.output = resolveAbsolutePath(project.outputFolder, path.basename(tfile, path.extname(tfile)) + project.outputExtension);
            const result: string[] = translateTemplate(template.lines, template.indexConfig);
            await outputToFile(result, template.output);
        }        
    }
    
}