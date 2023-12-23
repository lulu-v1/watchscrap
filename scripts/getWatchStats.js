const {globalTableName} = require("./initDB");
const sqlite3 = require('sqlite3').verbose();

async function getWatchStats(page) {
    try {
        await page.waitForSelector(".js-details-and-security-tabs", {timeout: 1000});
    } catch (error) {
        console.error('Error waiting for selector:', error);
        return;
    }

    const watch = await page.$eval('.js-details-and-security-tabs', (element) => {
        const watchStats = Array.from(element.querySelectorAll('tr')).map((row) => row.innerText);

        const watchData = {};

        watchStats.forEach((item) => {
            if (item.includes('\t')) {
                const [key, value] = item.split('\t');
                const formattedKey = key.trim();
                watchData[formattedKey] = value.trim();
            }
        });

        return watchData;
    });

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./Database/db.sqlite', (err) => {
            if (err) {
                console.error('Error connecting to database:', err.message);
                reject(err); // Reject the promise if there's an error connecting to the database
                return;
            }
            console.log('Connected to the watches_database database.');

            const insertQuery = `
                INSERT OR REPLACE INTO ${globalTableName} (
                Code_annonce, Marque, Lien, Modele, Numero_de_reference, Mouvement, Boitier, 
                Matiere_du_bracelet, Annee_de_fabrication, Etat, Contenu_livre, Sexe, 
                Emplacement, Prix, Disponibilite, Calibre_Rouages, Reserve_de_marche, 
                Nombre_de_pierres, Diametre, Etanche, Materiau_de_la_lunette, Verre, 
                Cadran, Chiffres_du_cadran, Couleur_du_bracelet, Boucle, Materiau_de_la_boucle
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

            db.run(insertQuery, [
                watch["Code annonce"], watch["Marque"], page.url(), watch["Modèle"], watch["Numéro de référence"],
                watch["Mouvement"], watch["Boîtier"], watch["Matière du bracelet"],
                watch["Année de fabrication"], watch["État"], watch["Contenu livré"], watch["Sexe"],
                watch["Emplacement"], watch["Prix"], watch["Disponibilité"], watch["Calibre/Rouages"],
                watch["Réserve de marche"], watch["Nombre de pierres"], watch["Diamètre"],
                watch["Étanche"], watch["Matériau de la lunette"], watch["Verre"], watch["Cadran"],
                watch["Chiffres du cadran"], watch["Couleur du bracelet"], watch["Boucle"],
                watch["Matériau de la boucle"]
            ], (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err); // Reject the promise if there's an error inserting the data
                }
                console.log('Watch data inserted successfully.');
                db.close();
                resolve(); // Resolve the promise if the data was inserted successfully
            });

        });
    });
}

module.exports = getWatchStats;
