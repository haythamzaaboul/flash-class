import express from 'express';
import routes from '../api/index.js';

export default function createExpressServer() {
    const app = express();
    app.use('/api', routes);
    return app;
}
