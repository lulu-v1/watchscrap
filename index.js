const crawlerModule = require('./Scripts/CrawlOverModels');
const db = require('./DbManagement/MainDbManagement/Db');
const salesDb = require('./DbManagement/SalesUpdatesDbManagement/SalesAndUpdatesDbs');
const salesDbHandler = require('./DbManagement/SalesUpdatesDbManagement/SalesAndUpdatesHandler');


async function main() {
    console.time('timer')
    await db.openDB();
    await crawlerModule.CrawlOverModels();
    await salesDb.createSalesUpdatesTable();
    await salesDbHandler.CompareAllTables();


    console.timeEnd('timer')
    await process.exit(0)
}

main()
