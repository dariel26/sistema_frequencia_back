import { Request, Response } from "express";
import DBAtividade from "../db/DBAtividade";
import { trataErr } from "../errors";
import DBGrupo from "../db/DBGrupo";
import {
  IAtividade,
  IGrupo,
  IAlunoSubgrupo,
  IEstagio,
  IDataAtividade,
  IAlunoDataAtividade,
} from "../interfaces";
import {
  amdEmData,
  datasNoIntervalo,
  extenderArray,
  obterDatasPorDiaSemana,
} from "../utils";
import DBEstagio from "../db/DBEstagio";
import DBDataAtividade from "../db/DBDataAtividade";
import DBAlunoDataAtividade from "../db/DBAlunoDataAtividade";

function dataAlunoAtividadeMudou(novoDado: { id_atividade: number }) {
  if ("intervalo_alunos" in novoDado) return true;
  if ("alunos_no_dia" in novoDado) return true;
  if ("segunda" in novoDado) return true;
  if ("terca" in novoDado) return true;
  if ("quarta" in novoDado) return true;
  if ("quinta" in novoDado) return true;
  if ("sexta" in novoDado) return true;
  if ("sabado" in novoDado) return true;
  if ("domingo" in novoDado) return true;
  return false;
}

function retornaDataInicialFinal(estagios: IEstagio[]): {
  dataInicial: Date;
  dataFinal: Date;
} {
  let dataInicialSemestre = amdEmData(estagios[0]?.grupos[0]?.data_inicial);
  let dataFinalSemestre = amdEmData(estagios[0]?.grupos[0]?.data_inicial);

  estagios[0]?.grupos.forEach(({ data_inicial, data_final }) => {
    if (amdEmData(data_inicial) < dataInicialSemestre)
      dataInicialSemestre = amdEmData(data_inicial);
    if (amdEmData(data_inicial) > dataFinalSemestre)
      dataFinalSemestre = amdEmData(data_inicial);
    if (amdEmData(data_final) < dataInicialSemestre)
      dataInicialSemestre = amdEmData(data_final);
    if (amdEmData(data_final) > dataFinalSemestre)
      dataFinalSemestre = amdEmData(data_final);
  });

  return { dataInicial: dataInicialSemestre, dataFinal: dataFinalSemestre };
}

function retornaArrayDiasSemana(atividade: IAtividade): number[] {
  const diasSemenas: number[] = [];
  if (atividade.segunda) diasSemenas.push(1);
  if (atividade.terca) diasSemenas.push(2);
  if (atividade.quarta) diasSemenas.push(3);
  if (atividade.quinta) diasSemenas.push(4);
  if (atividade.sexta) diasSemenas.push(5);
  if (atividade.sabado) diasSemenas.push(6);
  if (atividade.domingo) diasSemenas.push(0);
  return diasSemenas;
}

function edicaoIncorreta(novoDado: { id_atividade: number }): boolean | string {
  if (typeof novoDado.id_atividade !== typeof 1)
    return "O id da atividade não está sendo passado";
  return false;
}

async function atividadeComSubgrupo(atividade: IAtividade, grupos: any[]) {
  try {
    let subgrupos: any = [];

    const iPrimeiroAluno =
      parseInt(atividade?.intervalo_alunos?.split("-")[0]) - 1;
    const iUltimoAluno =
      parseInt(atividade?.intervalo_alunos?.split("-")[1]) - 1;
    if (isNaN(iPrimeiroAluno) || isNaN(iUltimoAluno))
      return { ...atividade, subgrupos };

    subgrupos =
      atividade.id_estagio === null
        ? grupos.flatMap((g: IGrupo) => ({
            data_final: g.data_final,
            data_inicial: g.data_inicial,
            alunos: g.alunos.map((a) => ({
              nome_aluno: a.nome,
              aluno_incluido: false,
              id_aluno: a.id_aluno,
            })),
          }))
        : grupos.map((g: IGrupo) => ({
            data_inicial: g.data_inicial,
            data_final: g.data_final,
            alunos: g.alunos.map((a) => ({
              nome_aluno: a.nome,
              aluno_incluido: false,
              id_aluno: a.id_aluno,
            })),
          }));

    if (atividade.id_estagio === null) {
      const dataInicial = subgrupos[0]?.data_inicial;
      const dataFinal = subgrupos[0]?.data_final;
      subgrupos = [
        {
          data_inicial: dataInicial,
          data_final: dataFinal,
          alunos: subgrupos.flatMap((subg: any) => subg.alunos),
        },
      ];
    }

    subgrupos = subgrupos.map((subG: any) => ({
      data_inicial: subG.data_inicial,
      data_final: subG.data_final,
      alunos: subG.alunos.map((al: IAlunoSubgrupo, i: number) => {
        if (i >= iPrimeiroAluno && i <= iUltimoAluno)
          return { ...al, aluno_incluido: true };
        else return al;
      }),
    }));
    return { ...atividade, subgrupos };
  } catch (err) {
    throw err;
  }
}

function gruposDaAtividade(
  estagios: IEstagio[],
  atividade: IAtividade,
  grupos: IGrupo[]
) {
  const estagioDaAtividade = estagios.find(
    (e) => e.id_estagio === atividade.id_estagio
  );
  return estagioDaAtividade
    ? estagioDaAtividade.grupos.map((grupo) => ({
        ...grupo,
        data_inicial: amdEmData(grupo.data_inicial),
        data_final: amdEmData(grupo.data_final),
      }))
    : grupos.map((grupo) => ({
        ...grupo,
        data_inicial: retornaDataInicialFinal(estagios).dataInicial,
        data_final: retornaDataInicialFinal(estagios).dataFinal,
      }));
}

const cAtividade = {
  async criarVarios(req: Request, res: Response) {
    const { atividades } = req.body;
    try {
      await DBAtividade.criar(atividades);
      let atividadesAtualizadas = await DBAtividade.listar();
      const grupos = await DBGrupo.listar();
      const estagios = await DBEstagio.listar();
      const novasAtividades: IAtividade[] = [];
      for (let atividade of atividadesAtualizadas) {
        novasAtividades.push(
          await atividadeComSubgrupo(
            atividade,
            gruposDaAtividade(estagios, atividade, grupos)
          )
        );
      }
      res.status(201).json(novasAtividades);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      let atividades = await DBAtividade.listar();
      const grupos = await DBGrupo.listar();
      const estagios = await DBEstagio.listar();

      const novasAtividades: IAtividade[] = [];
      for (let atividade of atividades) {
        novasAtividades.push(
          await atividadeComSubgrupo(
            atividade,
            gruposDaAtividade(estagios, atividade, grupos)
          )
        );
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
    const { novoDado } = req.body;
    try {
      const estagios = await DBEstagio.listar();
      const grupos = await DBGrupo.listar();
      let atividadeAtualizada: IAtividade;

      const message = edicaoIncorreta(novoDado);
      if (message) return res.status(400).json({ message });

      const idEstaAtividade = novoDado.id_atividade;
      let estaAtividade = (await DBAtividade.listar()).find(
        (a: IAtividade) => a.id_atividade === idEstaAtividade
      );
      estaAtividade = Object.assign(estaAtividade, novoDado);
      atividadeAtualizada = estaAtividade;

      const diasSemana = retornaArrayDiasSemana(estaAtividade);
      const { dataInicial, dataFinal } = retornaDataInicialFinal(estagios);
      const datas = obterDatasPorDiaSemana(dataInicial, dataFinal, diasSemana);
      const datasFormatadas = datas.map((data: Date) => ({
        id_atividade: estaAtividade.id_atividade,
        data: data.toISOString().slice(0, 10).replace("T", " "),
      }));

      await DBDataAtividade.deletar([estaAtividade.id_atividade]);
      if (datasFormatadas.length > 0)
        await DBDataAtividade.criar(datasFormatadas);

      atividadeAtualizada = (await DBAtividade.listar()).find(
        (a: IAtividade) => a.id_atividade === idEstaAtividade
      );

      await DBAtividade.editar([novoDado]);

      atividadeAtualizada = await atividadeComSubgrupo(
        (
          await DBAtividade.listar()
        ).find((a: IAtividade) => a.id_atividade === idEstaAtividade),
        gruposDaAtividade(estagios, atividadeAtualizada, grupos)
      );

      const indexInicial =
        parseInt(atividadeAtualizada.intervalo_alunos?.split("-")[0]) - 1;
      const indexFinal =
        parseInt(atividadeAtualizada.intervalo_alunos?.split("-")[1]) - 1;
      const alunos_no_dia = atividadeAtualizada.alunos_no_dia;
      if (
        dataAlunoAtividadeMudou(novoDado) &&
        !isNaN(indexInicial) &&
        !isNaN(indexFinal) &&
        alunos_no_dia !== null &&
        indexFinal - indexInicial + 1 >= alunos_no_dia
      ) {
        const subgrupos = atividadeAtualizada.subgrupos.map((subg: any) => ({
          ...subg,
          alunos: subg.alunos.filter((al: any) => al.aluno_incluido),
        }));
        const datasAluno: IAlunoDataAtividade[] = [];
        for (let subg of subgrupos) {
          const datasDoSubGrupo = datasNoIntervalo(
            subg.data_inicial,
            subg.data_final,
            atividadeAtualizada.datas
          );

          const alunosExtendidos = extenderArray(
            subg.alunos,
            alunos_no_dia * datasDoSubGrupo.length
          );

          datasDoSubGrupo.forEach((dataAtividade: IDataAtividade, i) => {
            alunosExtendidos
              .slice(i * alunos_no_dia, (i + 1) * alunos_no_dia)
              .forEach((aluno: any) => {
                datasAluno.push({
                  id_atividade: atividadeAtualizada.id_atividade,
                  id_aluno: aluno.id_aluno,
                  data: amdEmData(dataAtividade.data),
                  estado: "0",
                });
              });
          });

          await DBAlunoDataAtividade.deletarSemPresencas([
            String(atividadeAtualizada.id_atividade),
          ]);
          await DBAlunoDataAtividade.criar(datasAluno);
        }
      }

      res.status(200).json(atividadeAtualizada);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAtividade;
