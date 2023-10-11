import { MongoQuery, SubjectRawRule, SubjectType } from "@casl/ability";
import { ExtractSubjectType, Subject } from "@casl/ability/dist/types/types";
import { Request } from "express";

export type PAPEIS = "ALUNO(A)" | "PRECEPTOR(A)" | "COORDENADOR(A)" | "ADMIN";
export type TIPO_USUARIO = "ALUNO" | "COORDENADOR" | "PRECEPTOR";
export type ESTADO_PRESENCA = "CRIADA" | "PRESENTE" | "REJEITADA" | "ATESTADO";

export interface IInfoUsuario {
  id_usuario: number;
  nome: string;
  login: string;
  papeis: PAPEIS[];
  papel_atual: PAPEIS;
  tipo: TIPO_USUARIO;
  regrasHabilidades?: SubjectRawRule<
    string,
    ExtractSubjectType<Subject>,
    MongoQuery
  >[];
}

export interface IToken {
  tipo: string;
  papeis: string;
  papel_atual: string;
  nome: string;
  login: string;
  id_usuario: string;
}

//Banco de dados
export interface IUsuario {
  id_usuario: number;
  nome: string;
  login: string;
  senha: string;
  papeis: PAPEIS[];
  papel_atual: PAPEIS;
  tipo: TIPO_USUARIO;
}

export interface IAlunoGrupo {
  id_usuario: number;
  id_grupo: number;
}

export interface JWT {
  id_token: number;
  token: string;
  validade: string;
}

export interface IEstagio {
  id_estagio: number;
  nome: string;
}

export interface IGrupo {
  id_grupo: number;
  nome: string;
}

export interface IAtividade {
  id_atividade: number;
  id_estagio: number;
  nome: string;
  hora_inicial: string;
  hora_final: string;
  periodo: string;
}

export interface IPrecAtividade {
  id_atividade: number;
  id_usuario: number;
}

export interface ILocalAtividade {
  id_atividade: number;
  id_local: number;
}

export interface IDataAtividade {
  id_dataatividade: number;
  id_atividade: number;
  excluida: boolean;
  data: string;
}

export interface IAlunoDataAtividade {
  id_alunodataatividade: number;
  data: string;
  id_usuario: number;
  id_atividade: number;
  estado: ESTADO_PRESENCA;
  periodo: string;
  id_dataatividade: number;
}

export interface ILocal {
  id_local: number;
  nome: string;
  coordenadas: string;
}

export interface IEstagioGrupo {
  id_estagio: number;
  id_grupo: number;
  id_estagiogrupo: number;
  data_inicial: Date;
  data_final: Date;
}

export interface ICoordEstagio {
  id_usuario: number;
  id_estagio: number;
}

export interface CustomRequest extends Request {
  infoToken: IInfoUsuario;
}

export interface ISubscricao {
  id_usuario: number;
  endpoint: string;
  expiracao: Date;
  u_key: string;
  autenticidade: string;
}

export interface IViewAluno {
  id_usuario: number;
  nome: string;
  papeis: string;
  papel_atual: string;
  matricula: string;
  id_grupo: number;
  nome_grupo: string;
  estagios: {
    nome_estagio: string;
    data_inicial: string;
    data_final: string;
  }[];
  datas: {
    id_atividade: number;
    nome_atividade: string;
    hora_inicial: string;
    hora_final: string;
    data: string;
    estado: ESTADO_PRESENCA;
    id_alunodataatividade: number;
    excluida: boolean;
    periodo: string;
    id_dataatividade: number;
  }[];
}

export interface IViewAtividade {
  id_atividade: number;
  nome_atividade: string;
  id_estagio: number;
  hora_inicial: string;
  hora_final: string;
  periodo: string;
  nome_preceptor: string;
  nome_local: string;
  datas: {
    data: string;
    excluida: boolean;
    id_dataatividade: number;
    periodo: string;
    alunos: { nome: string; id_aluno: number; estado: boolean }[];
  }[];
}

export interface IViewGrupo {
  id_grupo: number;
  nome_grupo: string;
  alunos: {
    nome: string;
    id_usuario: number;
    matricula: string;
  }[];
  estagios: {
    nome: string;
    id_estagio: number;
    id_usuario: number;
    nome_coordenador: string;
    data_inicial: string;
    data_final: string;
  }[];
}

export interface IViewEstagio {
  id_estagio: number;
  nome_estagio: string;
  nome_coordenador: string;
  grupos: {
    nome: string;
    id_grupo: number;
    data_inicial: string;
    data_final: string;
    id_estagiogrupo: number;
    alunos: {
      nome: string;
      id_usuario: number;
      matricula: string;
    }[];
  }[];
  atividades: {
    id_atividade: number;
    nome_atividade: string;
    id_estagio: number;
    hora_final: string;
    hora_inicial: string;
    nome_preceptor: string;
    nome_local: string;
    periodo: string;
    datas: {
      data: string;
      excluida: boolean;
      id_dataatividade: number;
      periodo: string;
      alunos: { nome: string; id_aluno: number; estado: boolean }[];
    }[];
  }[];
}
