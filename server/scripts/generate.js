const secp = require('ethereum-cryptography/secp256k1')
const { toHex } = require('ethereum-cryptography/utils')
const { getRandomBytesSync } = require("ethereum-cryptography/random");

const privateKey = secp.secp256k1.utils.randomPrivateKey()

console.log(toHex(privateKey));