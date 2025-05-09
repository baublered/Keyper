const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- RSA Key Pair Generation (Persistent for session) ---
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// --- AES Encryption ---
function encryptAES(text) {
  const key = crypto.randomBytes(32); // 256-bit key
  const iv = crypto.randomBytes(16);  // AES block size

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return {
    encrypted: encrypted + ':' + iv.toString('base64'),
    key: key.toString('base64'),
  };
}

function decryptAES(encryptedData, keyBase64) {
  const [encryptedText, ivBase64] = encryptedData.split(':');
  const key = Buffer.from(keyBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// --- RSA Encryption ---
function encryptRSA(text) {
  const encryptedBuffer = crypto.publicEncrypt(publicKey, Buffer.from(text));
  return encryptedBuffer.toString('base64');
}

function decryptRSA(encryptedBase64) {
  const decryptedBuffer = crypto.privateDecrypt(privateKey, Buffer.from(encryptedBase64, 'base64'));
  return decryptedBuffer.toString('utf8');
}

// --- Encrypt Endpoint ---
app.post('/encrypt', (req, res) => {
  const { password, method } = req.body;

  const start = process.hrtime();
  let encrypted, key;

  try {
    if (method === 'AES') {
      const result = encryptAES(password);
      encrypted = result.encrypted;
      key = result.key;
    } else if (method === 'RSA') {
      encrypted = encryptRSA(password);
    } else {
      return res.status(400).json({ error: 'Invalid method' });
    }

    const end = process.hrtime(start);
    const duration = (end[0] * 1e9 + end[1]) / 1e6; // ms

    res.json({ encrypted, key, duration });
  } catch (error) {
    res.status(500).json({ error: 'Encryption failed', details: error.message });
  }
});

// --- Decrypt Endpoint ---
app.post('/decrypt', (req, res) => {
  const { encrypted, method, key } = req.body;

  const start = process.hrtime();
  let decrypted;

  try {
    if (method === 'AES') {
      if (!key) return res.status(400).json({ error: 'Missing AES key' });
      decrypted = decryptAES(encrypted, key);
    } else if (method === 'RSA') {
      decrypted = decryptRSA(encrypted);
    } else {
      return res.status(400).json({ error: 'Invalid method' });
    }

    const end = process.hrtime(start);
    const duration = (end[0] * 1e9 + end[1]) / 1e6;

    res.json({ decrypted, duration });
  } catch (error) {
    res.status(500).json({ error: 'Decryption failed', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
