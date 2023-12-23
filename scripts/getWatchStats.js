const {globalTableName} = require("./initDB");
const sqlite3 = require('sqlite3').verbose();
const c = require("../consoleColors.js");
async function getWatchStats(page) {
    try {
        await page.waitForSelector(".js-details-and-security-tabs", {timeout: 1000});
    } catch (error) {
        console.error('Wrong Page URL');
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

            function processWatch(watch) {

                watch["Prix"] = watch["Prix"].split('€')[0].replace(/\s/g, '');

                try {
                    watch["État"].includes(' (')
                    watch["État"] = watch["État"].split(' (')[0];
                } catch (error) {
                }

                try {
                    watch['Diamètre'].indexOf('Essayez')
                    watch["Diamètre"] = watch["Diamètre"].split(' Essayez')[0];
                } catch (error) {
                }

                return watch;
            }

            const ProcessedWatch = processWatch(watch);

            db.run(insertQuery, [
                ProcessedWatch["Code annonce"], ProcessedWatch["Marque"], page.url(), ProcessedWatch["Modèle"], ProcessedWatch["Numéro de référence"],
                ProcessedWatch["Mouvement"], ProcessedWatch["Boîtier"], ProcessedWatch["Matière du bracelet"],
                ProcessedWatch["Année de fabrication"], ProcessedWatch["État"], ProcessedWatch["Contenu livré"], ProcessedWatch["Sexe"],
                ProcessedWatch["Emplacement"], ProcessedWatch["Prix"], ProcessedWatch["Disponibilité"], ProcessedWatch["Calibre/Rouages"],
                ProcessedWatch["Réserve de marche"], ProcessedWatch["Nombre de pierres"], ProcessedWatch["Diamètre"],
                ProcessedWatch["Étanche"], ProcessedWatch["Matériau de la lunette"], ProcessedWatch["Verre"], ProcessedWatch["Cadran"],
                ProcessedWatch["Chiffres du cadran"], ProcessedWatch["Couleur du bracelet"], ProcessedWatch["Boucle"],
                ProcessedWatch["Matériau de la boucle"]
            ], (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err); // Reject the promise if there's an error inserting the data
                }
                console.log(c.green + '[+]' + c.reset + ' Watch data inserted' + c.green + ' successfully' + c.reset);
                db.close();
                resolve(); // Resolve the promise if the data was inserted successfully
            });

        });
    });
}

module.exports = getWatchStats;
