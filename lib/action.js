'use strict';

var _ = require('lodash'),
    entity = require('./entity');

/**
 * Shortcut methods for interacting with the Action resource
 *
 * @param {Api} api
 */
exports = module.exports = function(api) {
    var action = entity('action', api);

    /**
     * Find Actions taken by a User
     *
     * @param {string} user - User ID
     * @param {Object} options - Request options
     * @param callback
     */
    action.findByUser = function(user, options, callback) {
        options = _.merge(options, {
            user: user
        });

        this.getAll(options, callback);
    };

    /**
     * Find Actions by type
     *
     * @param {string} type - Action type, i.e. "Petition"
     * @param {Object} options - Request options
     * @param callback
     */
    action.findByType = function(type, options, callback) {
        options = _.merge(options, {
            type: type
        });

        this.getAll(options, callback);
    };

    return action;
};