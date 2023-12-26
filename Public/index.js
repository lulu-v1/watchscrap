const express = require('express');
const api = require('./routes');
const app = express();

// middleware
app.use(express.json());
app.use('/api', api);
// port
const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Listening on Port: http://localhost:${port}`));