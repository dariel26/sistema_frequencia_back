import { Request, Response } from "express";
import DBCoordEstagio from "../db/DBCoordEstagio";
import { userError } from "./userErrors";
import cMessages from "./messagesDev";
import DBAlunoGrupo from "../db/DBAlunoGrupo";

const camposAlunoGrupo = ["id_grupo", "id_usuario"];

const cAlunoGrupo = {
  async criarVarios(req: Request, res: Response) {
    const { dados } = req.body;

    const message = cMessages.verificaNovos(dados, camposAlunoGrupo);
    if (message) return res.status(400).json({ message });

    try {
      await DBAlunoGrupo.deletar(
        dados.map(({ id_usuario }: { id_usuario: string }) => id_usuario)
      );
      await DBAlunoGrupo.criar(dados);
      res.status(200).json();
    } catch (err) {
      console.log(err);
      userError(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBAlunoGrupo.deletar(ids);
      res.status(200).json();
    } catch (err) {
      userError(err, res);
    }
  },
};

export default cAlunoGrupo;
