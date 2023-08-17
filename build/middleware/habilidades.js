"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineHabilidadesPara = void 0;
require("dotenv").config();
const ability_1 = require("@casl/ability");
const papeis_1 = require("../papeis");
function defineHabilidadesPara(infoToken) {
    const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
    if (infoToken.papel === papeis_1.PAPEL_ADMIN) {
        can("manage", "all");
    }
    else if (infoToken.papel === papeis_1.PAPEL_ALUNO) {
        can("edit", "presenca");
        can("read", "all");
    }
    else if (infoToken.papel === papeis_1.PAPEL_COORDENADOR) {
        can("edit", "aluno");
        can("edit", "preceptor");
        can("edit", "grupo");
        can("edit", "atividade");
        can("edit", "local");
        can("edit", "ativLocalAluno");
        can("edit", "precAtiv");
        can("edit", "estagioGrupo");
        can("read", "all");
    }
    else if (infoToken.papel === papeis_1.PAPEL_PRECEPTOR) {
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
