import { defineHabilidadesPara } from "../middleware/habilidades";

const cUsuario = {
  async retornaInfoUsuario(req: any, res: any) {
    try {
      const infoToken = req.infoToken;
      const habilidades = defineHabilidadesPara(infoToken);
      const infoUsuario = { ...infoToken, regrasHabilidades: habilidades.rules };
      return res.status(200).json(infoUsuario);
    } catch (err) {
      console.log(err);
      res.status(500).json();
    }
  },
};

export default cUsuario;
