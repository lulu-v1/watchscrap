const stackedDB = require("./StackedDb");
const c = require("../../Style/consoleColors.js");

const db = require('../MainDbManagement/Db');

function insertIntoStackedDB(TableName, values) {
    const StackedTableName = `Stacked_${TableName}`
    try {
        const insertQuery = `
            INSERT
            OR REPLACE INTO
            ${StackedTableName}
            (
            Stack_id,
            Amount,
            Average_price,
            Lowest_price,
            Highest_price,
            Last_sale,
            Last_sale_date
            )
            VALUES
            (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
            );
        `;
        stackedDB.stackedDB.run(insertQuery, values, function (err) {
            if (err) {
                console.log(c.red + `Error inserting into Stacked DB:` + c.reset + ` ${err.message}\n`);
            }
        });
    } catch (e) {
        console.error('Catch block error:', e);
    }
}


const updateStackedDB = (values) => {
    const updateQuery = `
        UPDATE ${stackedDB.globalStackedTableName}
        SET Amount         = ?,
            Average_price  = ?,
            Lowest_price   = ?,
            Highest_price  = ?,
            Last_sale      = ?,
            Last_sale_date = ?
        WHERE Stack_id = ?;
    `;
    stackedDB.stackedDB.run(updateQuery, values, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Row updated successfully');
        }
    });
};

const deleteFromStackedDB = (stackId) => {
    const deleteQuery = `
        DELETE
        FROM ${db.globalTableName}
        WHERE Stack_id = ?;
    `;
    stackedDB.stackedDB.run(deleteQuery, [stackId], (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Row deleted successfully');
        }
    });
};


const stackWatches = async (tableName) => {
    try {
        // Query to fetch watches from main db grouped by model and release date
        const query = `
            SELECT Modele, Annee_de_fabrication, COUNT(*) as TotalWatches
            FROM ${db.globalTableName}
            GROUP BY Modele, Annee_de_fabrication
            HAVING COUNT(*) > 1;
            // Adjust condition as needed
        `;

        db.db.all(query, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            // Iterate through fetched records to stack watches
            rows.forEach(async (row) => {
                const {Modele, Annee_de_fabrication, TotalWatches} = row;
                console.log(c.green + "  {++}  " + c.reset + `Stacking watches for Model: ${Modele}, Release Date: ${Annee_de_fabrication}, Total: ${TotalWatches}`);
                return insertIntoStackedDB(tableName, [`${Modele}_${Annee_de_fabrication}`, TotalWatches, 0, 0, 0, 0, ''])

            });
        });
    } catch (error) {
        console.log(c.red + "Error while stacking watches" + c.reset)
    }
};


module.exports = {
    updateStackedDB: updateStackedDB,
    deleteFromStackedDB: deleteFromStackedDB,
    stackWatches: stackWatches,
}