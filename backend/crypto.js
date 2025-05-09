const crypto = require('crypto');
const forge = require('node-forge');

// RSA key pair (in-memory for demo)
const rsa = forge.pki.rsa;
const keypair = rsa.generateKeyPair({ bits: 2048, e: 0x10001 });

function encryptAES(text, key = '1234567812345678') {
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key), iv);
let encrypted = cipher.update(text);
encrypted = Buffer.concat([encrypted, cipher.final()]);
return {
    encrypted: iv.toString('hex') + ':' + encrypted.toString('hex'),
    key
};
}

function decryptAES(encryptedText, key) {
const parts = encryptedText.split(':');
const iv = Buffer.from(parts[0], 'hex');
const encrypted = Buffer.from(parts[1], 'hex');
const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key), iv);
let decrypted = decipher.update(encrypted);
decrypted = Buffer.concat([decrypted, decipher.final()]);
return decrypted.toString();
}

function encryptRSA(text) {
return forge.util.encode64(keypair.publicKey.encrypt(text));
}

function decryptRSA(encryptedText) {
return keypair.privateKey.decrypt(forge.util.decode64(encryptedText));
}

module.exports = { encryptAES, decryptAES, encryptRSA, decryptRSA };
