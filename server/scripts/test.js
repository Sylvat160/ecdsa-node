const { keccak256 } = require('ethereum-cryptography/keccak')
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils')
const secp = require('ethereum-cryptography/secp256k1')

const privateKey = secp.secp256k1.utils.randomPrivateKey()

function hashMessage(message) {
    return keccak256(utf8ToBytes(message))
}

function getPublicKey(privateKey) {
    return secp.secp256k1.getPublicKey(privateKey)
}

function signMessage(message, privateKey) {
    const hash = hashMessage(message)
    const signature = secp.secp256k1.sign(hash, privateKey)
    return signature
}

function recoverKey(message, signature) {
    const publicKey = signature.recoverPublicKey(msg)
    return publicKey
}

function getAccountAddress(publicKey) {
    return keccak256(publicKey.slice(1)).slice(-20)
}

msg = hashMessage("Hello World")
sign =  signMessage("Hello", privateKey, { recovered : true })
publicKey = getPublicKey(privateKey)
rec = recoverKey("Hello", sign)

console.log("____________________ h a s h i n g ....................");

console.log(msg)
console.log("____________________ s i g n i n g ....................");
console.log(sign)

console.log("____________________ r e c o v e r i n g ....................");
console.log(rec)

console.log("____________________ p u b l i c K e y ....................");
console.log(publicKey)

console.log("____________________ a d d r e s s ....................");
console.log(getAccountAddress(publicKey))
console.log(toHex(getAccountAddress(publicKey)));