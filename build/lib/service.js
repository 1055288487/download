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
const api_1 = require("./api");
const cache = require('memory-cache');
class default_1 {
    static findFile(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            let key = `file_${md5}`;
            let file = cache.get(key);
            if (file)
                return file;
            let result = yield api_1.default.fetchFile(md5);
            if (!result || !result.success)
                return null;
            cache.put(key, result.data, 1000 * 60 * 5);
            return result.data;
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=service.js.map