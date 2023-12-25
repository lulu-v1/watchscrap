const crawlerModule = require('./scripts/CrawlOverModels'); // Replace with your module path
const db = require('./DbManagement/MainDbManagement/Db'); // Replace with your module path
const dbHandler = require('./DbManagement/MainDbManagement/DbHandler'); // Replace with your module path
const stackedDB = require('./DbManagement/StackedDbManagement/StackedDb'); // Replace with your module path
const stackedDbHandler = require('./DbManagement/StackedDbManagement/StackedDbHandler'); // Replace with your module path
const startTime = process.hrtime();
const c = require("./Style/consoleColors.js");


async function main() {
    await db.openDB();
    if (!await dbHandler.dbIsFull(crawlerModule.GetTotalNumberOfWatches)) {
        await crawlerModule.CrawlOverModels();
    }
    await stackedDB.openStackedDB(db.globalTableName);
    await stackedDbHandler.stackWatches(db.globalTableName);
    console.log('Execution time:' + c.green + ' %ds %dms' + c.reset, ...process.hrtime(startTime));
    await process.exit(0)
}

main()
