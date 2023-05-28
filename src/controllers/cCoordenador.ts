import { requisicaoRuim, trataErr } from "../errors";
import DBCoordenador, {
  ICoordenador,
  PAPEL_ADMIN,
  PAPEL_COORDENADOR,
} from "../interfaces/ICoordenador";

const cCoordenador = {
  async adicionaUm(req: any, res: any) {
    const { nome, senha, estado, papel, email } = req.body;
    if (requisicaoRuim(!DBCoordenador.valido(req.body), res)) return;
    try {
      const c: ICoordenador = { nome, senha, estado, papel, email };
      await DBCoordenador.criar(c);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async adicionaUmAdmin(req: any, res: any) {
    const { nome, senha, estado, papel, email } = req.body;
    if (requisicaoRuim(!DBCoordenador.valido(req.body), res)) return;
    try {
      const c: ICoordenador = { nome, senha, estado, papel, email };
      await DBCoordenador.criar(c);
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscaUmPorEmail(req: any, res: any) {
    const { email } = req.params;
    try {
      const c = await DBCoordenador.buscarPorEmail(email);
      res.status(200).json(c);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async apagaUmPorEmail(req: any, res: any) {
    const { email } = req.params;
    try {
      const qntdAdms = await DBCoordenador.quantidadeDeAdmins();
      const coordenador = await DBCoordenador.buscarPorEmail(email);
      if (
        coordenador.papel === PAPEL_ADMIN &&
        qntdAdms === 1 &&
        process.env.NODE_ENV !== "test"
      ) {
        trataErr(new Error("O sistema não pode ficar sem admins"), res);
      } else {
        await DBCoordenador.deletar(email);
        res.status(200).json();
      }
    } catch (err) {
      trataErr(err, res);
    }
  },
  async atualizarPorEmail(req: any, res: any) {
    const { papel, nome } = req.body;
    const { email } = req.params;
    if (
      requisicaoRuim(
        papel === undefined ||
          nome === undefined ||
          (papel !== PAPEL_ADMIN && papel !== PAPEL_COORDENADOR),
        res
      )
    )
      return;
    try {
      const qntdAdms = await DBCoordenador.quantidadeDeAdmins();
      const coordenador = await DBCoordenador.buscarPorEmail(email);
      if (
        coordenador.papel === PAPEL_ADMIN &&
        qntdAdms === 1 &&
        papel === PAPEL_COORDENADOR &&
        process.env.NODE_ENV !== "test"
      ) {
        return trataErr(new Error("O sistema não pode ficar sem admins"), res);
      } else {
        await DBCoordenador.mudarPapel(email, papel, nome);
        res.status(200).json();
      }
    } catch (err) {
      trataErr(err, res);
    }
  },
  async listarTodos(_: any, res: any) {
    try {
      const coodenadores = await DBCoordenador.listar();
      res.status(200).json(coodenadores);
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cCoordenador;
