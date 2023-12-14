const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

function getPath(index){
    return {
        domain: `https://www.yu.ac.kr/`,
        href: `https://www.yu.ac.kr/electronics/community/notice.do`,
        check_notice: `table.board-table > tbody > :nth-child(${index}) > td.b-num-box`,
        title: `table.board-table > tbody > :nth-child(${index}) > td.b-td-left > div.b-title-box > a > span`,
        upload_time: `table.board-table > tbody > :nth-child(${index}) > :nth-child(4)`
    };
}

module.exports = async () => {
    const noti_topbox = [];
    let noti = "";

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.yu.ac.kr/electronics/community/notice.do`);
    const content = await page.content();
    await page.close();
    await browser.close();

    const $ = cheerio.load(content);

    for(let i=1; i<10; i++){
        const obj = getPath(i)
        if($(obj.check_notice).text().trim() === '공지'){
            noti_topbox.push($(obj.title).text());
        }else{
            noti = $(obj.title).text();
            break;
        }
    }

    return {
        noti_topbox,
        noti
    };
}