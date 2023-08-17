"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requisicaoRuim = exports.trataErr = void 0;
require("dotenv").config();
function trataErr(err, res) {
    if (process.env.NODE_ENV !== "test") {
        console.log(err);
    }
    if (err.code === "ER_DUP_ENTRY") {
        res.status(500).json({ existe: true });
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "TokenExpiredError") {
        res.status(401).json();
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "JsonWebTokenError") {
        res.status(401).json();
    }
    else if ((err === null || err === void 0 ? void 0 : err.message) === "No Local") {
        res.status(400).json({ badLocal: true });
    }
    else {
        res.status(500).json();
    }
}
exports.trataErr = trataErr;
function requisicaoRuim(condicao, res) {
    if (condicao) {
        res.status(400).json();
        return true;
    }
    return false;
}
exports.requisicaoRuim = requisicaoRuim;
