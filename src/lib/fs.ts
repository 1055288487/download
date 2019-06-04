
import * as fs from 'fs';

const DEBUG = require('debug'),
    debug = DEBUG('fs:debug'),
    logError = DEBUG('fs:error');


export default class {

    /**
     * 判断文件是否存在
     * @param path 
     */
    public static existsAsync(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve: (value: boolean) => void, reject: () => void) => {
            fs.exists(path, (e) => {
                resolve(e);
            })
        });
    }

    /**
     * 读取文件流
     * @param path 
     * @param start 
     * @param end 
     */
    public static readFileStream(path: string, start: number, end: number): fs.ReadStream {
        return fs.createReadStream(path, {
            start: start,
            end: end,
            autoClose: true
        });
    }

    public static statAsync(path: string): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve: (value: fs.Stats) => void, reject: (err: Error) => void) => {
            fs.stat(path, (err, stats) => {
                if (err)
                    reject(err);
                else
                    resolve(stats);
            });
        });
    }
}