import { Request, Response } from "express";
import DBEstagioGrupo from "../db/DBEstagioGrupo";
import { trataErr } from "../errors";

const cEstagioGrupo = {
  async criarVarios(req: Request, res: Response) {
    let { dados } = req.body;
    try {
      const ids = dados.map(
        ({ id_estagio }: { id_estagio: string }) => id_estagio
      );
      dados = dados.map(
        ({
          id_estagio,
          id_grupo,
          data_inicial,
          data_final,
        }: {
          id_estagio: string;
          id_grupo: string;
          data_inicial: string;
          data_final: string;
        }) => ({
          id_estagio,
          id_grupo,
          data_inicial: new Date(data_inicial)
            .toISOString()
            .slice(0, 10)
            .replace("T", " "),
          data_final: new Date(data_final)
            .toISOString()
            .slice(0, 10)
            .replace("T", " "),
        })
      );
      await DBEstagioGrupo.deletarPorIdsEstagio(ids);
      await DBEstagioGrupo.criar(dados);
      res.status(201).json({ message: "Associação salva!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: Request, res: Response) {
    const ids = req.params.ids.split(",");
    try {
      await DBEstagioGrupo.deletar(ids);
      res.status(200).json({ message: "Associação deletada!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cEstagioGrupo;
