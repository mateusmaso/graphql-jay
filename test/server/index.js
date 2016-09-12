var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var api = require('./api');

var PORT = process.env.PORT || 8080;
var app = express();

app.use(morgan('combined'));
app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/graph', api.graph);
app.use('/api/graph-2', api.graph2);
app.use('/api/graph-3', api.graph3);

app.listen(PORT);

console.log(`Running on http://localhost:${PORT}`);
