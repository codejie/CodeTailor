import path from "path";
import Generator from "./generator";

export default class ProjectGenerator extends Generator {
    async translate(target: string): Promise<void> {
        throw new Error("Method not implemented.");
        // load config
        const config = require(path.join(target + '/project.config'));
        // load project index config
        // load template
    }
    
}