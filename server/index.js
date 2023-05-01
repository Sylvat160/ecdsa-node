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
  '0240d219224f2bf0d485f7bb79143a478de1b41f3994d05b59d4d0864044cbecdc': 100, //me
  '024d56bc2ef7943762ea182a03f0f8611c0ca1ade63aa260b33d607fb0499631e8': 50, //you
  '03ec24346fc004973cc90ec6478c5d8cd893a9bab29e057dfa0255b94a605df860': 75, //someone else
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message))
}

function verifySignature(signature, message, publicKey) {
  return secp.secp256k1.verify(signature, hashMessage(message), publicKey)
}

function transfer(sender, recipient, amount, signature) {
  const senderBalance = balances[sender]
  const recipientBalance = balances[recipient]

  // verify the signature
  const publicKey = verifySignature(signature, hashMessage(`${amount}${recipient}`), sender)
  if (!publicKey) {
    throw new Error('Invalid signature!')
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' })
  } else {
    balances[sender] -= amount
    balances[recipient] += amount
    res.send({ balance: balances[sender] })
  }

}

app.get('/balance/:address', (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post('/send', (req, res) => {
  // TODO:  Get a signature from a client side
  //recover the public key from the signature

  const { sender, recipient, amount, signature } = req.body

  setInitialBalance(sender)
  setInitialBalance(recipient)

  try {
    transfer(sender, recipient, amount, signature)
  } catch (e) {
    res.status(400).send({ message: e.message })
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
