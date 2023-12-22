const puppeteer = require('puppeteer');
function sleep(number) {
    return new Promise(resolve => setTimeout(resolve, number));
}
async function retrieveWatchInfos(page) {
    await page.waitForSelector('.js-cookie-accept-all');
    await page.click('.js-cookie-accept-all');
    await page.waitForSelector("#wt-watches");
    console.log("Selector found");
    const linksOfCurrentWatchesOnPage = await page.$eval('div#wt-watches', (element) => {
        // Inside the $eval, use evaluate to access the DOM element and return the result
        return Array.from(element.querySelectorAll('a')).map(a => a.href);
    });
    await console.log(linksOfCurrentWatchesOnPage);
}

module.exports = retrieveWatchInfos;