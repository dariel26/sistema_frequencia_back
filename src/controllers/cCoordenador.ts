import DBCoordenador from "../db/DBCoordenador";
import { trataErr } from "../errors";
import { ICoordenador } from "../interfaces";
import { PAPEL_ADMIN } from "../papeis";

const cCoordenador = {
  async criarVarios(req: any, res: any) {
    const { coordenadores } = req.body;
    try {
      await DBCoordenador.criar(coordenadores);
      const novosCoordenadores = await DBCoordenador.listar(); 
      res.status(201).json(novosCoordenadores);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarVarios(req: any, res: any) {
    const ids = req.params.ids.split(",");
    try {
      const coordenadores = await DBCoordenador.listar();
      const admins = coordenadores.filter(
        (c: ICoordenador) => c.papel === PAPEL_ADMIN
      );
      const adminsDeletados = admins.filter((a: ICoordenador) =>
        ids.includes(String(a.id_coordenador))
      );
      if (adminsDeletados.length === admins.length) {
        return res
          .status(500)
          .json({ message: "O sistema não pode ficar sem ADMINS" });
      }
      await DBCoordenador.deletar(ids);
      res.status(200).json({ message: "Coordenadores deletados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async editarVarios(req: any, res: any) {
    const { novosDados } = req.body;
    try {
      const coordenadores = await DBCoordenador.listar();
      const admins = coordenadores.filter(
        (c: ICoordenador) => c.papel === PAPEL_ADMIN
      );
      const novosAdmins = novosDados.filter(
        (c: ICoordenador) => c.papel === PAPEL_ADMIN
      );
      if (novosAdmins.length === 0) {
        for (let dado of novosDados) {
          const id = dado.id_coordenador;
          const coordenador = coordenadores.find(
            (c: ICoordenador) => c.id_coordenador === id
          );
          if (coordenador.papel === PAPEL_ADMIN && admins.length === 1) {
            return res
              .status(500)
              .json({ message: "O sistema não pode ficar sem ADMINS" });
          }
        }
      }
      await DBCoordenador.editar(novosDados);
      res.status(200).json({ message: "Coordenadores editados!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listar(_: any, res: any) {
    try {
      const coodenadores = await DBCoordenador.listar();
      res.status(200).json(coodenadores);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cCoordenador;
