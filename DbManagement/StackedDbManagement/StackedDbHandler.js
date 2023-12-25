const stackedDB = require("./StackedDb");
const c = require("../../Style/consoleColors.js");

const db = require('../MainDbManagement/Db');

function insertIntoStackedDB(TableName, values) {
    return new Promise((resolve, reject) => {
        const StackedTableName = `Stacked_${TableName}`
        const insertQuery = `
            INSERT
            OR REPLACE INTO
            ${StackedTableName}
            (
            Stack_id,
            Amount,
            Average_price,
            Highest_price,
            Lowest_price
            )
            VALUES
            (
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
                reject(err);
            }
            resolve();
        });
    });
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


const stackWatches = async (tableName) => {
    return new Promise((resolve, reject) => {
        console.log(c.BGcyan + "  {++}  " + `Stacking watches for table: ${tableName}` + c.reset + "\n");
        const query = `
            SELECT Modele,
                   Annee_de_fabrication,
                   COUNT(*)         as TotalWatches,
                   ROUND(AVG(Prix)) as AveragePrice,
                   MAX(Prix)        as HighestPrice,
                   MIN(Prix)        as LowestPrice
            FROM ${tableName}
            GROUP BY Modele, Annee_de_fabrication
            HAVING COUNT(*) >= 1
        `;

        db.db.all(query, [], async (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
                return;
            }
            try {
                for (const row of rows) {
                    const {
                        Modele,
                        Annee_de_fabrication,
                        TotalWatches,
                        AveragePrice,
                        HighestPrice,
                        LowestPrice,
                    } = row;
                    console.log(c.green + "  {++}  " + c.reset + `Stacking watches for Model: ${Modele}, Release Date: ${Annee_de_fabrication}, Total: ${TotalWatches}`);
                    await insertIntoStackedDB(tableName, [Modele + "_" + Annee_de_fabrication, TotalWatches, AveragePrice, HighestPrice, LowestPrice]);
                }
                resolve();
            } catch (error) {
                console.log(c.red + "Error while stacking watches" + c.reset);
                reject(error);
            }
        });
    });
};


module.exports = {
    updateStackedDB: updateStackedDB,
    stackWatches: stackWatches,
}