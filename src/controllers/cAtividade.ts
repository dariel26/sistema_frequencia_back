import { Request, Response } from "express";
import DBAtividade from "../db/DBAtividade";
import { trataErr } from "../errors";
import DBGrupo from "../db/DBGrupo";
import { IAtividade, IGrupo, IAlunoSubgrupo } from "../interfaces";

function alunosNaAtividadeDevemSerAtualizados(
  novosDados: { id_atividade: number }[]
) {
  for (let dado of novosDados) {
    if ("intervalo_alunos" in dado) return true;
  }
  return false;
}

function edicaoIncorreta(
  novosDados: { id_atividade: number }[]
): boolean | string {
  if (!Array.isArray(novosDados)) return "Os dados passados não são um array";
  if (novosDados.length < 1) return "O array passado está vazio";
  if (novosDados.some(({ id_atividade }) => typeof id_atividade !== typeof 1))
    return "Algum dado não possui o id da atividade ou esse campo está incorreto";
  const idEstaAtividade = novosDados[0].id_atividade;
  if (novosDados.some(({ id_atividade }) => id_atividade !== idEstaAtividade))
    return "Mais de uma atividade não pode ser editada ao mesmo tempo";
  return false;
}

async function atividadeComSubgrupo(atividade: IAtividade, grupos: IGrupo[]) {
  try {
    let subgrupos: IAlunoSubgrupo[][] = [];

    const iPrimeiroAluno =
      parseInt(atividade?.intervalo_alunos?.split("-")[0]) - 1;
    const iUltimoAluno =
      parseInt(atividade?.intervalo_alunos?.split("-")[1]) - 1;
    if (isNaN(iPrimeiroAluno) || isNaN(iUltimoAluno))
      return { ...atividade, subgrupos };

    subgrupos =
      atividade.id_estagio === null
        ? [
            grupos.flatMap((g: IGrupo) =>
              g.alunos.map((a) => ({
                nome_aluno: a.nome,
                aluno_incluido: false,
                id_aluno: a.id_aluno,
              }))
            ),
          ]
        : grupos.map((g: IGrupo) =>
            g.alunos.map((a) => ({
              nome_aluno: a.nome,
              aluno_incluido: false,
              id_aluno: a.id_aluno,
            }))
          );

    subgrupos = subgrupos.map((subG: IAlunoSubgrupo[]) =>
      subG.map((al: IAlunoSubgrupo, i: number) => {
        if (i >= iPrimeiroAluno && i <= iUltimoAluno)
          return { ...al, aluno_incluido: true };
        else return al;
      })
    );
    return { ...atividade, subgrupos };
  } catch (err) {
    throw err;
  }
}

const cAtividade = {
  async criarVarios(req: Request, res: Response) {
    const { atividades } = req.body;
    try {
      await DBAtividade.criar(atividades);
      const novasAtividades = await DBAtividade.listar();
      res.status(201).json(novasAtividades);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      let atividades = await DBAtividade.listar();
      const grupos = await DBGrupo.listar();

      const novasAtividades: IAtividade[] = [];
      for (let atividade of atividades) {
        novasAtividades.push(await atividadeComSubgrupo(atividade, grupos));
      }

      res.status(200).json(novasAtividades);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBAtividade.deletar(ids);
      res.status(200).json({ message: "Atividades deletadas!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: Request, res: Response) {
    //TODO Revisar para retornar subgrupos para diversar edições de várias atividades
    const { novosDados } = req.body;
    try {
      const grupos = await DBGrupo.listar();
      let subgrupos: IAlunoSubgrupo[][] = [];

      const message = edicaoIncorreta(novosDados);
      if (message) return res.status(400).json({ message });

      if (alunosNaAtividadeDevemSerAtualizados(novosDados)) {
        const idEstaAtividade = novosDados[0].id_atividade;
        let estaAtividade = (await DBAtividade.listar()).find(
          (a: IAtividade) => a.id_atividade === idEstaAtividade
        );

        estaAtividade.intervalo_alunos = novosDados[0].intervalo_alunos;

        subgrupos = (await atividadeComSubgrupo(estaAtividade, grupos))
          .subgrupos;
      }

      await DBAtividade.editar(novosDados);
      res.status(200).json(subgrupos);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAtividade;
