const {globalTableName} = require("../DbManagement/DbOpener");
const c = require("../Style/consoleColors");
const db = require("../DbManagement/DbOpener").db;


function insertWatch(watch){
    function processWatch(watch) {
        try {
            watch["Prix"] = watch["Prix"].split('€')[0].replace(/\s/g, '');
        } catch (error) {
            console.log("Error parsing watch price")
        }
        try {
            watch["État"] = watch["État"].split(' (')[0];
        } catch (error) {
            console.log("Error parsing watch state")
        }
        try {
            watch["Diamètre"] = watch["Diamètre"].split(' Essayez')[0];
        } catch (error) {
            console.log("Error parsing watch diameter")
        }
        return watch;
    }

    const insertQuery = `
        INSERT OR
        REPLACE INTO ${globalTableName} (Code_annonce, Marque, Lien, Modele, Numero_de_reference, Mouvement,
                                         Boitier, Matiere_du_bracelet, Annee_de_fabrication, Etat, Contenu_livre, Sexe,
                                         Emplacement, Prix, Disponibilite, Calibre_Rouages, Reserve_de_marche,
                                         Nombre_de_pierres, Diametre, Etanche, Materiau_de_la_lunette, Verre,
                                         Cadran, Chiffres_du_cadran, Couleur_du_bracelet, Boucle, Materiau_de_la_boucle)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const ProcessedWatch = processWatch(watch);

    db.run(insertQuery, [
        ProcessedWatch["Code annonce"], ProcessedWatch["Marque"], ProcessedWatch["Lien"], ProcessedWatch["Modèle"], ProcessedWatch["Numéro de référence"],
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
    });
}
function getAllWatches(callback) {
    const selectQuery = `SELECT * FROM ${globalTableName}`;

    db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.log(c.red + '[-]' + c.reset + ' Error fetching watches');
            console.error(err.message);
            return callback(err, null);
        }
        console.log(c.green + '[+]' + c.reset + ' Fetched all watches successfully' + c.reset);
        callback(null, rows);
    });
}
function deleteWatchById(id, callback) {
    const deleteQuery = `DELETE FROM ${globalTableName} WHERE id = ?`;

    db.run(deleteQuery, [id], (err) => {
        if (err) {
            console.log(c.red + '[-]' + c.reset + ' Error deleting watch by ID');
            console.error(err.message);
            return callback(err);
        }
        console.log(c.green + '[+]' + c.reset + ' Deleted watch by ID successfully' + c.reset);
        callback(null);
    });
}



module.exports = { insertWatch, getAllWatches } ;