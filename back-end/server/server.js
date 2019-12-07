var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors');
var Database = require('./database/database');

class Server {

    constructor() {

        console.log('starting server...');

    }

    init() {

        var student_collection = "Cestar_C0740134";
        //TODO: add a new collection here as a variable
        app.use(cors());

        app.route('/api/student/:id?').post(function (req, res) {
            var body = '';
            let db = new Database(student_collection);
            req.on('data', function (data) {
                body += data
                console.log('Partial body: ' + body);
            });
            req.on('end', function () {
                console.log('Body: ' + body);

                db.insert_document(JSON.parse(body), (result) => {
                    res.json({ result: result });
                });

            });
        }).get(function (req, res) {

            let db = new Database(student_collection);
            console.log(req.params.id);
            if (req.params.id != undefined) {

                db.list({ '_id': req.params.id }, (result) => {
                    if(result.length > 0){
                        res.json({ result: result });
                    }else{
                        res.status(404).json("ID NOT FOUND");
                    }
                });

            } else {
                db.list({}, (rows) => {
                    res.send({ result: rows });
                });
            }
        }).put(function (req, res) {
            var body = '';
            let db = new Database(student_collection);
            req.on('data', function (data) {
                body += data
                console.log('Partial body: ' + body);
            });
            req.on('end', function () {
                console.log('Body: ' + body);
                db.update(JSON.parse(body), (result) => {
                    res.json({ result: result });
                });
            });
        }).delete(function (req, res) {
            let db = new Database(student_collection);
            console.log(req.params.id);
            if (req.params.id != undefined && req.params.id.length == 24 ) {

                db.delete_document_by_id(req.params.id, (result) => {
                    res.json({ result: result });
                });

            } else {
                res.status(404).json("Please pass id with url to delete specific student data.");
            }
        });


        app.listen(3000);
    }

}

module.exports = Server;
