"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ARRAY_INVALIDO = "O dado deve ser um array";
const OBJETO_INVALIDO = "O dado deve ser um objeto";
const CAMPO_AUSENTE = (campoAusente, objeto) => {
    return `O campo ${campoAusente} está faltando no objeto ${JSON.stringify(objeto)}`;
};
const CAMPOS_ESPERADOS = (camposEsperados) => {
    let sql = "Os campos ";
    camposEsperados.forEach((c) => (sql += `${c} `));
    sql += "são esperados e nenhum está sendo enviado";
    return sql;
};
const cMessages = {
    verificaNovos: (dados, campos) => {
        if (!Array.isArray(dados))
            return ARRAY_INVALIDO;
        for (let dado of dados) {
            for (let campo of campos) {
                if (!(campo in dado)) {
                    return CAMPO_AUSENTE(campo, dado);
                }
            }
        }
        return;
    },
    verificaEdicao: (dados, campos) => {
        if (typeof dados !== "object")
            return OBJETO_INVALIDO;
        let campos_aux = [...campos];
        for (let campo of campos) {
            if (campo in dados)
                campos_aux = campos_aux.filter((c) => c !== campo);
        }
        if (campos_aux.length === campos.length)
            return CAMPOS_ESPERADOS(campos);
        return;
    },
};
exports.default = cMessages;
