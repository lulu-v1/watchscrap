const sqlite3 = require('sqlite3').verbose();


function ensureTableExists(){

// Connect to SQLite database (creates a new one if it doesn't exist)
    const db = new sqlite3.Database('./Database/db.sqlite', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the watches_database database.');
    });

// Create the Watches table
    const createTable = () => {
        const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Watches (
        Code_annonce TEXT PRIMARY KEY,
        Marque TEXT,
        Lien TEXT,
        Modele TEXT,
        Numero_de_reference TEXT,
        Mouvement TEXT,
        Boitier TEXT,
        Matiere_du_bracelet TEXT,
        Annee_de_fabrication TEXT,
        Etat TEXT,
        Contenu_livre TEXT,
        Sexe TEXT,
        Emplacement TEXT,
        Prix TEXT,
        Disponibilite TEXT,
        Calibre_Rouages TEXT,
        Reserve_de_marche TEXT,
        Nombre_de_pierres TEXT,
        Diametre TEXT,
        Etanche TEXT,
        Materiau_de_la_lunette TEXT,
        Verre TEXT,
        Cadran TEXT,
        Chiffres_du_cadran TEXT,
        Couleur_du_bracelet TEXT,
        Boucle TEXT,
        Materiau_de_la_boucle TEXT
    );
    `;
        db.run(createTableQuery, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Watches table created or already exists.');
            db.close();
        });
    };
    createTable();
}


module.exports = ensureTableExists;

module.exports = {
    ensureTableExists: ensureTableExists,
};