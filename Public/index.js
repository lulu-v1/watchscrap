const express = require('express');
const api = require('./routes');
const app = express();

// middleware
app.use(express.json());
app.use('/watches/', api);
// port
const port = process.env.PORT || 5500;
app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Views/index.html');
});

app.listen(port, () => console.log(`Listening on Port: http://localhost:${port}`));