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
const http = require("http");
const utils_1 = require("./utils");
const fs_1 = require("./fs");
const fs = require("fs");
const path = require("path");
const gridfs_1 = require("../lib/gridfs");
const service_1 = require("./service");
const config = require("../../config"), mime = require('../../mime.json'), DEBUG = require('debug'), debug = DEBUG('server:debug'), logError = DEBUG('server:error');
const routers = [
    { name: 'cleartext', patt: /^\/\w{1}\/\w{1}\/\w{1}\/\w{1}\/\w{1}\/(\w{32})\.dat/i },
    { name: 'ciphertext', patt: /^\/([0-9a-f]+)/i }
];
class Server {
    start() {
        this._server = http.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
            this.setHeader(res);
            try {
                let url = req.url;
                debug('req url:', url);
                let data = url.toString().split('/');
                if (data.indexOf('preview') > -1) {
                    return yield this.findPicture(req, res, data);
                }
                yield this.process(req, res);
            }
            catch (err) {
                logError('process error:', err);
                res.writeHead(500);
                res.end('服务端异常。');
            }
        }));
        this._server.listen(config.serverPort || 8124, () => {
            debug('server start:%j', this._server.address());
        });
    }
    setHeader(res) {
        res.setHeader("Server", "WSS/V8");
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Cache-Control', 'max-age=' + 315360000);
    }
    matchUrl(url) {
        let result = null;
        routers.forEach(e => {
            let reg = e.patt.exec(url);
            if (reg) {
                result = {
                    name: e.name,
                    hash: reg[1]
                };
                return;
            }
        });
        return result;
    }
    send304(res) {
        debug('send 304');
        res.writeHead(304);
        res.end();
    }
    sendOk(res, ext, stream, size) {
        debug('send ok');
        res.writeHead(200, {
            'Content-Type': mime[ext],
            'Content-Length': size
        });
        stream.pipe(res);
    }
    send404(res, url) {
        logError('send 404,文件不存在:%s', url || '');
        res.writeHead(404);
        res.end();
    }
    send401(res, url) {
        logError('未授权的访问:%s', url || '');
        res.writeHead(401);
        res.end();
    }
    decryptHash(hash) {
        try {
            let dec = JSON.parse(utils_1.default.decrypt(hash));
            if (!dec || (config.cryptoExpired.enable && dec.ts < (Date.now() - config.cryptoExpired.times)))
                return null;
            return dec.md5;
        }
        catch (error) {
            logError("decryptMD5:", error);
            return null;
        }
    }
    findPicture(req, res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = req.url;
            debug('req url:', url);
            let md5 = data[data.length - 2];
            let flag = data[data.length - 1];
            if (!md5)
                return this.send404(res, url);
            let file = yield service_1.default.findFile(md5);
            if (!file) {
                logError('数据库里不存在文件,MD5:', md5);
                return this.send404(res, url);
            }
            let ext = file.fileName.split('.');
            if (flag === '1') {
                let result = yield gridfs_1.default.findOne(md5);
                if (result) {
                    let stream = gridfs_1.default.find(md5);
                    return this.sendOk(res, (ext[ext.length - 1]).toLowerCase(), stream, result[0].length);
                }
                return this.send404(res, url);
            }
            else if (flag === '2') {
                let result = yield gridfs_1.default.findOne('MH' + md5);
                if (result.length > 0) {
                    let stream = gridfs_1.default.find('MH' + md5);
                    return this.sendOk(res, (ext[ext.length - 1]).toLowerCase(), stream, result[0].length);
                }
                return this.send404(res, url);
            }
        });
    }
    process(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = req.url;
            debug('req url:', url);
            if (!url)
                return this.send404(res, url);
            let router = this.matchUrl(url);
            if (!router)
                return this.send404(res, url);
            let md5;
            if (router.name === 'cleartext') {
                md5 = router.hash;
                if (!md5)
                    return this.send404(res, url);
            }
            else {
                md5 = this.decryptHash(router.hash);
                if (!md5)
                    return this.send401(res, url);
            }
            let file = yield service_1.default.findFile(md5);
            if (!file) {
                logError('数据库里不存在文件,MD5:', md5);
                return this.send404(res, url);
            }
            let realPath = path.join(config.storage.path, file.path);
            let stats = yield fs_1.default.statAsync(realPath);
            if (!stats) {
                logError('硬盘上不存在文件：%s', realPath);
                return this.send404(res, url);
            }
            if (req.headers['ETag'] === md5) {
                return this.send304(res);
            }
            res.setHeader('Content-MD5', md5);
            res.setHeader('ETag', md5);
            let fileDate = new Date(file.createDate).toLocaleString();
            res.setHeader('Date', fileDate);
            res.setHeader('Last-Modified', fileDate);
            let encodedName = encodeURIComponent(file.fileName);
            res.setHeader('Content-Disposition', 'attachment; filename="' + encodedName + '"');
            let ext = path.extname(file.fileName);
            ext = ext ? ext.slice(1) : 'unknown';
            let contentType = mime[ext] || "application/octet-stream";
            res.setHeader("Content-Type", contentType);
            let range = utils_1.default.parseRange(req.headers["Range"] || req.headers["range"], stats.size);
            if (!range || (range.start === 0 && range.end === stats.size))
                return this.noRangeHandler(res, realPath, stats.size);
            this.rangeHandler(res, stats.size, realPath, range.start, range.end);
        });
    }
    noRangeHandler(res, path, cotentLength) {
        debug('noRangeHandler: %s', path);
        res.setHeader("Content-Length", cotentLength.toString());
        res.writeHead(200);
        let stream = fs.createReadStream(path);
        stream.on('end', () => {
            debug('noRangeHandler: %s read end success.', path);
        });
        stream.on('error', function (err) {
            res.writeHead(500);
            res.write('error:' + err);
            res.end();
            logError('noRangeHandler read stream error:%s / %s', path, err);
        });
        stream.pipe(res);
    }
    rangeHandler(res, total, path, start, end) {
        debug('rangeHandler:%s,range:%d-%d', path, start, end);
        let dataLength = end - start;
        if (end < total)
            dataLength += 1;
        res.setHeader("Content-Length", dataLength.toString());
        res.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + total);
        res.writeHead(206);
        let fileStream = fs_1.default.readFileStream(path, start, end);
        fileStream.pipe(res);
        fileStream.on('error', function (err) {
            res.writeHead(500);
            res.write('error:' + err);
            res.end();
            logError('rangeHandler read stream error:%s / %s', path, err);
        });
        fileStream.on('end', () => {
            debug('rangeHandler:%d-%d - %s read end success.', start, end, path);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map