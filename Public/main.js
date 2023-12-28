const express = require('express');
const app = express();

const api = require(__dirname + '/routes');

const port = 3000;

app.use(express.static(__dirname + '/'));
app.use('/api/', api)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Views/index.html');
});

app.get('/watches', (req, res) => {
    res.sendFile(__dirname + '/Views/watches.html');
});


app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});