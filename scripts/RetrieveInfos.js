const puppeteer = require('puppeteer');
const watchModelIDs = require('../data/watchModelIDs.json');

function sleep(number) {
    return new Promise(resolve => setTimeout(resolve, number));
}

async function RetrieveInfos() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        for (let i = 0; i < watchModelIDs.length; i++) {
            const watchModelID = watchModelIDs[i];
            console.log(`Scraping watch model ID: ${watchModelID}`);
            await page.goto(`https://www.chrono24.fr/search/index.htm?countryIds=FR&currencyId=EUR&dosearch=true&manufacturerIds=221&maxAgeInDays=0&models=${watchModelID}&pageSize=60&redirectToSearchIndex=true&resultview=block&sortorder=0`);
            await sleep(1000);
        }
    } catch (error) {
        console.error('Error occurred during scraping:', error);
    } finally {
        await browser.close();
    }
}

module.exports = {
    RetrieveInfos: RetrieveInfos,
    sleep: sleep
};