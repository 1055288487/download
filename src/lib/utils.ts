import * as url from 'url';

const crypto = require('cryptojs').Crypto,
    config = require('../../config.json');
export default class {

    static url2md5(_url: string): string | null {
        if (!_url) return null;

        let pathname = url.parse(_url).pathname;

        if (!pathname)
            return null;

        let paths = pathname.split('/');

        let requestFileName = paths[paths.length - 1];

        let md5 = requestFileName.slice(0, 32);

        return md5;
    }



    static parseRange(headerRange: string, size: number): { start: number, end: number } | null {
        
        if (!headerRange) return null;
        if (headerRange.length > 6 && headerRange.indexOf('bytes=') > -1)
            headerRange = headerRange.substring(6);

        let range = headerRange.split("-"),
            start = parseInt(range[0], 10),
            end = parseInt(range[1], 10);

        if (!start)
            start = 0;

        if (!end || end > size)
            end = size;


        if (start > end)
            start = end;

        return {
            start: start,
            end: end
        };
    };

    /**
     * 使用aes加密成16进制
     * @param value 
     */
    static encrypt(value: string): string {
        let encryptValue = crypto.AES.encrypt(value, config.cryptoKey);
        return Buffer.from(encryptValue).toString('hex');
    }

    /**
     * 使用 aes 16进制解密为明文
     * @param value 
     */
    static decrypt(value: string): string {
        let encryptValue = Buffer.from(value, 'hex').toString();
        return crypto.AES.decrypt(encryptValue, config.cryptoKey);
    }

}