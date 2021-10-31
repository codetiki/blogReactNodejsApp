var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var port = 3002;
var hostname = "127.0.0.1";

var cors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(cors);

// importataan reitit
const blogRoutes = require('./routes/blogRoutes');
app.use(blogRoutes);
const postRoutes = require('./routes/postRoutes');
app.use(postRoutes);
const tarveRoutes = require('./routes/tarveRoutes');
app.use(tarveRoutes);
const kiinnitysRoutes = require('./routes/kiinnitysRoutes');
app.use(kiinnitysRoutes);




app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});