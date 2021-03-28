export { default as TemplateGenerator } from './template-generator';
export { default as ProjectGenerator } from './project-generator';

// import path from "path";
// import { loadConfig } from "../index-config";
// import { IndexConfig } from "../index-config/definition";
// import { translateTemplate } from "./generate-utils";
// import { loadProject, loadTemplate } from "./load-utils";
// import { outputToConsole, outputToFile } from "./output-utils";
// import { resolveAbsolutePath } from "./utils";

// interface CaseGeneratorConfig {
//     indexConfigFolder: string
// }

// export class CaseGenerator {
//     config: CaseGeneratorConfig;
//     indexConfig!: IndexConfig;
//     constructor(config: CaseGeneratorConfig) {
//         this.config = config;

//         this.loadIndexConfig();
//     }

//     loadIndexConfig(): void {
//         this.indexConfig = loadConfig(this.config.indexConfigFolder);
//     }

//     async translateProject(file: string): Promise<void> {
//         const project = await loadProject(this.indexConfig, file);

//         for (let i = 0; i < project.files.length - 1; ++ i) {
//             const tfile = project.files[i];
//             const template = await loadTemplate(project.indexConfig, tfile);
//             template.output = resolveAbsolutePath(project.outputFolder, path.basename(tfile, path.extname(tfile)));
//             const result: string[] = translateTemplate(template.lines, template.indexConfig);
//             await outputToFile(result, template.output);
//         }
//     }

//     async translateTemplate(file: string): Promise<void> {
//         const template = await loadTemplate(this.indexConfig, file);

//         // const dir = path.dirname(file);

//         // if (template.indexConfig) {
//         //     const index = path.join(dir, template.indexConfig);
//         //     loadTemplateIndex(this.indexConfig, index);//template.indexConfig);
//         // }
//         const result: string[] = translateTemplate(template.lines, template.indexConfig);

//         if (template.output) {
//             await outputToFile(result, resolveAbsolutePath(path.dirname(file), template.output));
//         } else {
//             await outputToConsole(result);
//         }
//     }
// }