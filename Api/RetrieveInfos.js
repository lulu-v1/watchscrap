const {globalTableName} = require("../DbManagement/MainDbManagement/Db");
const sqlite3 = require("sqlite3");
const dbHandler = require("../DbManagement/MainDbManagement/DbHandler");
const {getAllWatches} = require("../DbManagement/MainDbManagement/DbHandler");

async function RetrieveAllWatches() {
    return new Promise(async (resolve, reject) => {
        const db = new sqlite3.Database(__dirname + '../../Database/raw/db.sqlite');
        const lastTable = await dbHandler.getLastTable();
        const selectQuery = `
            SELECT *
            FROM ${lastTable}
        `;
        db.all(selectQuery, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const jsonData = JSON.stringify(rows);
            db.close((err) => {
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


module.exports = RetrieveAllWatches;