import { IUsuario } from "../interfaces";

const ARRAY_INVALIDO = "O dado deve ser um array";

const CAMPO_AUSENTE = (campoAusente: string, objeto: object): string => {
  return `O campo ${campoAusente} está faltando no objeto ${JSON.stringify(
    objeto
  )}`;
};
const CAMPOS_ESPERADOS = (camposEsperados: string[]): string => {
  let sql = "Os campos ";
  camposEsperados.forEach((c) => (sql += `${c} `));
  sql += "são esperados e nenhum está sendo enviado";
  return sql;
};

const cUtils = {
  verificaNovos: (dados: object[], campos: string[]): string | undefined => {
    if (!Array.isArray(dados)) return ARRAY_INVALIDO;

    for (let dado of dados) {
      for (let campo of campos) {
        if (!(campo in dado)) {
          return CAMPO_AUSENTE(campo, dado);
        }
      }
    }
    return;
  },
  verificaEdicao: (dados: object[], campos: string[]): string | undefined => {
    let campos_aux = [...campos];
    for (let campo of campos) {
      if (campo in dados) campos_aux = campos_aux.filter((c) => c !== campo);
    }

    if (campos_aux.length === campos.length) return CAMPOS_ESPERADOS(campos);
    return;
  },
};

export default cUtils;
