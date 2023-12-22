const puppeteer = require('puppeteer');
const watchModelIDs = require('../data/watchModelIDs.json');
const retrieveWatchInfos = require('./RetrieveWatchInfos');

function sleep(number) {
    return new Promise(resolve => setTimeout(resolve, number));
}

async function CrawlOverModels() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://chrono24.fr/rolex/index.htm');
    await page.waitForSelector('.js-cookie-accept-all');
    await page.click('.js-cookie-accept-all');

    try {
        const i = 1;
        // for (let i = 1; i < watchModelIDs.length; i++) {
        const watchModelID = watchModelIDs[i].value;
        console.log(`Scraping watch model ID: ${watchModelID}`);
        await page.goto(`https://www.chrono24.fr/search/index.htm?countryIds=FR&currencyId=EUR&dosearch=true&manufacturerIds=221&maxAgeInDays=0&models=${watchModelID}&pageSize=60&redirectToSearchIndex=true&resultview=block&sortorder=0`);
        await retrieveWatchInfos(page)
        await sleep(1000);
        // }
    } catch (error) {
        console.error('Error occurred during scraping:', error);
    } finally {
        await browser.close();
    }
}

module.exports = CrawlOverModels;

module.exports = {
    CrawlOverModels: CrawlOverModels,
    sleep: sleep
};