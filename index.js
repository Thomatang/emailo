const express = require('express');
const app = express(); // used to setup configuration that will listen to incoming requests and route them to different handlers


app.get('/', (req, res) => {
    res.send({ hi: 'there'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);