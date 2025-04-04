"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const servers_1 = require("./servers");
const config_1 = require("./common/config");
const loaders_1 = require("./loaders");
const utils_1 = require("./utils");
class App {
    constructor() {
        this.httpServer = new servers_1.HttpServer();
        this.loadLoaders();
    }
    loadLoaders() {
        const expressLoader = new loaders_1.ExpressLoader(this.httpServer.getApp());
        loaders_1.MongoDBLoader.getInstance();
        expressLoader.load();
    }
    startServer() {
        const port = config_1.AppConfig.APP_PORT;
        if (port) {
            this.httpServer.listen(parseInt(port), () => {
                utils_1.logger.info(`✅ Server started successfully on port ${port}!`);
            });
        }
    }
}
const app = new App();
app.startServer();
