const puppeteer = require('puppeteer');

async function getInfos() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://chrono24.fr/rolex/index.htm');
    await page.waitForSelector('.js-cookie-accept-all');
    await page.click('.js-cookie-accept-all');

    const currentWatchesOnPage = await page.evaluate(() => {
        return document.querySelectorAll(".article-item-container.wt-search-result.article-image-carousel")
    });

    for (let i = 0; i < currentWatchesOnPage.length; i++) {
        currentWatchesOnPage[i].click();
        await page.waitForSelector(".col-xs-24.col-md-12");
        const currentWatchInfos = await page.evaluate(() => {
            
            return document.querySelector(".col-xs-24.col-md-12").innerText;
        });
    }
}
