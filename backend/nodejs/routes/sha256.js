const express = require('express');
const sjcl = require('sjcl');

const router = express.Router();

router.post('/', (req, res) => {
  const { num1, num2 } = req.body;

  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    res.status(400).json({ message: 'Please enter two valid numbers' });
    return;
  }

  const sumBitArray = sjcl.hash.sha256.hash(`${Number(num1) + Number(num2)}`);
  const sumHash = sjcl.codec.hex.fromBits(sumBitArray);

  res.json({ sum: sumHash });
});

module.exports = router;
