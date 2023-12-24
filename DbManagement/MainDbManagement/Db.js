const sqlite3 = require('sqlite3').verbose();

const currentDate = new Date();
let globalTableName = `Rolex_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}_${currentDate.getDate()}_${currentDate.getHours()}_${currentDate.getMinutes()}`;

const db = new sqlite3.Database('./Database/raw/db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
});

const openDB = (tableName = globalTableName) => {
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${tableName}
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
                Materiau_de_la_boucle  TEXT
            );
        `;
        db.run(createTableQuery, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
};


module.exports = {
    openDB: openDB,
    globalTableName: globalTableName,
    db: db,
};