import cUtils from "../../controllers/utilidades";
import DBSubscricao from "../../db/DBSubscricao";
import DBUsuario from "../../db/DBUsuario";
import { IViewAluno } from "../../interfaces";
import webpush from "web-push";

interface IViewAlunoSubscricao extends IViewAluno {
  subscricao: {
    endpoint: string;
    expirationTime: Date;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

const chavePublica = process.env.PUBLIC_VAPID_KEY ?? "";
const chavePrivada = process.env.PRIVATE_VAPID_KEY ?? "";
const subject = process.env.SUBJECT_WEB_PUSH ?? "";

webpush.setVapidDetails(subject, chavePublica, chavePrivada);

const corpoNotificacaoPresenca = {
  title: "Presença",
  body: "Sua presença já pode ser marcada",
};

//Dados planificados
let dados: IViewAlunoSubscricao[] = [];
//Alunos que ja foram notificados
let alunosNotificadosAnteriormente: IViewAluno[] = [];

export async function notificaAlunos() {
  console.log("Tentando notificar alunos");

  const dataAtual = cUtils.dataArarangua();

  let alunosANotificar = dados.filter((d) => {
    return d.datas.some((data) => {
      const dataAtividade = cUtils.horarioEmData(
        cUtils.amdEmData(data.data),
        data.hora_inicial
      );
      const diferencaEmHoras = cUtils.diferencaAbsEmHoras(
        //TODO Esta funcao deve ser abstraida em uma classe do aluno
        dataAtual,
        dataAtividade
      );
      return (
        diferencaEmHoras <= 0.34 &&
        diferencaEmHoras > 0 &&
        data.estado === "CRIADA"
      );
    });
  });

  alunosANotificar = alunosANotificar.filter(
    ({ id_usuario }) =>
      !alunosNotificadosAnteriormente.some((a) => a.id_usuario === id_usuario)
  );

  //Notifico os alunos
  alunosNotificadosAnteriormente = alunosANotificar;

  const opcoes = {
    vapidDetails: {
      subject: subject,
      publicKey: chavePublica,
      privateKey: chavePrivada,
    },
    TTL: 60,
  };

  for (let aluno of alunosANotificar) {
    try {
      await webpush.sendNotification(
        aluno.subscricao,
        JSON.stringify(corpoNotificacaoPresenca),
        opcoes
      );
    } catch (err) {
      console.error(err);
    }
  }
}

export async function carregaPlanejamento() {
  try {
    const alunos = await DBUsuario.listarAlunos();
    const subscricoes = await DBSubscricao.listar();
    const alunosComSubscricoes = alunos
      .filter(({ id_usuario }) =>
        subscricoes.some((s) => s.id_usuario === id_usuario)
      )
      .map((a) => {
        const subscricaoDoAluno = subscricoes.find(
          ({ id_usuario }) => id_usuario === a.id_usuario
        );
        return {
          ...a,
          subscricao: {
            endpoint: subscricaoDoAluno?.endpoint ?? "",
            expirationTime: subscricaoDoAluno?.expiracao ?? new Date(),
            keys: {
              p256dh: subscricaoDoAluno?.u_key ?? "",
              auth: subscricaoDoAluno?.autenticidade ?? "",
            },
          },
        };
      });

    dados = alunosComSubscricoes;
  } catch (err) {
    console.error(err);
  }
}
