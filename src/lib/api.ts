import rq from './rq';
import {  IFile,IResult } from './types';
const DEBUG = require('debug'),
    debug = DEBUG('api:debug'),
    logError = DEBUG('api:error');


export default class {


    public static async fetchFile(md5: string): Promise<IResult<IFile> | null> {
        let result = await rq.get(`/api/file/${md5}`);
        if (result.status !== 200) {
            logError('fetchFile md5:%s http status code:%d / %s', md5, result.status, result.statusText);
            return null;
        }
        return result.data;
    }



}
