"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const url = require("url");
const fileMd5 = '718df5c00fe822e3cfac1bae65703a81';
(function () {
    let downloadUrl = url.parse('http://192.168.16.183/44567a67376339614e544b2b64556c69652f366938466430483137667552756b417a62787376417133574b6d4f486934735072442f464f64347370324f43492f2b4239616a47644451573169715244452f47445334717a6f6b5972546d6c55304f6a36584e6f413d');
    let opt = {
        hostname: downloadUrl.hostname,
        port: downloadUrl.port,
        method: 'get',
        path: downloadUrl.path,
        headers: {
            Range: 'bytes=0-1024'
        }
    };
    let req = http.request(opt, (res) => {
        res.on('data', (chunk) => {
            console.log(chunk);
        });
    });
    req.on('error', (err) => {
        console.error(err.stack);
    });
    req.end();
}());
//# sourceMappingURL=download_test.js.map