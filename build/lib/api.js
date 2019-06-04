"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rq_1 = require("./rq");
const DEBUG = require('debug'), debug = DEBUG('api:debug'), logError = DEBUG('api:error');
class default_1 {
    static fetchFile(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield rq_1.default.get(`/api/file/${md5}`);
            if (result.status !== 200) {
                logError('fetchFile md5:%s http status code:%d / %s', md5, result.status, result.statusText);
                return null;
            }
            return result.data;
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=api.js.map