"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressLoader = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const httpContext = __importStar(require("express-http-context"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const rfs = __importStar(require("rotating-file-stream"));
const constants_1 = require("../common/constants");
const config_1 = require("../common/config");
const middlewares_1 = require("../common/middlewares");
const routes_1 = require("../routes/routes");
class ExpressLoader {
    constructor(app) {
        this.app = app;
        this.app = app;
    }
    loadMiddleware() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use((0, helmet_1.default)());
        this.app.use(middlewares_1.apiRateLimiter);
        this.app.use(httpContext.middleware);
        const accessLogStream = rfs.createStream(`logs/access.log`, {
            interval: '1d',
            compress: 'gzip',
        });
        if (config_1.AppConfig.APP_ENV == constants_1.ENVIRONMENTS.DEV) {
            this.app.use((0, morgan_1.default)('tiny'));
        }
        else {
            this.app.use((0, morgan_1.default)('tiny', { stream: accessLogStream }));
        }
        // Add FE Origin
        //this.app.use(
        //  cors({
        //    origin: '',
        //    credentials: true,
        //    allowedHeaders: ['Content-Type', 'X-Requested-With', 'Accept', 'Origin', 'Cookie'],
        //    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        //    exposedHeaders: ['Set-Cookie'],
        //  }),
        //);
    }
    loadRoutes() {
        (0, routes_1.SetRoutes)(this.app);
    }
    load() {
        this.loadMiddleware();
        this.loadRoutes();
    }
}
exports.ExpressLoader = ExpressLoader;
