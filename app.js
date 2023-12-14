const express = require('express');
const path = require('path');
const cors = require('cors');
require("dotenv").config();
const DBConnection = require('./server/db/db-connection');
const router = require('./server/routers/router');

const app = express();
const port = process.env.PORT || 3000;

DBConnection();

const service = require('./server/utils/alert-service');

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({ origin: "*" }));

app.use(router);

service();

app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
      message: `${err.message}`,
    });
});

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});