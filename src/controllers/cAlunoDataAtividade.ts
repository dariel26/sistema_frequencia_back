import { Request, Response } from "express";
import { getZonedTime, findTimeZone } from "timezone-support";
import DBAlunoDataAtividade from "../db/DBAlunoDataAtividade";
import { trataErr } from "./userErrors";
import cUtils from "./utilidades";

const cAlunoDataAtividade = {
  async buscarPorId(req: Request, res: Response) {
    //TODO nao precisar passar o id
    const { id } = req.params;

    try {
      const dataAtual = cUtils.dataTimeArarangua();
      const presencas = await DBAlunoDataAtividade.buscar(id);
      res.status(200).json({ presencas, dataAtual });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;
    try {
      await DBAlunoDataAtividade.deletar(
        dados.map(
          ({ id_dataatividade }: { id_dataatividade: string }) =>
            id_dataatividade
        )
      );
      await DBAlunoDataAtividade.criar(dados);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarPorId(req: Request, res: Response) {
    const { novosDados } = req.body;
    try {
      const presenca = await DBAlunoDataAtividade.buscarPorId(
        novosDados.id_alunodataatividade
      );

      const dataAtual = cUtils.dataTimeArarangua();
      const dataAtividade = cUtils.horarioEmData(
        presenca[0].data,
        presenca[0].hora_inicial
      );

      const coordenadaDoLocal = presenca[0].coordenadas;
      const coordenadaDoUsuario = novosDados.coordenadas;

      const raio = cUtils.distancia(coordenadaDoUsuario, coordenadaDoLocal);
      const diferencaEmHoras = cUtils.diferencaAbsEmHoras(
        dataAtual,
        dataAtividade
      );

      if (raio > 180)
        return res.status(400).json({
          message: `Fora do raio de distância permitido ${raio}`,
        });
      if (diferencaEmHoras > 0.3)
        return res.status(400).json({
          message: "Muito cedo, tente novamente mais tarde.",
        });
      if (diferencaEmHoras < -2)
        return res.status(400).json({
          message: "Fora do tempo limite para marcar presença",
        });

      await DBAlunoDataAtividade.editar([
        {
          id_alunodataatividade: novosDados.id_alunodataatividade,
          estado: "PRESENTE",
        },
      ]);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAlunoDataAtividade;
