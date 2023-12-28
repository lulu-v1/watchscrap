const db = require('../MainDbManagement/Db');
const {green} = require("../../Style/consoleColors");
const c = require("../../Style/consoleColors");
const salesUpdatesDb = require("./SalesAndUpdatesDbs");
const {updatesDb, salesDb} = require("./SalesAndUpdatesDbs");

// getPostDate should loop over tables of the main db
// and return the date of the post
// using the name of the table iterated in the current loop iteration
// the name of the table is Rolex_${the date of the crawl(YYYY_MM_DD)}_${the hour of the crawl(HH)}
// assuming there is no 'Date-de_poste' field in the main db


// turns 'Rolex_2021_1_1_1' into '2021_1_1_1:00'
function formatDate(tableName) {
    return (tableName.split('_').slice(1) + ':00');
}

async function getPostDate(codeAnnonce) {
    const query = "SELECT name FROM sqlite_master WHERE type='table';";
    try {
        const tables = await new Promise((resolve, reject) => {
            db.db.all(query, [], (err, tables) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(tables);
                }
            });
        });

        for (let table of tables) {
            const selectQuery = `SELECT *
                                 FROM ${table.name}
                                 WHERE Code_annonce = ?`;
            const row = await new Promise((resolve, reject) => {
                db.db.get(selectQuery, [codeAnnonce], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });

            if (row) {
                return formatDate(table.name);
            }
        }
    } catch (err) {
        console.error(err.message);
        console.log(c.red + '[-]' + c.reset + ' Error fetching data');
    }

    return 'Not found';
}


async function insertSale(values, saleDate = formatDate(db.globalTableName)) {
    let postDate = await getPostDate(values[0]);
    const insertQuery = `
        INSERT INTO Global_sales (Code_annonce,
                                  Marque,
                                  Lien,
                                  Modele,
                                  Numero_de_reference,
                                  Mouvement,
                                  Boitier,
                                  Matiere_du_bracelet,
                                  Annee_de_fabrication,
                                  Etat,
                                  Contenu_livre,
                                  Sexe,
                                  Emplacement,
                                  Prix,
                                  Disponibilite,
                                  Calibre_Rouages,
                                  Reserve_de_marche,
                                  Nombre_de_pierres,
                                  Diametre,
                                  Etanche,
                                  Materiau_de_la_lunette,
                                  Verre,
                                  Cadran,
                                  Chiffres_du_cadran,
                                  Couleur_du_bracelet,
                                  Boucle,
                                  Materiau_de_la_boucle,
                                  Date_de_poste,
                                  Date_de_vente)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    values.push(postDate);
    values.push(saleDate);

    return new Promise((resolve, reject) => {
        salesDb.run(insertQuery, values, (err) => {
            if (err) {
                console.log(c.red + '[-]' + c.reset + ' Error inserting sale');
                console.error(err.message);
            }
            console.log(green + '[+]' + c.reset + ' Sale inserted successfully' + c.reset);
            resolve();
        });
    });

}
async function insertUpdate(values, updateDate = formatDate(db.globalTableName),initialPrice) {
    let postDate = await getPostDate(values[0]);
    const insertQuery = `
        INSERT OR REPLACE INTO Global_updates (Code_annonce,
                                    Marque,
                                    Lien,
                                    Modele,
                                    Numero_de_reference,
                                    Mouvement,
                                    Boitier,
                                    Matiere_du_bracelet,
                                    Annee_de_fabrication,
                                    Etat,
                                    Contenu_livre,
                                    Sexe,
                                    Emplacement,
                                    Prix,
                                    Disponibilite,
                                    Calibre_Rouages,
                                    Reserve_de_marche,
                                    Nombre_de_pierres,
                                    Diametre,
                                    Etanche,
                                    Materiau_de_la_lunette,
                                    Verre,
                                    Cadran,
                                    Chiffres_du_cadran,
                                    Couleur_du_bracelet,
                                    Boucle,
                                    Materiau_de_la_boucle,
                                    Date_de_poste,
                                    Date_de_modif,
                                    Prix_initial
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    values.push(postDate);
    values.push(updateDate);
    values.push(initialPrice);

    return new Promise((resolve, reject) => {
        updatesDb.run(insertQuery, values, (err) => {
            if (err) {
                console.log(c.red + '[-]' + c.reset + ' Error inserting update');
                console.error(err.message);
            }
            console.log(green + '[+]' + c.reset + ' update inserted successfully' + c.reset);
            resolve();
        });
    });

}

async function CompareAllTables() {
    return new Promise((resolve, reject) => {
        const query = "SELECT name FROM sqlite_master WHERE type='table';";
        db.db.all(query, [], async (err, tables) => {
            if (err) {
                console.log(c.red + '[-]' + c.reset + ' Error fetching watches');
                console.error(err.message);
                console.error(err);
            }
            for (const table of tables) {
                const nextTable = tables[tables.indexOf(table) + 1];
                if (nextTable === undefined) {
                    return;
                }

                await calculateSales(table.name, nextTable.name)
                await calculateUpdates(table.name, nextTable.name)
            }
            resolve();
        });
    });
}


async function calculateSales(startingDateTable, endingDateTable) {
    const selectQuery = `
        SELECT *
        FROM ${startingDateTable}
        WHERE Code_Annonce NOT IN (SELECT Code_Annonce FROM ${endingDateTable});
    `;

    const rows = await new Promise((resolve, reject) => {
        db.db.all(selectQuery, [], (err, rows) => {
            if (err) {
                console.log(c.red + '[-]' + c.reset + ' Error fetching sales\n');
                reject(err);
            }
            resolve(rows);
        });
    });

    let count = 0;
    for (let row of rows) {
        await insertSale(Object.values(row),formatDate(endingDateTable));
        count++;
    }
    console.log(c.green + count + c.reset + ' Sale successfully found and inserted while' + c.green + ' comparing ' + c.reset + startingDateTable + ' with ' + endingDateTable);

}
async function calculateUpdates(startingDateTable, endingDateTable) {
    const selectQuery = `
        SELECT t1.*
        FROM ${startingDateTable} t1
        WHERE t1.Code_annonce IN (
            SELECT Code_annonce
            FROM ${endingDateTable}
        )
        EXCEPT SELECT * from ${endingDateTable};
    `;
    const rows = await new Promise((resolve, reject) => {
        db.db.all(selectQuery, [], (err, rows) => {
            if (err) {
                console.log(c.red + '[-]' + c.reset + ' Error fetching updates\n');
                reject(err);
            }
            resolve(rows);
        });
    });

    let count = 0;
    for (let row of rows) {
        let Updatedwatch = await getWatch(endingDateTable,row.Code_annonce);
        await insertUpdate(Object.values(row),formatDate(endingDateTable),Updatedwatch.Prix);
        count++;
    }
    console.log(c.green + count + c.reset + ' Update successfully found and inserted while' + c.green + ' comparing ' + c.reset + startingDateTable + ' with ' + endingDateTable);
}

async function getWatch(tableName, codeAnnonce) {
    const query = `
        SELECT *
        FROM ${tableName}
        WHERE Code_annonce = ?;
    `;

    return new Promise((resolve, reject) => {
        db.db.get(query, [codeAnnonce], (err, row) => {
            if (err) {
                console.log(c.red + '[-]' + c.reset + ' Error fetching watch');
                reject(err);
            }
            resolve(row);
        });
    });
}

module.exports = {CompareAllTables, insertUpdate};