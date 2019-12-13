var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017"; //TODO: change this for the mongodb server url
var database = "exam3_C0740134";//TODO: change this 
var ObjectID = require('mongodb').ObjectID;

class DataBase {

  constructor(collection) {
    console.log('init database');
    this.current_collection = collection;
  }

  insert_document(data, callback = null) {
    let _self = this;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var mydbs = db.db(database);

      mydbs.collection(_self.current_collection).insertOne(data, {}, function (err, response) {
        if (err) throw err;
        console.log("Insert data success!");

        if (callback) {
          callback(response);
        }
        db.close();
      });

    });
  }

  delete_document_by_id(id, callback = null) {
    let _self = this;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var mydbs = db.db(database);

      mydbs.collection(_self.current_collection).deleteOne({ "_id": new ObjectID(id) }, {}, function (err, result) {
        if (err) throw err;

        if (callback) {
          callback(result);
        }

        db.close();
      });

    });
  }

  delete_document_by_key_value(data, is_many = false, callback = null) {
    let _self = this;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var mydbs = db.db(database);

      if (is_many) {
        mydbs.collection(_self.current_collection).deleteMany(data, {}, function (err, result) {
          if (err) throw err;

          if (callback) {
            callback(result);
          }

          db.close();

        });
      } else {
        mydbs.collection(_self.current_collection).deleteOne(data, {}, function (err, result) {
          if (err) throw err;

          if (callback) {
            callback(result);
          }

          db.close();

        });

      }
    });
  }

  list(data = {}, callback = null) {
    let _self = this;

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var mydbs = db.db(database);

      mydbs.collection(_self.current_collection).find(data).toArray(function (err, result) {
        if (err) throw err;

        console.log("Find All: ");
        console.log(result);

        if (callback) {
          callback(result);
        }

        db.close();
      });

    });
  }

  update(data, callback = null) {
    let _self = this;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var mydbs = db.db(database);
      console.log(data);
      let filter = { '_id': new ObjectID(data._id) };
      console.log(filter);
      delete data._id;
      console.log(data);

      mydbs.collection(_self.current_collection).updateOne(filter, { '$set': data }, function (err, result) {
        if (err) throw err;

        console.log("Find All: ");
        console.log(result);

        if (callback) {
          callback(result);
        }

        db.close();
      });

    });

  }

}

module.exports = DataBase;