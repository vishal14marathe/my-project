const CryptoJS = require('crypto-js');

const encryptField = (text) => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

const decryptField = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  const bytes = CryptoJS.AES.decrypt(encryptedText, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptField, decryptField };