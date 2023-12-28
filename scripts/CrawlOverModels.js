const puppeteer = require('puppeteer');
const GetWatchPagesURLs = require("./GetWatchPagesURLs");
const getWatchStats = require("./getWatchStats");
const { globalTableName, db} = require("../DbManagement/MainDbManagement/Db");
const dbHandler= require("../DbManagement/MainDbManagement/DbHandler");
const {getNumberOfWatchesInDB} = require("../DbManagement/MainDbManagement/DbHandler");

/**
 * Fetches the total number of Watches link to be scraped.
 */
async function GetAllWatchesLink() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    let pageNumberIndex = 1;
    let WatchesUrlLink = [];
    let totalNumberWatches = await GetTotalNumberOfWatches();
    let WatchesinDB = await dbHandler.getNumberOfWatchesInDB(db.globalTableName);
    while (WatchesUrlLink.length < totalNumberWatches - WatchesinDB) {
        const pageNumber = `&showpage=${pageNumberIndex}`;
        const currentUrl = `https://www.chrono24.fr/search/index.htm?currencyId=EUR&dosearch=true&manufacturerIds=221&maxAgeInDays=0&pageSize=120&redirectToSearchIndex=true&resultview=block&sellerType=PrivateSeller${pageNumber}&sortorder=0&countryIds=FR`;

        await page.goto(currentUrl);

        let UrlsOnPage = await GetWatchPagesURLs(page);
        for (let watchLink of UrlsOnPage) {
            if (!WatchesUrlLink.includes(watchLink) && watchLink !== undefined)
                WatchesUrlLink.push(watchLink);
        }
        console.log(`Page ${pageNumberIndex} done. Total number of links: ${WatchesUrlLink.length}`)

        pageNumberIndex = (pageNumberIndex % 7) + 1; // Reset after 6 pages
    }

    await browser.close();
    return WatchesUrlLink;
}


/**
 * Scrapes the given page URL.
 * @param {string} currentUrl - The URL to scrape.
 * @param {Object} browser - Puppeteer browser instance.
 **/
async function scrapeUrl({ currentUrl, browser }) {
    console.log(`\nScraping current Page: ${currentUrl}\n`);
    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(currentUrl);
    await getWatchStats(page);
    await page.close();
}

/**
 * Fetches the total number of watches (Only the number).
 */
async function GetTotalNumberOfWatches() {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://www.chrono24.fr/search/index.htm?currencyId=EUR&dosearch=true&manufacturerIds=221&maxAgeInDays=0&pageSize=120&redirectToSearchIndex=true&resultview=block&sellerType=PrivateSeller&sortorder=0&countryIds=FR&urlSubpath=%2Fsearch%2Findex.htm&manufacturerIds=221');
    await page.waitForSelector('.total-count');

    const totalWatches = await page.evaluate(() => {
        return document.querySelector('.total-count').innerText;
    });

    await browser.close();
    return totalWatches;
}

/**
 * Main function to crawl over models.
 */
async function CrawlOverModels() {
    const AllWatchesLinks = await GetAllWatchesLink();
    const totalWatches = await GetTotalNumberOfWatches();

    console.log(`Total number of watches: ${totalWatches}`);
    console.log(`Total number of Links to scrape: ${AllWatchesLinks.length}`);

    let watchesInDb = await getNumberOfWatchesInDB(globalTableName);
    console.log(`Watches in DB: ${watchesInDb}`);

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const promises = [];

    // Divide AllWatchesLinks into chunks of 60 links each
    const linkChunks = [];

    const chunkSize = 75; // number of links per chunk

    for (let i = 0; i < AllWatchesLinks.length; i += chunkSize) {
        linkChunks.push(AllWatchesLinks.slice(i, i + chunkSize));
    }

    while (watchesInDb < totalWatches) {
        for (const chunk of linkChunks) {
            promises.length = 0; // Clear promises array for the next chunk

            for (let i = 0; i < chunk.length; i++) {
                promises.push(scrapeUrl({ currentUrl: chunk[i], browser: browser}));
            }

            await Promise.all(promises);
            watchesInDb = await getNumberOfWatchesInDB(globalTableName);
            if (watchesInDb >= totalWatches) { // don't process the next chunk if we have all the watches
                break;
            }
            console.log(`Processed watches. Watches in DB: ${watchesInDb}`);
        }
    }

    console.log("Done");
    await browser.close();
}

module.exports = {
    CrawlOverModels: CrawlOverModels
};
