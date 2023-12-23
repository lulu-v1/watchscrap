const crawlerModule = require('./scripts/CrawlOverModels'); // Replace with your module path
const {sleep} = require("./scripts/CrawlOverModels"); // Replace with your module path
const initDB = require('./scripts/initDB'); // Replace with your module path
async function main() {
    console.log("Starting the crawler");
    await initDB.ensureTableExists();
    await crawlerModule.CrawlOverModels();
    console.log("Crawl end finished");
}

main().then(r => console.log("Crawler finished"));


