const crawlerModule = require('./Scripts/CrawlOverModels'); // Replace with your module path
const db = require('./DbManagement/MainDbManagement/Db'); // Replace with your module path
const stackedDB = require('./DbManagement/StackedDbManagement/StackedDb'); // Replace with your module path
const stackedDbHandler = require('./DbManagement/StackedDbManagement/StackedDbHandler'); // Replace with your module path


async function main() {
    console.time('timer')
    await db.openDB();
    await crawlerModule.CrawlOverModels();
    await stackedDB.openStackedDB(db.globalTableName);
    await stackedDbHandler.stackWatches(db.globalTableName);
    console.timeEnd('timer')
    await process.exit(0)
}

main()
