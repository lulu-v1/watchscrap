const puppeteer = require('puppeteer');
function sleep(number) {
    return new Promise(resolve => setTimeout(resolve, number));
}
async function retrieveWatchInfos(page) {
    await page.waitForSelector("#wt-watches");
    console.log("Selector found");
    const currentWatchesOnPage = await page.evaluate(() => {
        const watchesContainer = document.querySelector("#wt-watches");
        console.log(watchesContainer.querySelectorAll("div"));
        return watchesContainer.getElementsByTagName("div")
    });
    await sleep(10000);
    await console.log( Array.from(currentWatchesOnPage).length);
    await sleep(10000);
    // for (let i = 0; i < Array.from(currentWatchesOnPage).length; i++) {
    //     currentWatchesOnPage[i].click();
    //     await page.waitForSelector(".col-xs-24.col-md-12");
    //     const currentWatchInfos = await page.evaluate(() => {
    //
    //         return document.querySelector(".col-xs-24.col-md-12").innerText;
    //     });
    // }
}

module.exports = retrieveWatchInfos;