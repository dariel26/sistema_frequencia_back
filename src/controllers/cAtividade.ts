import { Request, Response } from "express";
import cMessages from "./messagesDev";
import DBAtividade from "../db/DBAtividade";
import DBEstagio from "../db/DBEstagio";
import { trataErr } from "./userErrors";
import {
  IAlunoDataAtividade,
  IDataAtividade,
  IGrupoEmEstagio,
  ISubGrupo,
  IViewAtividade,
  IViewAtividadeCompleta,
  IViewEstagio,
} from "../interfaces";
import cUtils, { dataEmAmd } from "./utilidades";
import DBDataAtividade from "../db/DBDataAtividade";
import DBAlunoDataAtividade from "../db/DBAlunoDataAtividade";

const NOME_GRUPO_ATIVIDADE_GERAL = "Todos os alunos";

const camposAtividades = ["nome"];
const camposAtividadesEdicao = [
  "id_atividade",
  "id_estagio",
  "nome",
  "hora_inicial",
  "hora_final",
  "intervalo_alunos",
  "alunos_no_dia",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
];

const cAtividade = {
  criarVarios: async (req: Request, res: Response) => {
    const { atividades } = req.body;

    const message = cMessages.verificaNovos(atividades, camposAtividades);
    if (message) return res.status(400).json({ message });

    try {
      await DBAtividade.criar(atividades);
      const novasAtividades = await DBAtividade.listar();
      res.status(200).json(novasAtividades);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const atividades = await DBAtividade.listar();
      const estagios = await DBEstagio.listar();

      const atividadesCompletas = atividadesComSubgrupos(atividades, estagios);
      res.status(200).json(atividadesCompletas);
    } catch (err) {
      trataErr(err, res);
    }
  },
  editar: async (req: Request, res: Response) => {
    const { novosDados } = req.body;

    const message = cMessages.verificaEdicao(
      novosDados,
      camposAtividadesEdicao
    );
    if (message) return res.status(400).json({ message });

    try {
      const atividades = await DBAtividade.listar();
      const estagios = await DBEstagio.listar();

      const atividadeAntiga = atividades.find(
        ({ id_atividade }) => id_atividade === novosDados.id_atividade
      );

      if (!atividadeAntiga)
        return res.status(400).json({
          message: "A atividade a ser editada não existe no Banco de Dados",
        });

      const atividadeAtualizada: IViewAtividade = {
        ...atividadeAntiga,
        ...novosDados,
      };
      const atividadeCompleta: IViewAtividadeCompleta = atividadesComSubgrupos(
        [atividadeAtualizada],
        estagios
      )[0];

      const dataAmanha = cUtils.dataArarangua();
      dataAmanha.setDate(dataAmanha.getDate() + 1);

      const datasDaAtividade = atividadeCompleta.subgrupos.flatMap(
        ({ data_inicial, data_final }) =>
          cUtils.datasPorDiaSemana(
            dataAmanha < data_inicial ? data_inicial : dataAmanha,
            data_final,
            atividadeCompleta
          )
      );

      const { mudarDatas, mudarAlunos } = devoMudar(novosDados);
      const alunosNoDia = atividadeCompleta.alunos_no_dia;

      if (mudarDatas) {
        await atualizaDatasAtividade(
          atividadeCompleta,
          datasDaAtividade,
          dataAmanha
        );

        const novasDatasAtividade = await DBDataAtividade.buscarPartindoDe(
          atividadeCompleta.id_atividade,
          cUtils.dataEmDataBD(dataAmanha)
        );

        await atualizaAlunosDatasAtividade(
          atividadeCompleta.subgrupos,
          alunosNoDia,
          novasDatasAtividade
        );
      } else if (mudarAlunos) {
        const novasDatasAtividade = await DBDataAtividade.buscarPartindoDe(
          atividadeCompleta.id_atividade,
          cUtils.dataEmDataBD(dataAmanha)
        );

        await DBAlunoDataAtividade.deletarPartindoDe(
          atividadeCompleta.id_atividade,
          cUtils.dataEmDataBD(dataAmanha)
        );
        await atualizaAlunosDatasAtividade(
          atividadeCompleta.subgrupos,
          alunosNoDia,
          novasDatasAtividade
        );
      }

      await DBAtividade.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      console.log(err);
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBAtividade.deletar(ids);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAtividade;

function atividadesComSubgrupos(
  atividades: IViewAtividade[],
  estagios: IViewEstagio[]
): IViewAtividadeCompleta[] {
  const atividadesCompletas: IViewAtividadeCompleta[] = [];

  for (const atividade of atividades) {
    const subgruposDaAtividade: ISubGrupo[] = [];
    let gruposDaAtividade: IGrupoEmEstagio[] = [];

    const estagioDaAtividade: IViewEstagio | undefined = estagios.find(
      ({ id_estagio }) => id_estagio === atividade.id_estagio
    );

    if (!estagioDaAtividade)
      gruposDaAtividade = [grupoDaAtividadeGeral(estagios)];
    else gruposDaAtividade = estagioDaAtividade.grupos;

    const [idxAlunoInicialStr, idxAlunoFinalStr] = (
      atividade.intervalo_alunos ?? "5000-5001"
    ).split("-");
    const idxAlunoInicial = parseInt(idxAlunoInicialStr);
    const idxAlunoFinal = parseInt(idxAlunoFinalStr);

    for (const grupo of gruposDaAtividade) {
      subgruposDaAtividade.push({
        data_inicial: cUtils.amdEmData(grupo.data_inicial),
        data_final: cUtils.amdEmData(grupo.data_final),
        alunos: grupo.alunos.map((a, i) => ({
          id_aluno: a.id_usuario,
          nome: a.nome,
          incluido: idxAlunoInicial <= i && idxAlunoFinal >= i,
        })),
      });
    }
    atividadesCompletas.push({ ...atividade, subgrupos: subgruposDaAtividade });
  }
  return atividadesCompletas;
}

function grupoDaAtividadeGeral(estagios: IViewEstagio[]): IGrupoEmEstagio {
  let grupoDaAtividade: IGrupoEmEstagio;

  const grupos: IGrupoEmEstagio[] = estagios[0].grupos;

  const alunos = grupos
    .flatMap((g) => g.alunos)
    .sort(cUtils.ordenarPorIdUsuarioASC);

  const datas: Date[] = grupos.flatMap(({ data_inicial, data_final }) => [
    cUtils.amdEmData(data_inicial),
    cUtils.amdEmData(data_final),
  ]);
  let [dataInicial, dataFinal] = cUtils.encontrarMinEMaxDatas(datas);

  grupoDaAtividade = {
    id_estagiogrupo: -1,
    nome: NOME_GRUPO_ATIVIDADE_GERAL,
    id_grupo: -1,
    data_inicial: cUtils.dataEmAmd(dataInicial),
    data_final: cUtils.dataEmAmd(dataFinal),
    alunos,
  };

  return grupoDaAtividade;
}

function devoMudar(novosDados: any) {
  const mudarAlunos =
    typeof novosDados.alunos_no_dia === "number" ||
    typeof novosDados.intervalo_alunos === "string";
  const mudarDatas =
    typeof novosDados.segunda === "boolean" ||
    typeof novosDados.terca === "boolean" ||
    typeof novosDados.quarta === "boolean" ||
    typeof novosDados.quinta === "boolean" ||
    typeof novosDados.sexta === "boolean" ||
    typeof novosDados.sabado === "boolean" ||
    typeof novosDados.domingo === "boolean";
  return { mudarAlunos, mudarDatas };
}

async function atualizaDatasAtividade(
  atividadeCompleta: IViewAtividadeCompleta,
  datasDaAtividade: Date[],
  dataAmanha: Date
) {
  const datasAtividade: IDataAtividade[] = datasDaAtividade.map((d) => ({
    id_atividade: atividadeCompleta.id_atividade,
    excluida: false,
    data: cUtils.dataEmDataBD(d),
  }));
  await DBDataAtividade.deletarPreservandoHistorico(
    [atividadeCompleta.id_atividade.toString()],
    cUtils.dataEmDataBD(dataAmanha)
  );
  await DBDataAtividade.criar(datasAtividade);
}

async function atualizaAlunosDatasAtividade(
  subgrupos: {
    alunos: { id_aluno: number; incluido: boolean }[];
    data_inicial: Date;
    data_final: Date;
  }[],
  alunosNoDia: number,
  novasDatasAtividade: {
    id_dataatividade: number;
    data: Date;
    id_atividade: number;
    excluida: boolean;
  }[]
) {
  if (typeof alunosNoDia === "number") {
    const alunosDatasAtividade: IAlunoDataAtividade[] = subgrupos.flatMap(
      ({ alunos, data_inicial, data_final }) => {
        const alunosNaAtividade = alunos.filter(({ incluido }) => incluido);
        const tamArray = alunosNaAtividade.length;
        const maxAlunos = alunosNoDia > tamArray ? tamArray : alunosNoDia;
        if (tamArray < 1) return [];

        const datas = cUtils.datasNoIntervalo(
          data_inicial,
          data_final,
          novasDatasAtividade.map((d) => ({ ...d, data: dataEmAmd(d.data) }))
        );
        const alunosExtendidos = cUtils.extenderArray(
          alunosNaAtividade,
          maxAlunos * datas.length
        );

        return datas.flatMap(({ data, id_dataatividade, id_atividade }, i) => {
          const alunos = alunosExtendidos.slice(
            i * maxAlunos,
            (i + 1) * maxAlunos
          );
          return alunos.map(({ id_aluno }) => ({
            id_usuario: id_aluno,
            id_atividade,
            id_dataatividade,
            data,
            estado: "AGUARDANDO",
          }));
        });
      }
    );
    if (alunosDatasAtividade.length > 0)
      await DBAlunoDataAtividade.criar(alunosDatasAtividade);
  }
}
/*import { Request, Response } from "express";
import DBEstagio from "../db/DBEstagio";
import { trataErr } from "../errors";
import cUtils from "./cUtils";

const camposEstagios = ["nome"];

const cEstagio = {

  async editar(req: Request, res: Response) {
    const { novosDados } = req.body;

    const message = cUtils.verificaEdicao(novosDados, camposEstagios);
    if (message) return res.status(400).json({ message });

    try {
      await DBEstagio.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cEstagio;
*/
