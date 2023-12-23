const {globalTableName} = require("../DbManagement/DbOpener");
const sqlite3 = require("sqlite3");


function RetrieveAllWatches() {
    const db = new sqlite3.Database('../Database/db.sqlite');

    const Watches = db.all(`SELECT Name, Category FROM ${globalTableName}`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        return rows;
    });
    return db;
}

module.exports = RetrieveAllWatches;