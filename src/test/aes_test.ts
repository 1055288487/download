// const crypto = require('cryptojs').Crypto;
// console.time('ts');
// let key = 'a3f07d535e744f4a8e88fc8de92981c5';
// let value = 'f57e3d4861994dcead73a4aa57e7bc47';//JSON.stringify({ md5: "f57e3d4861994dcead73a4aa57e7bc47", ts: Date.now() });

// const iv = [0xEF, 0x24, 0x36, 0x08, 0x70, 0xBB, 0x8D, 0xFF,
// 0xEF, 0x24, 0x36, 0x08, 0x70, 0xBB, 0x8D, 0xFF];

// let encryptResult = crypto.AES.encrypt(value, key, { iv: iv });
// let hex = Buffer.from(encryptResult).toString('hex')

// console.log('encrypt:%s\nhex:%s', encryptResult, hex);

// let v = Buffer.from(hex, 'hex').toString();

// console.log('encrypt:%s', v);

// let decryptResult = crypto.AES.decrypt(encryptResult, key, { iv: iv });

// console.log('decryptResult:%s', decryptResult);
// console.timeEnd('ts');


// //4TG5ZxGd6SZ553mFLuhWCZ99X03BZWx/q5zc6OKrB3bcSmmHOQ3J4TCuHT/BJM34