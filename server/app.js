var express = require('express');
var moment = require('moment');
var async = require('async');
var path = require('path');
var url = require('url');
var pg = require('pg');
var fs = require('fs');
var app = express();

var creds = fs.readFileSync(path.resolve(__dirname, '../creds.txt')).toString().split('\n');
console.log(creds);

var db_username = creds[0].trim();
var db_password = creds[1].trim();
var db_name = creds[2].trim();

var config = {
    user: db_username,
    database: db_name,
    password: db_password,
    // host: 'localhost',
    host: '40.78.99.54',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};

var pool = new pg.Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
})

app.get('/streams', function (req, res) {

    // async.parallel({
    //     streams: function (cb) {
    //
    //     },
    //     thoughts: function (cb) {
    //
    //     }
    // }, function asyncComplete(error, );

    var queryString = `SELECT * FROM streams;`;
    pool.query(queryString, function (error, results) {
        if (error) {
            console.error(error);
            return error);
        }

        var streams = results.rows;



    });
});

app.get('/', function (req, res) {
    return res.send("Hello world");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
