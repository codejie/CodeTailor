import logger from "./src/logger"
import { App, ConfigObject } from "./src/app"
import config from './config.json'

async function main(): Promise<void> {
    // process.env.NODE_ENV = "production";
    process.on('uncaughtException', error => {
        logger.error('uncaughtException - ', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.error('unhandleRejection - ' + reason);
        promise.catch(error => {
            logger.error('process error - ', error);
        });
    });

    const app = new App(<ConfigObject>config);

    process.on('SIGINT', signal => {
        logger.info('catch ctrl-c.');
        app.shutdown().then(() => {
            logger.info('app exit.');
            process.exit(0);
        });
    });

    try {
        await app.init();
        logger.info('app start.');
        await app.start();
        await app.shutdown(); // ?
    } catch (error) {
        logger.error('app runtim error - ', error);
    }
    // process.stdin.resume();
    // await app.shutdown();
}

main();

// console.log('hello world');
