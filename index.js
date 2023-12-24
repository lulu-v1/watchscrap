const crawlerModule = require('./scripts/CrawlOverModels'); // Replace with your module path
const db = require('./DbManagement/MainDbManagement/Db'); // Replace with your module path
const stackedDB = require('./DbManagement/StackedDbManagement/StackedDb'); // Replace with your module path
const stackedDbHandler = require('./DbManagement/StackedDbManagement/StackedDbHandler'); // Replace with your module path
async function main() {
    await db.openDB(db.globalTableName);
    console.log("Starting the crawler");


    await crawlerModule.CrawlOverModels();
    await stackedDB.openStackedDB(db.globalTableName);

    await stackedDbHandler.stackWatches(db.globalTableName);

}

main().then(() => {
    console.log("Done");
}).catch((err) => {
    console.log(err);
});


