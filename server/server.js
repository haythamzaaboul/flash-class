import loaders from "./loaders/index.js";
import config from "./config/config.js";

async function startServer() {
    const app = await loaders();
    
    const PORT = config.port || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${config.env} mode.`);
    });
}

startServer();