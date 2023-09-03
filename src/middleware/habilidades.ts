require("dotenv").config();
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { IInfoUsuario } from "../interfaces";

export function defineHabilidadesPara(infoUsuario: IInfoUsuario) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  if (infoUsuario.papel_atual === "ADMIN") {
    can("manage", "all");
  } else if (infoUsuario.papel_atual === "ALUNO(A)") {
    can("edit", "presenca");
    can("read", "all");
  } else if (infoUsuario.papel_atual === "COORDENADOR(A)") {
    can("edit", "aluno");
    can("edit", "preceptor");
    can("edit", "grupo");
    can("edit", "atividade");
    can("edit", "local");
    can("edit", "ativLocalAluno");
    can("edit", "precAtiv");
    can("edit", "estagioGrupo");
    can("read", "all");
  } else if (infoUsuario.papel_atual === "PRECEPTOR(A)") {
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
