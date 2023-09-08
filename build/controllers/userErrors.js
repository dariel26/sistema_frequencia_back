"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requisicaoRuim = exports.userError = void 0;
function userError(err, res) {
    if (process.env.NODE_ENV === "test") {
        console.log(err);
    }
    if (err.code === "ER_DUP_ENTRY") {
        res.status(500).json({ message: "Os dados fornecidos já existem nos registros ou estão duplicados." });
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "TokenExpiredError") {
        res.status(401).json({ message: "Sua sessão expirou, faça login novamente." });
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "JsonWebTokenError") {
        res.status(401).json({ message: "Algo deu errado ao criar sua sessão, tente novamente." });
    }
    else if ((err === null || err === void 0 ? void 0 : err.message) === "No Local") {
        res.status(400).json({ badLocal: true });
    }
    else if ((err === null || err === void 0 ? void 0 : err.message) === "NO ADMINS") {
        res.status(400).json({ message: "A operação não pode ser realizada pois o sistema ficaria sem ADMINS" });
    }
    else {
        res.status(500).json();
    }
}
exports.userError = userError;
function requisicaoRuim(condicao, res) {
    if (condicao) {
        res.status(400).json();
        return true;
    }
    return false;
}
exports.requisicaoRuim = requisicaoRuim;
