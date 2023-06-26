require("dotenv").config();
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { IToken } from "../interfaces";
import { PAPEL_ADMIN, PAPEL_ALUNO, PAPEL_COORDENADOR, PAPEL_PRECEPTOR } from "../papeis";

export function defineHabilidadesPara(infoToken: IToken) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  if (infoToken.papel === PAPEL_ADMIN) {
    can("manage", "all");
  } else if (infoToken.papel === PAPEL_ALUNO) {
    can("edit", "presenca");
    can("read", "all");
  } else if (infoToken.papel === PAPEL_COORDENADOR) {
    can("edit", "aluno");
    can("edit", "preceptor");
    can("edit", "grupo");
    can("edit", "atividade");
    can("edit", "local");
    can("edit", "ativLocalAluno");
    can("edit", "precAtiv");
    can("edit", "estagioGrupo");
    can("read", "all");
  } else if (infoToken.papel === PAPEL_PRECEPTOR) {
    can("read", "all");
  }
  return build();
}

function checarHabilidade(acao: string, sujeito: string) {
  return (req: any, res: any, next: any) => {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can(acao, sujeito)) {
      return next();
    } else {
      return res.status(403).json({ inabilitado: true });
    }
  };
}

export default checarHabilidade;
