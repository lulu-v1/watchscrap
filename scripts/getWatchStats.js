const sqlite3 = require('sqlite3').verbose();

async function getWatchStats(page) {
    try {
        await page.waitForSelector(".js-details-and-security-tabs", {timeout: 4000});
    }catch {
        return
    }
    const watch = await page.$eval('.js-details-and-security-tabs', (element) => {
        const watchStats = Array.from(element.querySelectorAll('tr')).map(a => a.innerText);

        const watchData = {};

        watchStats.forEach(item => {
            if (item.includes('\t')) { // Check if item contains '\t'
                const [key, value] = item.split('\t');// Destructuring the split array into key and value
                //make a switch case to handle the different values

                const formattedKey = key.trim();

                // Setting the dynamic properties on the watchData object
                watchData[formattedKey] = value.trim();
            }
        });

        return watchData;
    });

    // Insert the extracted watch data into the SQLite database
    const db = new sqlite3.Database('./Database/db.sqlite', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the watches_database database.');
    });

    const insertQuery = `
    INSERT OR REPLACE INTO Watches (
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
        }
        console.log('Watch data inserted successfully.');
        db.close();
    });

    return watch;
}

module.exports = getWatchStats;
