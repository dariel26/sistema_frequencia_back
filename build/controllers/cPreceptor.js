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
const DBPreceptor_1 = __importDefault(require("../db/DBPreceptor"));
const errors_1 = require("../errors");
const cPreceptor = {
    criarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { preceptores } = req.body;
            try {
                yield DBPreceptor_1.default.criar(preceptores);
                const novosPreceptores = yield DBPreceptor_1.default.listar();
                res.status(201).json(novosPreceptores);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    deletarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = req.params.ids.split(",");
            try {
                yield DBPreceptor_1.default.deletar(ids);
                res.status(200).json({ message: "Preceptores deletados!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    editarVarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { novosDados } = req.body;
            try {
                yield DBPreceptor_1.default.editar(novosDados);
                res.status(200).json({ message: "Preceptores editados!" });
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
    listar(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const preceptores = yield DBPreceptor_1.default.listar();
                res.status(200).json(preceptores);
            }
            catch (err) {
                (0, errors_1.trataErr)(err, res);
            }
        });
    },
};
exports.default = cPreceptor;
