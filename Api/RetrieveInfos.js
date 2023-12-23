const {globalTableName} = require("../DbManagement/DbOpener");
const sqlite3 = require("sqlite3");

function RetrieveAllWatches() {
    const db = new sqlite3.Database('Database/db.sqlite');
    const selectQuery = `
        SELECT * FROM ${globalTableName}
    `;

    const Watches = db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        rows.forEach((row) => {
            console.log(row);
        });
    });
    db.close();
    return Watches;
}

module.exports = RetrieveAllWatches;