import { Request, Response } from "express";
import cMessages from "./messagesDev";
import DBAtividade from "../db/DBAtividade";
import { userError } from "./userErrors";
import cUtils from "./utilidades";

const camposAtividades = ["nome"];
const camposAtividadesEdicao = [
  "id_atividade",
  "id_estagio",
  "nome",
  "hora_inicial",
  "hora_final",
  "periodo",
];

const cAtividade = {
  criarVarios: async (req: Request, res: Response) => {
    const { atividades } = req.body;

    const message = cMessages.verificaNovos(atividades, camposAtividades);
    if (message) return res.status(400).json({ message });

    try {
      await DBAtividade.criar(atividades);

      let novasAtividades = await DBAtividade.listar();
      res.status(200).json(novasAtividades);
    } catch (err) {
      userError(err, res);
    }
  },
  async listar(_: Request, res: Response) {
    try {
      const atividades = await DBAtividade.listar();

      res.status(200).json(atividades);
    } catch (err) {
      userError(err, res);
    }
  },
  editar: async (req: Request, res: Response) => {
    let { novosDados } = req.body;

    const message = cMessages.verificaEdicao(
      novosDados,
      camposAtividadesEdicao
    );
    if (message) return res.status(400).json({ message });

    try {
      if (novosDados.hora_final || novosDados.hora_inicial) {
        const atividades = await DBAtividade.listar();
        const atividade = atividades.find(
          (a) => a.id_atividade === novosDados.id_atividade
        );
        const atividadeAtualizada = { ...atividade, ...novosDados };

        const periodo = cUtils.obterPeriodoDoDia(
          atividadeAtualizada?.hora_inicial,
          atividadeAtualizada?.hora_final
        );
        novosDados = { ...novosDados, periodo };
      }

      await DBAtividade.editar(novosDados);
      res.status(200).json(novosDados);
    } catch (err) {
      userError(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBAtividade.deletar(ids);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cAtividade;
