const puppeteer = require('puppeteer');
const watchModelIDs = require('../data/watchModelIDs.json');
const getWatchPagesURLs = require("./GetWatchPagesURLs");
const getWatchStats = require("./getWatchStats");
const fs = require("fs-extra");

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
        // for (let i = 1; i < watchModelIDs.length; i++) {
        let pageNumberIndex = 2
        let lastPageReached = false
        while (!lastPageReached) { //as long as we don't get a 404 error
            const pageNumber = `&showpage=${pageNumberIndex}`
            const currentUrl = `https://www.chrono24.fr/search/index.htm?countryIds=FR
                                           &currencyId=EUR&dosearch=true
                                           &manufacturerIds=221
                                           &maxAgeInDays=0
                                           &models=2729
                                           &pageSize=30
                                           &redirectToSearchIndex=true
                                           &resultview=block
                                           ${pageNumber}
                                           &sortorder=0`
            //detect if the url get redirected using the requests module

            console.log(`\n----------------------------------------------------\nScraping current Page: ${currentUrl}\n----------------------------------------------------\n`)


            // const watchModelID = watchModelIDs[i].value;
            // console.log(`Scraping watch model ID: ${watchModelID}`);


            await page.goto(currentUrl); //go to the current page
            
            if (page.url().length < 41) {
                lastPageReached = true //if the url doesn't contain /rolex/ it means that we reached the last page
                console.log("Last page reached")
                return
            }

            pageNumberIndex++ //increment the page number

            //------------------------ Loop through all the watches pages ------------------------//


            const watchUrls = await getWatchPagesURLs(page) // Get all the watch pages URLs

            for (let j = 0;!lastPageReached && j < watchUrls.length; j++) { // loop through all the watch pages
                console.log(`Scraping watch page: ${watchUrls[j]}`);
                await page.goto(watchUrls[j]);
                await getWatchStats(page);
            }
        }
        // }

    } catch (error) {
        console.error('Error occurred during scraping:', error);
    } finally {
        console.log("Closing the browser FINALLY DONE");
        await browser.close();
    }
}

module.exports = CrawlOverModels;

module.exports = {
    CrawlOverModels: CrawlOverModels,
    sleep: sleep
};