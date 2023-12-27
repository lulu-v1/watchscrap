const {globalTableName} = require("../DbManagement/MainDbManagement/Db");
const sqlite3 = require("sqlite3");

function RetrieveAllWatches() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + '../../Database/raw/db.sqlite');
        const selectQuery = `
            SELECT *
            FROM Rolex_2023_12_26_0
            EXCEPT
            SELECT *
            FROM Rolex_2023_12_26_2
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

function RetrieveSpecificWatch(id) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + '../../Database/raw/db.sqlite');
        const selectQuery = `
            SELECT *
            FROM Rolex_2023_12_26_0
            WHERE Code_annonce = ?
        `;
        db.all(selectQuery, [id], (err, rows) => {
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

function RetrieveAllFromSpecificDB(tableName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + '../../Database/raw/db.sqlite');
        const selectQuery = `
            SELECT *
            FROM ${tableName}
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
function RetrieveFromSpecificDB(id, tableName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + '../../Database/raw/db.sqlite');
        const selectQuery = `
            SELECT *
            FROM ${tableName}
            WHERE Code_annonce = ?
        `;
        db.all(selectQuery, [id], (err, rows) => {
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

module.exports = {RetrieveAllWatches, RetrieveSpecificWatch, RetrieveAllFromSpecificDB, RetrieveFromSpecificDB};