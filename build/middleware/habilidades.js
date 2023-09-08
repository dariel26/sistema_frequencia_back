"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineHabilidadesPara = void 0;
require("dotenv").config();
const ability_1 = require("@casl/ability");
function defineHabilidadesPara(infoUsuario) {
    const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
    if (infoUsuario.papel_atual === "ADMIN") {
        can("manage", "all");
    }
    else if (infoUsuario.papel_atual === "ALUNO(A)") {
        can("edit", "presenca");
        can("read", "all");
    }
    else if (infoUsuario.papel_atual === "COORDENADOR(A)") {
        can("edit", "aluno");
        can("edit", "preceptor");
        can("edit", "grupo");
        can("edit", "atividade");
        can("edit", "local");
        can("edit", "ativLocalAluno");
        can("edit", "precAtiv");
        can("edit", "estagioGrupo");
        can("edit", "coordenador"); //TODO Sempre e quando seja ele mesmo
        can("read", "all");
    }
    else if (infoUsuario.papel_atual === "PRECEPTOR(A)") {
        can("read", "all");
    }
    return build();
}
exports.defineHabilidadesPara = defineHabilidadesPara;
function checarHabilidade(acao, sujeito) {
    return (req, res, next) => {
        if (process.env.NODE_ENV === "test")
            return next();
        const habilidades = defineHabilidadesPara(req.infoToken);
        if (habilidades.can(acao, sujeito)) {
            return next();
        }
        else {
            return res.status(403).json({ inabilitado: true });
        }
    };
}
exports.default = checarHabilidade;
