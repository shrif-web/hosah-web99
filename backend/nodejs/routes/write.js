const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  const lineNumber = parseInt(req.query.lineno, 10);

  if (Number.isNaN(req.query.lineno)
    || lineNumber < 1
    || lineNumber > 100) {
    res.status(400).json({
      message: 'Line number should be a number between 1 and 100',
    });
    return;
  }

  fs.readFile('../lines.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: 'An error occured',
      });
      return;
    }

    const lines = data.split('\n');

    res.send(lines[lineNumber - 1]);
  });
});

module.exports = router;
