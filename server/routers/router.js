const express = require('express');
const router = express.Router();
require("dotenv").config();
const { User } = require('../db/schema');
const webpush = require('web-push');

webpush.setGCMAPIKey(process.env.FCM_KEY);
webpush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY
);

router.get('/', (req, res) => {
    res.sendFile('../../client/index.html');
});

router.post('/new', async (req, res) => {
    const sub = req.body;
    const { endpoint, expirationTime, keys } = req.body;
    console.log(sub);

    await User.create({
        endpoint,
        expiration_time:expirationTime,
        keys
    })

    webpush.sendNotification(sub, "구독완료!###이제 학과 공지사항을 알림으로 받아볼 수 있습니다");
    res.status(201);
})

// router.post('/noti')

module.exports = router;