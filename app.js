const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const service = require('./src/alert-service');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

service();

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});