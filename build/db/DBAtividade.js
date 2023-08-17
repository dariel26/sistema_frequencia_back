"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const DBAtividade = {
    criar: (atividades) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "INSERT INTO Atividade (nome, id_estagio, hora_inicial, hora_final, intervalo_alunos, alunos_no_dia, segunda, terca, quarta, quinta, sexta, sabado, domingo) VALUES ?";
        const novasAtividades = atividades.map(({ nome, id_estagio, hora_inicial, hora_final, intervalo_alunos, alunos_no_dia, }) => [
            nome,
            id_estagio,
            hora_inicial,
            hora_final,
            intervalo_alunos,
            alunos_no_dia,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
        const res = yield db_1.default.query(sql, [novasAtividades]);
        return res;
    }),
    listar: () => __awaiter(void 0, void 0, void 0, function* () {
        const sql = `SELECT * FROM view_atividade`;
        const [linhas] = yield db_1.default.query(sql);
        return linhas;
    }),
    editar: (novosDados) => __awaiter(void 0, void 0, void 0, function* () {
        let sql = "UPDATE Atividade SET ";
        let campos_disponiveis = [
            "nome",
            "id_estagio",
            "hora_inicial",
            "hora_final",
            "intervalo_alunos",
            "alunos_no_dia",
            "segunda",
            "terca",
            "quarta",
            "quinta",
            "sexta",
            "sabado",
            "domingo",
        ];
        const campos_nulos = [];
        novosDados.forEach((g) => {
            if (g.nome === undefined)
                campos_nulos.push("nome");
            if (g.id_estagio === undefined)
                campos_nulos.push("id_estagio");
            if (g.hora_inicial === undefined)
                campos_nulos.push("hora_inicial");
            if (g.hora_final === undefined)
                campos_nulos.push("hora_final");
            if (g.intervalo_alunos === undefined)
                campos_nulos.push("intervalo_alunos");
            if (g.alunos_no_dia === undefined)
                campos_nulos.push("alunos_no_dia");
            if (g.segunda === undefined)
                campos_nulos.push("segunda");
            if (g.terca === undefined)
                campos_nulos.push("terca");
            if (g.quarta === undefined)
                campos_nulos.push("quarta");
            if (g.quinta === undefined)
                campos_nulos.push("quinta");
            if (g.sexta === undefined)
                campos_nulos.push("sexta");
            if (g.sabado === undefined)
                campos_nulos.push("sabado");
            if (g.domingo === undefined)
                campos_nulos.push("domingo");
        });
        campos_disponiveis = campos_disponiveis.filter((campo) => !campos_nulos.includes(campo));
        for (let i = 0; i < campos_disponiveis.length; i++) {
            const c = campos_disponiveis[i];
            const ultimoI = i === campos_disponiveis.length - 1;
            if (ultimoI) {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_atividade = ? THEN ? END ";
                    }
                    else {
                        sql += "WHEN id_atividade = ? THEN ? ";
                    }
                }
            }
            else {
                sql += `${c}= CASE `;
                for (let j = 0; j < novosDados.length; j++) {
                    const ultimoJ = j === novosDados.length - 1;
                    if (ultimoJ) {
                        sql += "WHEN id_atividade = ? THEN ? END, ";
                    }
                    else {
                        sql += "WHEN id_atividade = ? THEN ? ";
                    }
                }
            }
        }
        const ids = novosDados.map(({ id_atividade }) => id_atividade);
        sql += ` WHERE id_atividade IN (${ids.map((item) => item).join(", ")})`;
        let values = [];
        for (let dado of novosDados) {
            //TODO a ordem dos valores do objeto influenciam e podem dar valores errados
            const array = Object.values(dado);
            const id_atividade = array.shift();
            values.push(array.flatMap((valor) => [id_atividade, valor]));
        }
        values = values.flat();
        const res = yield db_1.default.query(sql, values);
        return res;
    }),
    deletar: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        const sql = "DELETE FROM Atividade WHERE id_atividade IN (?)";
        return yield db_1.default.query(sql, [ids]);
    }),
};
exports.default = DBAtividade;
