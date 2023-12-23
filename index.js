const crawlerModule = require('./scripts/CrawlOverModels'); // Replace with your module path
const dbOpener = require('./DbManagement/DbOpener'); // Replace with your module path
async function main() {
    await dbOpener.openDB();
    console.log("Starting the crawler");
    await crawlerModule.CrawlOverModels();
}

main().then(r => console.log("Crawling Done !")).catch(e => console.log(e));

