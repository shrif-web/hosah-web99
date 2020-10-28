const express = require('express');
const sjcl = require('sjcl');

const router = express.Router();

router.post('/', (req, res) => {
  const { num1, num2 } = req.body;
  const sumBitArray = sjcl.hash.sha256.hash(num1 + num2);
  const sumHash = sjcl.codec.hex.fromBits(sumBitArray);

  res.json({ sum: sumHash });
});

module.exports = router;
