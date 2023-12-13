const crawler = require('./crawler');
const cron = require('node-cron');

module.exports = async () => {
    let temp = await crawler();

    cron.schedule('0 * * * * *', async () => {
        const data = await crawler();
        if(temp.title !== data.title){
            console.log(`이전 글 | 제목 : ${temp.title} 링크 : ${temp.link}`);

            temp = data;

            console.log(`새로운 글 | 제목 : ${temp.title} 링크 : ${temp.link}`);
        }
    })
    
}