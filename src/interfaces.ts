import { MongoQuery, SubjectRawRule, SubjectType } from "@casl/ability";
import { AnyObject } from "@casl/ability/dist/types/types";
import { Request } from "express";

export interface IAluno {
  id_aluno?: number;
  id_grupo?: number;
  nome: string;
  estado: boolean;
  senha: string;
  aparelho?: string;
  papel: string;
  matricula: string;
}

export interface ICoordenador {
  id_coordenador?: number;
  nome: string;
  senha: string;
  estado: boolean;
  papel: string;
  email: string;
}

export interface IPreceptor {
  id_preceptor?: number;
  senha: string;
  papel: string;
  estado: boolean;
  email: string;
  nome: string;
}

export interface IUsuario {
  login: string;
  senha?: string;
  papel: string;
  nome: string;
  id: string;
  regrasHabilidades?: SubjectRawRule<
    string,
    SubjectType,
    MongoQuery<AnyObject>
  >[];
}

export interface IToken {
  papel: string;
  nome: string;
  login: string;
  id: string;
}

export interface IEstagio {
  id_estagio?: number;
  nome: string;
}

export interface IGrupo {
  id_grupo?: number;
  nome: string;
}

export interface ILocal {
  id_local?: number;
  nome: string;
  coordenadas: string;
}

export interface IAtividade {
  id_atividade?: number;
  id_estagio?: number;
  nome: string;
}

export interface IEstagioGrupo {
  id_estagio: number;
  id_grupo: number;
  id_estagiogrupo?: number;
  data_inicial: Date;
  data_final: Date;
}

export interface ICoordEstagio {
  id_coordenador: number;
  id_estagio: number;
}

export interface IAtivLocal {
  id_atividade: number;
  id_local: number;
  id_atividadelocal?: number;
  id_preceptor?: number;
}

export interface CustomRequest extends Request {
  infoToken: IToken;
}
