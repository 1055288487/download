import * as axios from 'axios';
const DEBUG = require('debug'),
    debug = DEBUG('api:debug'),
    logError = DEBUG('api:error'),
    config = require('../../config.json'),
    options: axios.AxiosRequestConfig = {
        baseURL: config.api.host,
        auth: {
            username: config.api.appkey,
            password: config.api.appsecret
        },
        headers: {
            "Content-Type": "application/json"
        }

    };


export default class {

    static async  get(path: string): Promise<axios.AxiosResponse> {
        debug('rq get:%s%s', options.baseURL, path);
        return await axios.default.get(path, options);
    }

    static async put(path: string, data: any): Promise<axios.AxiosResponse> {
        debug('rq put:%s%s,data:%j', options.baseURL, path, data);
        return await axios.default.put(path, data, options);
    }

    static async post(path: string, data: any): Promise<axios.AxiosResponse> {
        debug('rq post:%s%s,data:%j', options.baseURL, path, data);
        return await axios.default.post(path, data, options);
    }
    
    static async delete(path: string): Promise<axios.AxiosResponse> {
        debug('rq post:%s%s', options.baseURL, path);
        return await axios.default.delete(path, options);
    }
}