const crawler = require('./crawler');
const cron = require('node-cron');
require("dotenv").config();
const { User } = require('../db/schema');
const webpush = require('web-push');

webpush.setGCMAPIKey(process.env.FCM_KEY);
webpush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY
);

module.exports = async () => {
    try{
        let { noti_topbox, noti } = await crawler();
        console.log(noti_topbox);
        console.log(noti);
    
        cron.schedule('0 * * * * *', async () => {
            const data = await crawler();
            console.log(data.noti_topbox);
            console.log(data.noti);
            if(data.noti_topbox !== noti_topbox){
                const diff = data.noti_topbox.filter(item => !noti_topbox.includes(item))
                noti_topbox = data.noti_topbox;
                if(diff.length > 0){
                    const sub_list = await User.find({});
                    for(str of diff){
                        for(const obj of sub_list) {
                            const sub_data = {
                                endpoint: obj.endpoint,
                                expirationTime: obj.expiration_time,
                                keys: obj.keys
                            }
        
                            webpush.sendNotification(
                                sub_data,
                                `신규 공지사항###${str}`
                            );
                        }
                    }
                }
            }
            if(data.noti !== noti){
                noti = data.noti;
                const sub_list = await User.find({});
                for(const obj of sub_list) {
                    const sub_data = {
                        endpoint: obj.endpoint,
                        expirationTime: obj.expiration_time,
                        keys: obj.keys
                    }
    
                    webpush.sendNotification(
                        sub_data,
                        `신규 공지사항###${data.noti}`
                    );
                }
    
            }
        })
    }catch(e){
        next(e);
    }
}