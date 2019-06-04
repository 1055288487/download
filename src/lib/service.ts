import api from './api';
import { IFile, IResult, IRequestValue } from './types';
const cache = require('memory-cache');

export default class {
    public static async findFile(md5: string): Promise<IFile | null> {

        let key = `file_${md5}`;
        let file: IFile = cache.get(key);
        if (file) return file;

        let result = await api.fetchFile(md5);
        if (!result || !result.success)
            return null;

        cache.put(key, result.data, 1000 * 60 * 5);

        return result.data;
    }
} 