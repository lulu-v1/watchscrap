// importing packages
const express = require('express');
const router = express.Router();

const RetrieveAllWatches = require("../Api/RetrieveInfos");
router.get(`/`, async function (req, res) {
    const result = await RetrieveAllWatches();
    res.status(200).send(result);
});

module.exports = router;