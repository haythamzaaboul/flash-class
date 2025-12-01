import initMySql from './mysqlLoader.js';
import expressLoader from './expressServer.js';

export default async function loaders() {
    const app = expressLoader();
    // connect to MySQL
    await initMySql;
    console.log('MySQL connected successfully in loaders.');
    return app;
}