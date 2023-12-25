const puppeteer = require('puppeteer');
const getWatchPagesURLs = require("./GetWatchPagesURLs");
const getWatchStats = require("./getWatchStats");
const {globalTableName} = require("../DbManagement/MainDbManagement/Db");
const {getNumberOfWatches} = require("../DbManagement/MainDbManagement/DbHandler");

const checkIfUrlDuplicate = [];


async function GetNumberOfPages() {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    let pageNumberIndex = 1;
    while (true) {
        const pageNumber = `&showpage=${pageNumberIndex}`;
        const currentUrl = `https://www.chrono24.fr/search/index.htm?currencyId=EUR&dosearch=true&manufacturerIds=221&maxAgeInDays=0&pageSize=120&redirectToSearchIndex=true&resultview=block&sellerType=PrivateSeller${pageNumber}&sortorder=0&countryIds=FR`;
        await page.goto(currentUrl);
        if (page.url() === "https://www.chrono24.fr/search/index.htm" || page.url() !== currentUrl) {
            await browser.close();
            return pageNumberIndex;
        }
        pageNumberIndex++;
    }
}

async function scrapePage(browser, pageNumberIndex) {
    return new Promise(async (resolve, reject) => {
        try {
            const page = await browser.newPage();

            const pageNumber = `&showpage=${pageNumberIndex}`;
            const currentUrl = `https://www.chrono24.fr/search/index.htm?currencyId=EUR&dosearch=true&manufacturerIds=221&maxAgeInDays=0&pageSize=120&redirectToSearchIndex=true&resultview=block&sellerType=PrivateSeller${pageNumber}&sortorder=0&countryIds=FR`;

            console.log(`\n----------------------------------------------------\nScraping current Page ${pageNumberIndex}: \n ${currentUrl}\n----------------------------------------------------\n`);

            await page.goto(currentUrl);

            if (page.url() === "https://www.chrono24.fr/search/index.htm") {
                console.log("Last page reached");
                await page.close();
                resolve();
                return;
            }

            const watchUrls = await getWatchPagesURLs(page);

            console.log(`[Found ${watchUrls.length} watches]`);

            for (let j = 0; j < watchUrls.length; j++) {
                console.log(`Scraping watch page: ${watchUrls[j]}`);
                await page.goto(watchUrls[j]);
                await getWatchStats(page);
            }

            await page.close();
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

async function GetTotalNumberOfWatches() {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('https://www.chrono24.fr/search/index.htm?currencyId=EUR&dosearch=true&manufacturerIds=221&maxAgeInDays=0&pageSize=120&redirectToSearchIndex=true&resultview=block&sellerType=PrivateSeller&sortorder=0&countryIds=FR&urlSubpath=%2Fsearch%2Findex.htm&manufacturerIds=221');
    await page.waitForSelector('.total-count');
    return await page.evaluate(() => {
        console.log("Total number of watches: " + document.querySelector('.total-count').innerText);
        return document.querySelector('.total-count').innerText;
    });
}


async function CrawlOverModels() {

    const totalPages = await GetNumberOfPages();

    const totalWatches = await GetTotalNumberOfWatches()
    console.log(`Total number of watches: ${totalWatches}`);
    console.log(`Total number of pages to scrap: ${totalPages}`);

    const promises = [];
    let WatchesInDb = await getNumberOfWatches(globalTableName)
    console.log(`Watches in DB: ${WatchesInDb}`);
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    while (WatchesInDb < totalWatches) {
        for (let i = 1; i <= totalPages; i++) {
            promises.push(scrapePage(browser, i));
            WatchesInDb = await getNumberOfWatches(globalTableName);
        }
        try {
            await Promise.all(promises);
            console.log("All pages scraped successfully!");
        } catch (error) {
            console.error("Error scraping pages:", error);
        }
        console.log(`Watches in DB: ${WatchesInDb}`);
    }
    console.log("Done");
    await browser.close();
}

module.exports = {
    CrawlOverModels: CrawlOverModels,
    GetTotalNumberOfWatches: GetTotalNumberOfWatches
};
