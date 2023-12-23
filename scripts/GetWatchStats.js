const { globalTableName } = require("../Database/initDB");
const sqlite3 = require('sqlite3').verbose();
const c = require("../Style/consoleColors.js");

async function getWatchStats(page) {
    try {
        await page.waitForSelector(".js-details-and-security-tabs", { visible: true, timeout: 3000 });
    } catch (error) {
        console.error(c.red + '[-]' + c.reset + ' Wrong Page URL');
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
    async function connectToDatabase() {
        // Connect to SQLite database (creates a new one if it doesn't exist)
        return new sqlite3.Database('./Database/db.sqlite', (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    const db = await connectToDatabase()
        const insertQuery = `
            INSERT OR REPLACE INTO ${globalTableName} (Code_annonce, Marque, Lien, Modele, Numero_de_reference, Mouvement,
                                             Boitier, Matiere_du_bracelet, Annee_de_fabrication, Etat, Contenu_livre, Sexe,
                                             Emplacement, Prix, Disponibilite, Calibre_Rouages, Reserve_de_marche,
                                             Nombre_de_pierres, Diametre, Etanche, Materiau_de_la_lunette, Verre,
                                             Cadran, Chiffres_du_cadran, Couleur_du_bracelet, Boucle, Materiau_de_la_boucle)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        function processWatch(watch) {
            watch["Prix"] = watch["Prix"].split('€')[0].replace(/\s/g, '');

            try {
                watch["État"] = watch["État"].split(' (')[0];
            } catch (error) {}

            try {
                watch["Diamètre"] = watch["Diamètre"].split(' Essayez')[0];
            } catch (error) {}

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
                console.log(c.red + '[-]' + c.reset + ' Error inserting watch Info');
                console.error(err.message);
                return;
            }
        console.log(c.green + '[+]' + c.reset + ' Watch Info inserted successfully' + c.reset);
        db.close();
        });
}

module.exports = getWatchStats;
