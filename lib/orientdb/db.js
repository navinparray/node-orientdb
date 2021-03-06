var Server = require("./connection/server").Server;
var Manager = require("./connection/manager");
var OperationTypes = require("./commands/operation_types");

function Db(databaseName, serverConfig, options) {

    this.databaseName = databaseName;
    this.serverConfig = serverConfig;

    this.options = options || {};
    this.userName = options.user_name;
    this.userPassword = options.user_password;
    this.databaseType = options.database_type || "document";
    this.storageType = options.storage_type || "local";
};

exports.Db = Db;


Db.prototype.open = function (callback) {

    var data = {
        database_name: this.databaseName,
        user_name: this.userName,
        user_password: this.userPassword
    };

    this.serverConfig.send(OperationTypes.DB_OPEN, data, callback);
};


Db.prototype.create = function (callback) {

    var data = {
        database_name: this.databaseName,
        database_type: this.databaseType,
        storage_type: this.storageType
    };

    this.serverConfig.send(OperationTypes.DB_CREATE, data, function(err, result) {

        if (err) { return callback(err); }

        callback(null);
    });
};


Db.prototype.close = function (callback) {
    this.serverConfig.send(OperationTypes.DB_CLOSE, callback);
};


Db.prototype.exist = function (callback) {

    var data = {
        database_name: this.databaseName
    };

    this.serverConfig.send(OperationTypes.DB_EXIST, data, function(err, result) {

        if (err) { return callback(err); }

        result = result || {};
        callback(null, result.result);
    });

};


Db.prototype.reload = function (callback) {
    this.serverConfig.send(OperationTypes.DB_RELOAD, callback);
};


Db.prototype.drop = function (callback) {

    var data = {
        database_name: this.databaseName
    };

    this.serverConfig.send(OperationTypes.DB_DELETE, data, function(err, result) {

        if (err) { return callback(err); }

        // TODO something's fishy in the protocol because
        //      the server does not return the 'result' byte
        // TODO also the server does not complain if the database does not exist
        result = result || {};
        callback(null, result.result || 1);
    });
};


Db.prototype.size = function (callback) {

    this.serverConfig.send(OperationTypes.DB_SIZE, function(err, result) {

        if (err) { return callback(err); }

        result = result || {};
        callback(null, result.size);
    });
};


Db.prototype.countRecords = function (callback) {

    this.serverConfig.send(OperationTypes.DB_COUNTRECORDS, function(err, result) {

        if (err) { return callback(err); }

        result = result || {};
        callback(null, result.count);
    });
};

