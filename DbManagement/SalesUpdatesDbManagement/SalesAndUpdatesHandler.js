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
    return tableName.split('_').slice(1) + ':00';
}

function getPostDate(codeAnnonce) {
    const query = "SELECT name FROM sqlite_master WHERE type='table';";
    db.db.all(query, [], (err, tables) => {
        if (err) {
            console.log(c.red + '[-]' + c.reset + ' Error fetching watches');
            console.error(err.message);
        }
        for (let table of tables) {
            console.log("checking table " + table.name)
            const selectQuery = `SELECT *
                                 FROM ${table.name}
                                 WHERE Code_annonce = ?`;
            db.db.get(selectQuery, [codeAnnonce], (err, row) => {
                if (err) {
                    console.log(c.red + '[-]' + c.reset + ' Error fetching watch date');
                    console.error(err.message);
                }
                console.log(c.green + 'Nice!' + c.reset + ' Watch first found at ' + formatDate(table.name));
                return formatDate(table.name);
            });
        }
    });
    return 'Not found';

}


function insertSale(values, saleDate = formatDate(db.globalTableName)) {
    const postDate = getPostDate(values[0]);
    console.log(postDate)
    const insertQuery = `
        INSERT INTO Global_sales (Code_annonce,
                                  Lien,
                                  Modele,
                                  Prix,
                                  Etat,
                                  Annee_de_fabrication,
                                  Materiau_de_la_lunette,
                                  Numero_de_reference,
                                  Mouvement,
                                  Boitier,
                                  Matiere_du_bracelet,
                                  Contenu_livre,
                                  Sexe,
                                  Emplacement,
                                  Disponibilite,
                                  Calibre_Rouages,
                                  Reserve_de_marche,
                                  Nombre_de_pierres,
                                  Diametre,
                                  Etanche,
                                  Verre,
                                  Marque,
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

    salesDb.run(insertQuery, values, (err) => {
        if (err) {
            console.log(c.red + '[-]' + c.reset + ' Error inserting sale');
            console.error(err.message);
            return;
        }
        console.log(green + '[+]' + c.reset + ' Sale inserted successfully' + c.reset);
    });

}

const CompareAllTables = async () => {
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
                console.log(c.green + ' Comparing '
                    + c.reset + table.name + ' with ' + nextTable.name
                )
                await calculateSales(table.name, nextTable.name)
            }
            resolve();
        });
    });
}

async function CompareLastTables() {

}

const calculateSales = async (startingDateTable, endingDateTable) => {
    let count = 0;
    const selectQuery = `
        SELECT *
        FROM ${startingDateTable}
        WHERE Code_Annonce NOT IN (SELECT Code_Annonce FROM ${endingDateTable});
    `;
    db.db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.log(c.red + '[-]' + c.reset + ' Error fetching sales\n');
        }
        for (const row of rows) {
            count++;
            insertSale(Object.values(row), formatDate(endingDateTable));
        }
    });
    console.log(c.green + count + c.reset + ' Sale found successfully');
}


// async function calculateUpdates(startingDate, endingDate) {
//     await salesUpdatesDb.updatesDb.openDB(startingDate, endingDate);
//     const startingDateTable = `Rolex_${startingDate}`;
//     const endingDateTable = `Rolex_${endingDate}`;
//     const tableName = `Updates_${startingDate}_${endingDate}`;
//     return new Promise((resolve, reject) => {
//         const selectQuery = `
//             SELECT *
//             FROM ${startingDateTable} t1
//             WHERE NOT EXISTS (SELECT 1
//                               FROM ${endingDateTable} t2
//                               WHERE t1.Code_Annonce = t2.Code_Annonce);
//         `;
//
//         db.db.all(selectQuery, [], (err, rows) => {
//             if (err) {
//                 console.log(c.red + '[-]' + c.reset + ' Error fetching watches');
//                 console.error(err.message);
//                 reject(err);
//             }
//
//             for (let row of rows) {
//                 resolve(salesUpdatesDb.updatesDb.InsertIntoDb(Object.values(row), tableName));
//                 console.log(c.green + '[+]' + c.reset + ' Fetched all sold watches successfully');
//             }
//         });
//
//     });
// }

module.exports = {CompareAllTables};