import { requisicaoRuim, trataErr } from "../errors";
import DBAtivLocal from "../interfaces/IAtivLocal";
import DBPresenca from "../interfaces/IPresenca";

const cPresenca = {
  async listarTodas(_: any, res: any) {
    try {
      const presencas = await DBPresenca.listar();
      res.status(200).json(presencas);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdAluno(req: any, res: any) {
    const id_aluno = req.params.id_aluno;
    try {
      const presencas = await DBPresenca.buscarPorAluno(id_aluno);
      res.status(200).json(presencas);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async buscarPorIdAtividade(req: any, res: any) {
    const id_atividade = req.params.id_atividade;
    try {
      const presencas = await DBPresenca.buscarPorAtividade(id_atividade);
      res.status(200).json(presencas);
    } catch (err) {
      trataErr(err, res);
    }
  },
  async deletarPorId(req: any, res: any) {
    const id_presenca = req.params.id_presenca;
    try {
      await DBPresenca.apagarPorId(id_presenca);
      res.status(200).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
  async criarUma(req: any, res: any) {
    const { data_hora, estado, periodo, id_aluno, coordenadas, id_atividade } =
      req.body;
    try {
      if (requisicaoRuim(!DBPresenca.valido(req.body), res)) return;
      const al = await DBAtivLocal.buscarPorIdAtividade(id_atividade);
      if (requisicaoRuim(al[0]?.coordenadas === undefined, res)) return;
      const x1 = al[0]?.coordenadas.lat;
      const y1 = al[0]?.coordenadas.lon;
      const x2 = JSON.parse(coordenadas).lat;
      const y2 = JSON.parse(coordenadas).lon;
      const distancia = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      if (requisicaoRuim(distancia === NaN || distancia === undefined, res))
        return;
      if (distancia > 20) {
        //metros?
        trataErr(new Error("No Local"), res);
        return;
      }
      const id_local = al[0].id_local;
      await DBPresenca.criar({
        data_hora,
        estado,
        periodo,
        id_aluno,
        id_local,
        coordenadas,
        id_atividade,
      });
      res.status(201).json();
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cPresenca;
