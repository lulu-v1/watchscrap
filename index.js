const crawlerModule = require('./scripts/CrawlOverModels'); // Replace with your module path
const {sleep} = require("./scripts/CrawlOverModels"); // Replace with your module path
const initDB = require('./Database/initDB'); // Replace with your module path
async function main() {
    console.log("Starting the crawler");
    console.time("Crawl time");
    await initDB.ensureTableExists();
    await crawlerModule.CrawlOverModels();
    console.log("Crawl end finished");
    console.timeEnd("Crawl time");
}

main().then(r => console.log("Crawler finished"));


