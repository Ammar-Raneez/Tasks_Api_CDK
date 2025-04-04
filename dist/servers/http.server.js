"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
class HttpServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
    }
    getApp() {
        return this.app;
    }
    getServer() {
        return this.server;
    }
    listen(port, callback) {
        this.server.listen(port, callback);
    }
}
exports.HttpServer = HttpServer;
