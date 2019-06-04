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
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const config = require("../../config");
let conn = mongoose.createConnection(config.gridfs.connection);
class default_1 {
    static find(filename) {
        const gfs = Grid(conn.db, mongoose.mongo);
        return gfs.createReadStream({ filename: filename });
    }
    static exists(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const gfs = Grid(conn.db, mongoose.mongo);
                return gfs.exist({ filename: filename }, (err, found) => {
                    if (err)
                        reject(err);
                    resolve(found);
                });
            });
        });
    }
    static findOne(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const gfs = Grid(conn.db, mongoose.mongo);
                return gfs.files.find({ filename: filename }).toArray(function (err, files) {
                    if (err)
                        reject(err);
                    resolve(files);
                });
            });
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=gridfs.js.map