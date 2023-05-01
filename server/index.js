const express = require('express')
const app = express()
const cors = require('cors')
const port = 3042

const { keccak256 } = require('ethereum-cryptography/keccak')
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils')
const secp = require('ethereum-cryptography/secp256k1')

app.use(cors())
app.use(express.json())

const balances = {
  '021af9c4c1d0890567f61f39fbc58837b34447ed6fce0c1d0588d05dc0de65cb56': 100,
  // 78a3e67fa8ffb560fb22943f22381add641e5ae112fcd520cfa80fc4c1ea7245
  '0234f937516c1185d95b969a023df56212a07095560fbc1d325287d74d0162b5b3': 50,
  // 338a06d2c8b67b5f1da4e61988307be5db85651979c12786b2f6a7c3c2942aa1
  '02c84f505fea2eb7de8cb5cb8758f92265428d308c58fc9acf0e5817a51f54b4c4': 75,
  // 62a79b4f0a491062ee80cc40561df256ec892dcff8bfb5b45ede5ff8ce35779a
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message))
}

function signMessage(message, privateKey) {
  const hash = hashMessage(message)
  const signature = secp.secp256k1.sign(hash, privateKey)
  return signature
}

function verifySignature(signature, message, publicKey) {
  return secp.secp256k1.verify(signature, hashMessage(message), publicKey)
}

function getPublicKey(privateKey) {
  return secp.secp256k1.getPublicKey(privateKey)
}

app.get('/balance/:address', (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post('/send', (req, res) => {
  // TODO:  Get a signature from a client side
  //recover the public key from the signature

  const { sender, recipient, amount } = req.body

  const senderBalance = toHex(getPublicKey(sender))
  setInitialBalance(senderBalance)
  setInitialBalance(recipient)

  // signing
  const sign = signMessage(`${amount}${recipient}`, sender)

  // verify the signature
  const publicKey = verifySignature(
    sign,
    `${amount}${recipient}`,
    senderBalance,
  )
  if (!publicKey) {
    throw new Error('Invalid signature!')
  }

  if (balances[senderBalance] < amount) {
    res.status(400).send({ message: 'Not enough funds!' })
  } else {
    balances[senderBalance] -= amount
    balances[recipient] += amount
    console.log('Transaction successful!, signed by:', senderBalance);
    res.send({ balance: balances[senderBalance] })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}
