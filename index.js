'use strict';

var Request = require('./lib/request'),
    user = require('./lib/user');

/**
 * ActionKit API
 *
 * Creates an ActionKit API connection with provided credentials.
 *
 * @param {string} domain - ActionKit instance domain, i.e. "act.engagementlab.org"
 * @param {string} username - ActionKit user with API access
 * @param {string} password - Password for user
 * @constructor
 */
function Api(domain, username, password) {
    Request.call(this, domain, username, password);

    this.User = user(this);
}

Api.prototype = Object.create(Request.prototype);

exports = module.exports = Api;