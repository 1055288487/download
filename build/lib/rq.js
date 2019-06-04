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
const axios = require("axios");
const DEBUG = require('debug'), debug = DEBUG('api:debug'), logError = DEBUG('api:error'), config = require('../../config.json'), options = {
    baseURL: config.api.host,
    auth: {
        username: config.api.appkey,
        password: config.api.appsecret
    },
    headers: {
        "Content-Type": "application/json"
    }
};
class default_1 {
    static get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('rq get:%s%s', options.baseURL, path);
            return yield axios.default.get(path, options);
        });
    }
    static put(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('rq put:%s%s,data:%j', options.baseURL, path, data);
            return yield axios.default.put(path, data, options);
        });
    }
    static post(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('rq post:%s%s,data:%j', options.baseURL, path, data);
            return yield axios.default.post(path, data, options);
        });
    }
    static delete(path) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('rq post:%s%s', options.baseURL, path);
            return yield axios.default.delete(path, options);
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=rq.js.map