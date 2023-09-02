import db from "./db";
import { IUsuario, IViewAluno, PAPEIS, TIPO_USUARIO } from "../interfaces";
import { cipher } from "../cipher/cipher";

const DBUsuario = {
  buscaPorLogin: async (login: string): Promise<IUsuario> => {
    const sql =
      "SELECT id_usuario, nome, login, senha, papel_atual, papeis, tipo FROM Usuario WHERE login=?";
    const [usuarios] = await db.query(sql, [login]);
    return usuarios[0];
  },

  buscarPorId: async (id_usuario: number): Promise<IUsuario> => {
    const sql =
      "SELECT id_usuario, nome, login, papel_atual, papeis, tipo FROM Usuario WHERE id_usuario=?";
    const [usuarios] = await db.query(sql, [id_usuario]);
    return usuarios[0];
  },

  invalidarToken: async (token: string) => {
    const sql =
      "INSERT INTO jwt (token, validade) VALUES(?, NOW() + INTERVAL 24 HOUR)";
    await db.query(sql, token);
  },

  criar: async (usuarios: IUsuario[]) => {
    const sql =
      "INSERT INTO Usuario (nome, login, senha, papel_atual, papeis, tipo) VALUES ?";
    const valores = [];
    for (let { nome, login, senha, papel_atual, papeis, tipo } of usuarios) {
      valores.push([
        nome,
        login,
        await cipher(senha),
        papel_atual,
        papeis,
        tipo,
      ]);
    }
    await db.query(sql, [valores]);
  },

  listar: async (): Promise<IUsuario[]> => {
    const sql =
      "SELECT id_usuario, nome, login, papel_atual, papeis, tipo FROM Usuario";
    const [usuarios] = await db.query(sql);
    return usuarios;
  },

  listarAlunos: async (): Promise<IViewAluno[]> => {
    const sql = "SELECT * FROM view_aluno";
    const [usuarios] = await db.query(sql);
    return usuarios;
  },

  buscarAluno: async (id_usuario: string): Promise<IViewAluno> => {
    const sql = "SELECT * FROM view_aluno WHERE id_usuario=?";
    const [usuarios] = await db.query(sql, id_usuario);
    return usuarios[0];
  },

  buscarPorTipo: async (tipo: TIPO_USUARIO): Promise<IUsuario[]> => {
    const sql =
      "SELECT id_usuario, nome, login, papel_atual, papeis, tipo FROM Usuario WHERE tipo=?";
    const [usuarios] = await db.query(sql, [tipo]);
    return usuarios;
  },

  deletar: async (ids: string[]) => {
    const sql = "DELETE FROM Usuario WHERE id_usuario IN (?)";
    await db.query(sql, [ids]);
  },

  editar: async (dados: {
    id_usuario: number;
    nome: string;
    login: string;
    senha: string;
    papel_atual: PAPEIS;
    papeis: PAPEIS[];
  }) => {
    let sql = "UPDATE Usuario SET";
    const valores = [];

    if (dados.nome) {
      sql += " nome=?,";
      valores.push(dados.nome);
    }
    if (dados.login) {
      sql += " login=?,";
      valores.push(dados.login);
    }
    if (dados.senha) {
      sql += " senha=?,";
      valores.push(dados.senha);
    }
    if (dados.papel_atual) {
      sql += " papel_atual=?,";
      valores.push(dados.papel_atual);
    }
    if (dados.papeis) {
      sql += " papeis=?,";
      valores.push(dados.papeis);
    }

    sql = sql.slice(0, -1);
    sql += ` WHERE id_usuario=?`;
    valores.push(dados.id_usuario);

    await db.query(sql, valores);
  },
};

export default DBUsuario;
