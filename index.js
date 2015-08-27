'use strict';

var ActionKitRequest = require('./lib/ak-request'),
    entity = require('./lib/entity'),
    user = require('./lib/user'),
    page = require('./lib/page'),
    action = require('./lib/action');

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
    ActionKitRequest.call(this, domain, username, password);

    this.User = user(this);
    this.Page = page(this);
    this.Action = action(this);
    this.Tag = entity('tag', this);
}

Api.prototype = Object.create(ActionKitRequest.prototype);

exports = module.exports = Api;