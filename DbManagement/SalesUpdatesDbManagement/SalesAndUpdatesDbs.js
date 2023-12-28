const sqlite3 = require('sqlite3').verbose();

const salesDb = new sqlite3.Database('./Database/sales/sales_db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sales database.');
});
const updatesDb = new sqlite3.Database('./Database/updates/updates_db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the updates database.');
});

//  'Global_sales' Table will store all watches that were sold overall (from first crawl to last crawl)
//  It has to store all watch data
//  It also has to store the date the watch was posted and the date it was sold

//  'Global_updates' Table will store all watches that were updated overall (from first crawl to last crawl)
//  It has to store all watch data
//  It also has to store price the watch was posted at and the price it was updated to
//  And the date the watch was posted and the date it was updated


function createSalesUpdatesTable() {
    const createSalesTableQuery = `
        CREATE TABLE IF NOT EXISTS Global_sales
        (
            Code_annonce           TEXT PRIMARY KEY,
            Marque                 TEXT,
            Lien                   TEXT,
            Modele                 TEXT,
            Numero_de_reference    TEXT,
            Mouvement              TEXT,
            Boitier                TEXT,
            Matiere_du_bracelet    TEXT,
            Annee_de_fabrication   TEXT,
            Etat                   TEXT,
            Contenu_livre          TEXT,
            Sexe                   TEXT,
            Emplacement            TEXT,
            Prix                   INT,
            Disponibilite          TEXT,
            Calibre_Rouages        TEXT,
            Reserve_de_marche      TEXT,
            Nombre_de_pierres      TEXT,
            Diametre               TEXT,
            Etanche                TEXT,
            Materiau_de_la_lunette TEXT,
            Verre                  TEXT,
            Cadran                 TEXT,
            Chiffres_du_cadran     TEXT,
            Couleur_du_bracelet    TEXT,
            Boucle                 TEXT,
            Materiau_de_la_boucle  TEXT,
            Date_de_poste TEXT,
            Date_de_vente TEXT
        );
    `;
    const createUpdateTableQuery = `
        CREATE TABLE IF NOT EXISTS Global_updates
        (
            Code_annonce           TEXT PRIMARY KEY,
            Marque                 TEXT,
            Lien                   TEXT,
            Modele                 TEXT,
            Numero_de_reference    TEXT,
            Mouvement              TEXT,
            Boitier                TEXT,
            Matiere_du_bracelet    TEXT,
            Annee_de_fabrication   TEXT,
            Etat                   TEXT,
            Contenu_livre          TEXT,
            Sexe                   TEXT,
            Emplacement            TEXT,
            Prix                   INT,
            Disponibilite          TEXT,
            Calibre_Rouages        TEXT,
            Reserve_de_marche      TEXT,
            Nombre_de_pierres      TEXT,
            Diametre               TEXT,
            Etanche                TEXT,
            Materiau_de_la_lunette TEXT,
            Verre                  TEXT,
            Cadran                 TEXT,
            Chiffres_du_cadran     TEXT,
            Couleur_du_bracelet    TEXT,
            Boucle                 TEXT,
            Materiau_de_la_boucle  TEXT,
            Date_de_poste TEXT,
            Date_de_modif TEXT,
            Prix_initial INT
        );
    `;
    return new Promise((resolve, reject) => {
        salesDb.run(createSalesTableQuery, (err) => {
            if (err) {
                console.error(err.message);
            }
            updatesDb.run(createUpdateTableQuery, (err) => {
                if (err) {
                    console.error(err.message);
                }
                resolve();
            });
        });
    });
}


module.exports = {
    createSalesUpdatesTable: createSalesUpdatesTable,
    salesDb: salesDb,
    updatesDb: updatesDb,
};