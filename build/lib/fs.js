"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const DEBUG = require('debug'), debug = DEBUG('fs:debug'), logError = DEBUG('fs:error');
class default_1 {
    static existsAsync(path) {
        return new Promise((resolve, reject) => {
            fs.exists(path, (e) => {
                resolve(e);
            });
        });
    }
    static readFileStream(path, start, end) {
        return fs.createReadStream(path, {
            start: start,
            end: end,
            autoClose: true
        });
    }
    static statAsync(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err)
                    reject(err);
                else
                    resolve(stats);
            });
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=fs.js.map