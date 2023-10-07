import { Request, Response } from "express";
import DBAlunoDataAtividade from "../db/DBAlunoDataAtividade";
import { userError } from "./userErrors";
import cUtils from "./utilidades";
import cMessages from "./messagesDev";
import { IAlunoDataAtividade } from "../interfaces";

const cAlunoDataAtividade = {
  async buscarPorId(req: Request, res: Response) {
    //TODO nao precisar passar o id
    const { id } = req.params;

    try {
      const dataAtual = cUtils.dataArarangua();
      const presencas = await DBAlunoDataAtividade.buscar(id);
      res.status(200).json({ presencas, dataAtual });
    } catch (err) {
      userError(err, res);
    }
  },
  async buscarPorDatas(req: Request, res: Response) {
    const { datas } = req.query;

    if (!Array.isArray(datas))
      return res.status(400).json({ message: "As datas devem vim em array" });

    const [data_inicial, data_final] = datas;

    if (typeof data_inicial !== "string" || typeof data_final !== "string")
      return res.status(400).json({
        message: "Os objetos data_inicial ou final estão em formatos errados",
      });

    try {
      const dataAtual = cUtils.dataArarangua();
      const presencas = await DBAlunoDataAtividade.buscarPorData({
        data_inicial,
        data_final,
      });
      res.status(200).json({ presencas, dataAtual });
    } catch (err) {
      userError(err, res);
    }
  },
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;
    try {
      const dadosNormalizados: IAlunoDataAtividade[] = dados.map(
        (d: IAlunoDataAtividade) => ({
          ...d,
          data: cUtils.dataFrontEmDataBD(d.data),
          estado: "CRIADA",
        })
      );
      await DBAlunoDataAtividade.deletar(dadosNormalizados);
      await DBAlunoDataAtividade.criar(dadosNormalizados);
      res.status(201).json();
    } catch (err) {
      userError(err, res);
    }
  },
  async editarPorId(req: Request, res: Response) {
    const { novosDados } = req.body;

    const message = cMessages.verificaEdicao(novosDados, [
      "id_alunodataatividade",
      "estado",
    ]);
    if (message) return res.status(400).json({ message });

    try {
      await DBAlunoDataAtividade.editar(novosDados);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
  async marcarPresenca(req: Request, res: Response) {
    const { novosDados } = req.body;

    try {
      const presenca = await DBAlunoDataAtividade.buscarPorId(
        novosDados.id_alunodataatividade
      );

      const dataAtual = cUtils.dataArarangua();
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

      await DBAlunoDataAtividade.editar({
        id_alunodataatividade: novosDados.id_alunodataatividade,
        estado: "PRESENTE",
      });
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
  async deletar(req: Request, res: Response) {
    const { id_atividade } = req.params;

    try {
      await DBAlunoDataAtividade.limpar(id_atividade);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cAlunoDataAtividade;
