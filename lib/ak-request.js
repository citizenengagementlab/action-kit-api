'use strict';

var request = require('request'),
    async = require('async'),
    _ = require('lodash'),
    pkg = require('../package.json');

var headers = {
    'Accept': 'application/json',
    'User-Agent': pkg['repository']['url']
};

var populateFields = function(fields, response, callback) {
    var self = this;
    var queue = [];

    // If fields is single string, make it an array
    if(!Array.isArray(fields)) {
        fields = [fields];
    }

    // Short-circuit if no fields to populate
    if(!fields.length) {
        return callback(null, response);
    }

    // For each field to populate which exists on resource,
    // queue the fetching of all related resources
    var queueFields = function(resource) {
        fields.forEach(function(field) {
            if(!resource.hasOwnProperty(field)) {
                return;
            }

            queue.push(function(cb) {
                self.getAll(resource[field], function(err, result) {
                    if(err) {
                        return cb(err);
                    }

                    resource[field] = result;
                    cb();
                });
            });
        });
    };

    // Response may be a single resource, an array of resources,
    // or an array of resources on the 'objects' property
    if(response.hasOwnProperty('objects')) {
        response['objects'].forEach(function(resource) {
            queueFields(resource);
        });
    }
    else if(Array.isArray(response)) {
        response.forEach(function(resource) {
            queueFields(resource);
        });
    }
    else {
        queueFields(response);
    }

    async.series(queue, function(err) {
        callback(err, response);
    });
};

/**
 * ActionKit API wrapper
 *
 * @param {string} domain - ActionKit instance domain, i.e. "act.engagementlab.org"
 * @param {string} username - ActionKit user with API access
 * @param {string} password - Password for user
 * @constructor
 */
var ActionKitRequest = function(domain, username, password) {
    this.domain = domain;
    this.username = username;
    this.password = password;
    this.baseURI = 'https://' + this.domain;
    this.request = request.defaults({
        headers: headers,
        auth: {
            username: this.username,
            password: this.password
        }
    });
};

/**
 * Get a resource or collection of resources from ActionKit API
 *
 * @param {string} [path=/rest/v1/] - Resource path, i.e. "/rest/v1/page/"
 * @param {Object} [options] - Request options
 * @param callback
 */
ActionKitRequest.prototype.get = function(path, options, callback) {
    if(typeof path === 'function') {
        callback = path;
        path = '/rest/v1/';
        options = {};
    }

    if(typeof options === 'function') {
        callback = options;
        options = {};
    }

    var self = this;
    var populate = _.get(options, 'populate', []);
    var req = {
        uri: this.baseURI + path,
        method: 'GET',
        json: true,
        qs: _.omit(options, 'populate')
    };

    this.request(req, function(err, res, body) {
        if(err) {
            return callback(err);
        }

        if(res.statusCode != 200) {
            return callback(new Error(res.statusCode + ': ' + res.statusMessage));
        }

        populateFields.call(self, populate, body, callback);
    });
};

/**
 * Paginate over a collection
 *
 * @param {string} path - Resource path, i.e. "/rest/v1/page/"
 * @param {Object} [options] - Request parameters
 * @param callback
 */
ActionKitRequest.prototype.getAll = function(path, options, callback) {
    if(typeof options === 'function') {
        callback = options;
        options = {};
    }

    var self = this;
    var populate = _.get(options, 'populate', []);
    var results = [];

    options = _.extend({
        _limit: 100,
        _offset: 0
    }, options);

    this.get(path, options, function(err, body) {
        var nextPage = _.get(body, 'meta.next');
        results = results.concat(_.get(body, 'objects', body));

        async.whilst(
            function() {
                return nextPage != null;
            },
            // Get next page
            function(cb) {
                self.get(nextPage, { populate: populate }, function(err, body) {
                    if(err) {
                        return cb(err);
                    }

                    nextPage = _.get(body, 'meta.next');
                    results = results.concat(_.get(body, 'objects', body));
                    cb();
                });
            },
            function(err) {
                callback(err, results);
            }
        );
    });
};

/**
 * Creates a resource
 *
 * @param {string} path - Resource path, i.e. "/rest/v1/user/"
 * @param {Object} data - Resource data
 * @param callback
 */
ActionKitRequest.prototype.create = function(path, data, callback) {
    var options = {
        uri: this.baseURI + path,
        method: 'POST',
        json: data
    };

    this.request(options, function(err, res) {
        if(err) {
            return callback(err);
        }

        if(res.statusCode != 201) {
            return callback(new Error(res.statusCode + ': ' + res.statusMessage));
        }

        callback();
    });
};

/**
 * Updates a resource
 *
 * @param {string} path - Resource path, i.e. "/rest/v1/user/1234/"
 * @param {Object} data - Resource data to update
 * @param callback
 */
ActionKitRequest.prototype.update = function(path, data, callback) {
    var options = {
        uri: this.baseURI + path,
        method: 'PUT',
        headers: headers,
        json: data
    };

    this.request(options, function(err, res) {
        if(err) {
            return callback(err);
        }

        if(res.statusCode != 204) {
            return callback(new Error(res.statusCode + ': ' + res.statusMessage));
        }

        callback();
    });
};

/**
 * Deletes a resource
 *
 * @param {string} path - Resource path, i.e. "/rest/v1/user/1234/"
 * @param callback
 */
ActionKitRequest.prototype.delete = function(path, callback) {
    var options = {
        uri: this.baseURI + path,
        method: 'DELETE',
        headers: headers
    };

    this.request(options, function(err, res) {
        if(err) {
            return callback(err);
        }

        if(res.statusCode != 204) {
            return callback(new Error(res.statusCode + ': ' + res.statusMessage));
        }

        callback();
    });
};

/**
 * Counts the number of resources in a collection
 *
 * @param {string} path - Collection path, i.e. "/rest/v1/user/"
 * @param callback
 */
ActionKitRequest.prototype.count = function(path, callback) {
    var options = {
        uri: this.baseURI + path,
        method: 'GET',
        headers: headers,
        json: true
    };

    this.request(options, function(err, res, body) {
        if(err) {
            return callback(err);
        }

        if(res.statusCode != 200) {
            return callback(new Error(res.statusCode + ': ' + res.statusMessage), res);
        }

        callback(null, _.get(body, 'meta.total_count', 1));
    });
};

exports = module.exports = ActionKitRequest;
