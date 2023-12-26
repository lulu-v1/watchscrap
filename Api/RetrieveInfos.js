const {globalTableName} = require("../DbManagement/MainDbManagement/Db");
const sqlite3 = require("sqlite3");

function RetrieveAllWatches() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + '../../Database/raw/db.sqlite');
        const selectQuery = `
            SELECT * FROM Rolex_2023_12_26_2
            EXCEPT 
            SELECT * FROM Rolex_2023_12_26_0
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