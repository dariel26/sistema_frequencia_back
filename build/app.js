"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const apiV1_1 = __importDefault(require("./routes/api/apiV1"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ extended: false, limit: "10mb" }));
app.use((0, cors_1.default)());
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use("/api/v1", apiV1_1.default);
exports.default = app;
