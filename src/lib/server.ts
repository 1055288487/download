import * as http from 'http';
import utils from './utils';
import wfs from './fs';
import * as fs from 'fs';
import * as  path from "path";
import { IFile, IResult, IRequestValue } from './types';
// import * as zlib from 'zlib';
import gridfs from '../lib/gridfs'
import service from './service';
const config = require("../../config"),
    mime = require('../../mime.json'),

    DEBUG = require('debug'),
    debug = DEBUG('server:debug'),
    logError = DEBUG('server:error');

const routers = [
    { name: 'cleartext', patt: /^\/\w{1}\/\w{1}\/\w{1}\/\w{1}\/\w{1}\/(\w{32})\.dat/i },
    { name: 'ciphertext', patt: /^\/([0-9a-f]+)/i }];
export default class Server {

    _server: http.Server;
    start() {
        this._server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
            this.setHeader(res);
            try {
                let url: any = req.url;
                debug('req url:', url);
                let data = url.toString().split('/')
                if (data.indexOf('preview') > -1) {
                    return await this.findPicture(req, res, data);
                }
                await this.process(req, res);
            }
            catch (err) {
                logError('process error:', err);
                res.writeHead(500);
                res.end('服务端异常。');

            }
        })
        this._server.listen(config.serverPort || 8124, () => {
            debug('server start:%j', this._server.address());
        });
    }

    setHeader(res: http.ServerResponse) {
        res.setHeader("Server", "WSS/V8");
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Cache-Control', 'max-age=' + 315360000);
        // res.setHeader('connection', 'close')
    }



    matchUrl(url: string): { name: string, hash: string } | null {
        // /f/6/8/6/3/f6863078de6da6a841f44a62e6673223.dat
        // let patt = /^\/\w{1}\/\w{1}\/\w{1}\/\w{1}\/\w{1}\/\w{32}\.dat/i;
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

    send304(res: http.ServerResponse) {
        debug('send 304')
        res.writeHead(304);
        res.end();
    }

    sendOk(res: http.ServerResponse, ext: string, stream: any, size: number) {
        debug('send ok')
        res.writeHead(200, {
            'Content-Type': mime[ext],
            'Content-Length': size
        })
        stream.pipe(res);
    }


    send404(res: http.ServerResponse, url: string | undefined) {
        logError('send 404,文件不存在:%s', url || '');
        res.writeHead(404);
        res.end();
    }
    send401(res: http.ServerResponse, url: string) {
        logError('未授权的访问:%s', url || '');
        res.writeHead(401);
        res.end();
    }

    decryptHash(hash: string): string | null {
        try {

            let dec: IRequestValue = JSON.parse(utils.decrypt(hash));
            if (!dec || (config.cryptoExpired.enable && dec.ts < (Date.now() - config.cryptoExpired.times)))
                return null;
            return dec.md5;
        } catch (error) {
            logError("decryptMD5:", error);
            return null;
        }

    }

    async findPicture(req: http.IncomingMessage, res: http.ServerResponse, data: string[]) {
        let url: any = req.url;
        debug('req url:', url);

        let md5: string = data[data.length - 2];
        let flag: string = data[data.length - 1];
        if (!md5) return this.send404(res, url);
        let file: IFile | null = await service.findFile(md5);
        if (!file) {
            logError('数据库里不存在文件,MD5:', md5);
            return this.send404(res, url);
        }
        let ext = file.fileName.split('.')
        if (flag === '1') {
            let result: any = await gridfs.findOne(md5)
            if (result) {
                let stream = gridfs.find(md5)
                // let file = await gridfs.findOne(md5)
                return this.sendOk(res, (ext[ext.length - 1]).toLowerCase(), stream, result[0].length)
            }
            return this.send404(res, url);
        }
        else if (flag === '2') {
            let result: any = await gridfs.findOne('MH' + md5)
            if (result.length > 0) {
                let stream = gridfs.find('MH' + md5)
                // let file = await gridfs.findOne('MH' + md5)
                return this.sendOk(res, (ext[ext.length - 1]).toLowerCase(), stream, result[0].length)
            }
            return this.send404(res, url);
        }

    }

    async  process(req: http.IncomingMessage, res: http.ServerResponse) {
        let url: any = req.url;
        debug('req url:', url);

        if (!url)
            return this.send404(res, url);

        let router = this.matchUrl(url);
        if (!router)
            return this.send404(res, url);
        let md5: string | null;
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


        let file: IFile | null = await service.findFile(md5);

        if (!file) {
            logError('数据库里不存在文件,MD5:', md5);
            return this.send404(res, url);
        }

        let realPath = path.join(config.storage.path, file.path);

        let stats = await wfs.statAsync(realPath);
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


        let range = utils.parseRange(req.headers["Range"] || req.headers["range"], stats.size);

        if (!range || (range.start === 0 && range.end === stats.size))
            return this.noRangeHandler(res, realPath, stats.size);

        this.rangeHandler(res, stats.size, realPath, range.start, range.end);

    }

    noRangeHandler(res: http.ServerResponse, path: string, cotentLength: number) {
        debug('noRangeHandler: %s', path);
        res.setHeader("Content-Length", cotentLength.toString());
        res.writeHead(200);
        let stream = fs.createReadStream(path);
        stream.on('end', () => {
            debug('noRangeHandler: %s read end success.', path);
        });
        stream.on('error', function (err: Error) {
            res.writeHead(500);
            res.write('error:' + err);
            res.end();
            logError('noRangeHandler read stream error:%s / %s', path, err);
        });
        stream.pipe(res);

    }

    // { server: 'nginx/1.13.5',
    // date: 'Fri, 13 Oct 2017 05:41:54 GMT',
    // 'content-type': 'application/octet-stream',
    // 'content-length': '2049',
    // 'last-modified': 'Thu, 12 Oct 2017 02:13:38 GMT',
    // connection: 'close',
    // etag: '"59decfd2-13912e"',
    // 'content-range': 'bytes 0-2048/1282350' }


    rangeHandler(res: http.ServerResponse, total: number, path: string, start: number, end: number) {

        debug('rangeHandler:%s,range:%d-%d', path, start, end);

        let dataLength: number = end - start;
        if (end < total) dataLength += 1;
        res.setHeader("Content-Length", dataLength.toString());
        //if (end !== total) { // 修复视频播放不出的问题 joe 20170824
        res.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + total);
        res.writeHead(206);
        // }
        //let tempChunk: Buffer = Buffer.alloc(dataLength);
        // let offset = 0;
        let fileStream = wfs.readFileStream(path, start, end);

        // fileStream.on('data', function (chunk: Buffer) {
        //     if (chunk) {
        //         chunk.copy(tempChunk, offset);
        //         offset += chunk.length;
        //     }
        // });

        fileStream.pipe(res);

        fileStream.on('error', function (err: Error) {
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