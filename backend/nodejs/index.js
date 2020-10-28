const express = require('express');

const writeRoute = require('./routes/write');
const sha256Route = require('./routes/sha256');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/write', writeRoute);
app.use('/sha256', sha256Route);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
