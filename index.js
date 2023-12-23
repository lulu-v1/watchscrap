const crawlerModule = require('./scripts/CrawlOverModels'); // Replace with your module path
const {sleep} = require("./scripts/CrawlOverModels"); // Replace with your module path
const initDB = require('./Database/initDB'); // Replace with your module path
async function main() {
    await initDB.ensureTableExists();
    await crawlerModule.CrawlOverModels();
}

main();

