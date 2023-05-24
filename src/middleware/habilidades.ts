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

const mHabilidade = {
  lerAluno(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "aluno")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarAluno(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "aluno")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerPreceptor(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "preceptor")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarPreceptor(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "preceptor")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerCoordenador(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "coordenador")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarCoordenador(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "coordenandor")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerGrupo(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "grupo")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarGrupo(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "grupo")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerEstagio(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "estagio")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarEstagio(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "estagio")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerAtividade(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "atividade")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarAtividade(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "atividade")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerPresenca(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "presenca")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarPresenca(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "presenca")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerEstagioGrupo(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "estagioGrupo")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarEstagioGrupo(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "estagioGrupo")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerAlunoAtiv(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "alunoAtiv")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarAlunoAtiv(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "alunoAtiv")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerPrecAtiv(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "precAtiv")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarPrecAtiv(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "precAtiv")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerAtivLocal(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "ativLocal")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarAtivLocal(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "ativLocal")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerLocal(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("read", "local")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarLocal(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "local")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  lerCoordEstagio(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "coordEstagio")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
  editarCoordEstagio(req: any, res: any, next: any) {
    if (process.env.NODE_ENV === "test") return next();
    const habilidades = defineHabilidadesPara(req.infoToken);
    if (habilidades.can("edit", "coordEstagio")) {
      return next();
    } else {
      return res.status(401).json({ inabilitado: true });
    }
  },
};

export default mHabilidade;
