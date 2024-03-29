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
exports.compare = exports.cipher = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const cipher = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        bcrypt_1.default
            .hash(password, saltRounds)
            .then((hash) => {
            resolve(hash);
        })
            .catch((err) => {
            reject(err);
        });
    }));
});
exports.cipher = cipher;
const compare = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        bcrypt_1.default.compare(password, hash, (err, result) => {
            if (err) {
                resolve(false);
            }
            else {
                if (result) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
        });
    }));
});
exports.compare = compare;
