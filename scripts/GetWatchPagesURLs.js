const puppeteer = require('puppeteer');
function sleep(number) {
    return new Promise(resolve => setTimeout(resolve, number));
}
async function getWatchPagesURLs(page) {
    await page.waitForSelector('.js-cookie-accept-all');
    await page.click('.js-cookie-accept-all');
    await page.waitForSelector("#wt-watches");
    return await page.$eval('div#wt-watches', (element) => {
        return Array.from(element.querySelectorAll('a')).map(a => a.href);
    });
}

module.exports = getWatchPagesURLs;