// importing packages
const express = require('express');
const router = express.Router();
const { RetrieveAllWatches, RetrieveAllFromSpecificDB, RetrieveSpecificWatch, RetrieveFromSpecificDB} = require("../Api/watches");

router.get(`/`, async function (req, res) {
    const result = await RetrieveAllWatches();
    res.status(200).send(result);
});

//get a specific watch
router.get(`/:id`, async function (req, res) {
    const result = await RetrieveSpecificWatch(req.params.id);
    if (result === "[]") {
        res.status(404).send("Watch not found");
        return;
    }
    res.status(200).send(result);
});

//get all watches from a specific db
router.get(`/db/:tableName`, async function (req, res) {
    const result = await RetrieveAllFromSpecificDB(req.params.tableName);
    res.status(200).send(result);
});

//get a specific watch from a specific db
router.get(`/db/:tableName/:id`, async function (req, res) {
    const result = await RetrieveFromSpecificDB(req.params.id, req.params.tableName);
    if (result === "[]") {
        res.status(404).send("Watch not found");
        return;
    }
    res.status(200).send(result);
});

module.exports = router;