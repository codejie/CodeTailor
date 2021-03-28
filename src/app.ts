import { EventEmitter } from "events";
import { resolveAbsolutePath } from "./case-generator/utils";
import { ProjectGenerator, TemplateGenerator } from './case-generator';
import logger from "./logger";

export interface ConfigObject {
    Logger: object
}

interface Argument {
    indexFloder?: string,
    isProject?: boolean;
    target?: string
}


export class App extends EventEmitter {
    readonly config: ConfigObject;

    constructor(config: ConfigObject) {
        super();
        this.config = config;

        logger.info(process.argv);
    }

    async init(): Promise<void> {
        return Promise.resolve();
    }

    async start(): Promise<void> {
        // test();
        // const lines = testBlock(template);
        // testTemplate();

        // const template = await loadTemplate('/Users/Jie/Code/workspace/tailor/src/test/template/case.template');
        // logger.debug(template);

        // const argv: string[] = process.argv;
        // if (argv.length < 4 || argv[2] !== '-f') {
        //     console.log('usage: node index.js -f <template>');
        //     return Promise.resolve();
        // }
        // const template = argv[3];

        const argv = this.parseArgv(process.argv);
        if (!argv) {
            console.log('usage: node index.js [-i indexFloder] [-t <template> || -p <project>]');
            return Promise.resolve();            
        }
        if (argv.isProject) {
            const generator = new ProjectGenerator(argv.indexFloder);
    
            await generator.translate(resolveAbsolutePath(undefined, argv.target!));//'/Users/Jie/Code/workspace/tailor/src/example/case.template');//path.join(__dirname, './example/case.template'));

        } else {
            // const template = '/Users/Jie/Code/workspace/tailor/src/example/t1.template';

            const generator = new TemplateGenerator(argv.indexFloder);
    
            await generator.translate(resolveAbsolutePath(undefined, argv.target!));//'/Users/Jie/Code/workspace/tailor/src/example/case.template');//path.join(__dirname, './example/case.template'));
        }
    }

    async shutdown(): Promise<void> {
        return Promise.resolve();
    }

    parseArgv(argv: string[]): Argument | null {
        if (argv.length < 4) {
            return null;
        }

        const ret: Argument = {}
        for (let i = 0; i < argv.length; ++ i) {
            if (argv[i] === '-i') {
                ret.indexFloder = argv[++ i];
            } else if (argv[i] === '-p') {
                ret.isProject = true;
                ret.target = argv[++ i];
            } else if (argv[i] === '-t') {
                ret.isProject = false;
                ret.target = argv[++ i];
            }
        }
        if (ret.isProject !== undefined && ret.target) {
            return ret;
        }
        return null;
    }
}