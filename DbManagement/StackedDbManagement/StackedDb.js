const sqlite3 = require('sqlite3').verbose();

const globalStackedTableName = ``

const stackedDB = new sqlite3.Database('./Database/stacked/stacked_db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }else{
        console.log("Light DB opened successfully")
    }
});

const openStackedDB = (tableName) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Stacked_${tableName}
        (
            Stack_id       TEXT PRIMARY KEY,
            Amount         INT,
            Average_price  INT,
            Lowest_price   INT,
            Highest_price  INT
        );
    `;
    stackedDB.run(createTableQuery, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
};


module.exports = {
    openStackedDB: openStackedDB,
    stackedDB: stackedDB,
    globalStackedTableName: globalStackedTableName,
};
