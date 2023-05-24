require("dotenv").config();
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { PAPEL_ALUNO } from "../interfaces/IAluno";
import { PAPEL_ADMIN, PAPEL_COORDENADOR } from "../interfaces/ICoordenador";
import { PAPEL_PRECEPTOR } from "../interfaces/IPreceptor";
import { IToken } from "../interfaces/IToken";

export function defineHabilidadesPara(infoUsuario: IToken) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  if (infoUsuario.papel === PAPEL_ADMIN) {
    can("manage", "all");
  } else if (infoUsuario.papel === PAPEL_ALUNO) {
    can("edit", "presenca");
    can("read", "all");
  } else if (infoUsuario.papel === PAPEL_COORDENADOR) {
    can("manage", "aluno");
    can("manage", "preceptor");
    can("manage", "grupo");
    can("manage", "atividade");
    can("manage", "local");
    can("manage", "ativLocal");
    can("manage", "precAtiv");
    can("manage", "estagioGrupo");
    can("read", "all");
  } else if (infoUsuario.papel === PAPEL_PRECEPTOR) {
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
