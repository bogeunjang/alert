const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const obj = {
    domain: `https://velog.io`,
    href: `https://velog.io/@sprite`,
    select_path: '#root > div.sc-jObWnj > div.sc-dvQaRk > div > div.sc-eGPXGI > div.sc-eGRUor > div.sc-gsNilK:first > a',
}

module.exports = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${obj.href}`);
    const content = await page.content();
    await page.close();
    await browser.close();

    const $ = cheerio.load(content);

    const href = $(obj.select_path).attr('href');
    const title = $(obj.select_path).text();
    const link = obj.domain + href;

    const return_data = {
        title,
        link
    }

    return return_data;
}