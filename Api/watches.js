const {globalTableName} = require("../DbManagement/MainDbManagement/Db");
const sqlite3 = require("sqlite3");
const db = require("../DbManagement/MainDbManagement/Db");
const dbhandler = require("../DbManagement/MainDbManagement/DbHandler");
function RetrieveAllCurrentWatches() {
    return new Promise((resolve, reject) => {
        const selectQuery = `
            SELECT *
            FROM Rolex_2023_12_26_0
        `;
        db.db.all(selectQuery, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const jsonData = JSON.stringify(rows);
            db.db.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('Database connection closed.');
            });
            resolve(jsonData);
        });
    });
}

async function RetrieveSpecificCurrentWatch(codeAnnonce, tableName = null) {
    if (tableName === null) {
        tableName = await dbhandler.getLastTable();
    }
    return await dbhandler.getWatch(tableName, codeAnnonce);
}
module.exports = {RetrieveAllCurrentWatches, RetrieveSpecificCurrentWatch};