import express from 'express';
//import routes from '../routes/index.js';

export default function createExpressServer() {
    const app = express();
    //app.route('/', routes);
    return app;
}
