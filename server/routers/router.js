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

router.post('/user', async (req, res) => {
    const { endpoint, expirationTime, keys } = req.body;

    await User.create({
        endpoint,
        expiration_time:expirationTime,
        keys
    })

    webpush.sendNotification({
        endpoint,
        expirationTime,
        keys
    }, "구독완료!###이제 학과 공지사항을 알림으로 받아볼 수 있습니다");
    res.status(201).json({
        msg: "구독 완료"
    });
})

router.post('/noti', async (req, res) => {
    const { title, text } = req.body;

    const sub_list = await User.find({});

    for(const obj of sub_list) {
        const sub_data = {
            endpoint: obj.endpoint,
            expirationTime: obj.expiration_time,
            keys: obj.keys
        }

        webpush.sendNotification(
            sub_data,
            `${title}###${text}`
        );
        res.status(200).json({
            msg: "푸시 보냄"
        });
    }
})

router.delete('/user', async (req, res) => {
    const { endpoint } = req.body;

    await User.findOneAndDelete({endpoint})

    res.status(200).json({
        msg: "유저 삭제됨"
    });
})

module.exports = router;