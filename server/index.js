const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0240d219224f2bf0d485f7bb79143a478de1b41f3994d05b59d4d0864044cbecdc": 100, //me
  "024d56bc2ef7943762ea182a03f0f8611c0ca1ade63aa260b33d607fb0499631e8": 50, //you
  "03ec24346fc004973cc90ec6478c5d8cd893a9bab29e057dfa0255b94a605df860": 75, //someone else
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
