import utils from '../lib/utils';
import * as http from 'http';
import * as url from 'url';

const fileMd5 = '718df5c00fe822e3cfac1bae65703a81';
(function () {

    // let opt = {
    //     hostname: '192.168.16.181',
    //     port: 80,
    //     method: 'get',
    //     path: '/api/download/'+fileMd5,
    //     headers: {
    //         Authorization: 'Basic NGY4NjA2NDk2MDBhNDc1MDgzNzk2MzlkYmE4MjMyN2Q6ZjNiNThmNmI5MzViNGFjZDlkOWU3OTU4NjRhZDEwZDQ='
    //     }
    // };
    // let req = http.request(opt, (res) => {
    //     res.on('data', (chunk) => {
    //         console.log(chunk.toString());
    //     });
    // });
    // req.end()



    let downloadUrl = url.parse('http://192.168.16.183/44567a67376339614e544b2b64556c69652f366938466430483137667552756b417a62787376417133574b6d4f486934735072442f464f64347370324f43492f2b4239616a47644451573169715244452f47445334717a6f6b5972546d6c55304f6a36584e6f413d');
    let opt: object = {
        hostname: downloadUrl.hostname,
        port: downloadUrl.port,
        method: 'get',
        path: downloadUrl.path,
        headers: {
            Range: 'bytes=0-1024'
        }
    };


    let req = http.request(opt, (res: http.ClientResponse) => {
        res.on('data', (chunk: Buffer) => {
            console.log(chunk);
        });
    });
    req.on('error', (err: Error) => {
        console.error(err.stack);
    })
    req.end()


}());