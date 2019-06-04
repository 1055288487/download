import * as mongoose from 'mongoose';
import * as Grid from 'gridfs-stream';
const config = require("../../config");
let conn = mongoose.createConnection(config.gridfs.connection);
export default class {

    static find(filename: string) {
        const gfs = Grid(conn.db, mongoose.mongo);
        return gfs.createReadStream({ filename: filename })
    }

    static async exists(filename: string) {
        return new Promise((resolve, reject) => {
            const gfs = Grid(conn.db, mongoose.mongo);
            return gfs.exist({ filename: filename }, (err: Error, found: any) => {
                if (err) reject(err)
                resolve(found)
            })
        })
    }

    static async findOne(filename: string) {
        return new Promise((resolve, reject) => {
            const gfs = Grid(conn.db, mongoose.mongo);
            return gfs.files.find({ filename: filename }).toArray(function (err, files) {
                if (err) reject(err)
                resolve(files)
            });
        })
    }

    // let readStream = gfs.createReadStream({ filename: filename })

    // stream转buffer
    // static streamToBuffer(stream: any) {
    //     return new Promise((resolve, reject) => {
    //         let buffers: any = [];
    //         stream.on('error', reject);
    //         stream.on('data', (data: any) => buffers.push(data))
    //         stream.on('end', () => resolve(Buffer.concat(buffers)))
    //     });
    // }


}



