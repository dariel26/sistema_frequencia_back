"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : "5000");
const host = process.env.HOSTNAME;
app_1.default.get("/", (_, res) => {
    res.json("API ESTÁ RODANDO");
});
app_1.default.listen(port, host !== null && host !== void 0 ? host : "localhost", () => {
    console.log(`Rodando no endereço: http://${host}:${port}`);
});
exports.default = app_1.default;
