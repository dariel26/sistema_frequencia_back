import { Request, Response } from "express";
import { getZonedTime, findTimeZone } from "timezone-support";
import DBAlunoDataAtividade from "../db/DBAlunoDataAtividade";
import { trataErr } from "../errors";
import {
  amdEmData,
  diferencaAbsEmHoras,
  distancia,
  horarioEmData,
} from "../utils";

const cAlunoDataAtividade = {
  async buscarPorId(req: Request, res: Response) {
    //TODO nao precisar passar o id
    const { id } = req.params;
    const ararangua = findTimeZone("America/Sao_Paulo");
    const araranguaTime = getZonedTime(new Date(), ararangua);

    try {
      const presencas = await DBAlunoDataAtividade.buscar(id);
      res.status(200).json({ presencas, dataHora: araranguaTime });
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
      const ararangua = findTimeZone("America/Sao_Paulo");
      const { day, month, year, hours, minutes } = getZonedTime(
        new Date(),
        ararangua
      );

      const presenca = await DBAlunoDataAtividade.buscarPorId(
        novosDados.id_alunodataatividade
      );

      const dataAtual = new Date(year, month - 1, day, hours, minutes);
      const dataAtividade = horarioEmData(
        presenca[0].data,
        presenca[0].hora_inicial
      );

      const coordenadaDoLocal = presenca[0].coordenadas;
      const coordenadaDoUsuario = novosDados.coordenadas;

      const raio = distancia(coordenadaDoUsuario, coordenadaDoLocal);
      const diferencaEmHoras = diferencaAbsEmHoras(dataAtual, dataAtividade);

      if (raio > 180)
        return res.status(400).json({
          message: `Fora do raio de distância permitido ${raio}`,
        });
      if (diferencaEmHoras > 0.3)
        return res.status(400).json({
          message: "Muito cedo, marque a presença faltando menos de 20 minutos",
        });
      if (diferencaEmHoras < -2)
        return res.status(400).json({
          message: "Fora do tempo limite para marcar presença",
        });

      await DBAlunoDataAtividade.editar([
        {
          id_alunodataatividade: novosDados.id_alunodataatividade,
          estado: "1",
        },
      ]);
      res.status(200).json({ message: "Presença marcada!" });
    } catch (err) {
      trataErr(err, res);
    }
  },
};

export default cAlunoDataAtividade;
