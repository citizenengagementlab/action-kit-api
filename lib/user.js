'use strict';

var _ = require('lodash'),
    entity = require('./entity');

/**
 * Shortcut methods for interacting with the User resource
 *
 * @param {Api} api
 */
exports = module.exports = function(api) {
    var user = entity('user', api);

    /**
     * Find a user by email address
     *
     * @param {string} email - User's email address
     * @param {Object} options - Request options
     * @param callback
     */
    user.findByEmail = function(email, options, callback) {
        options = _.merge(options, {
            email: email,
            _limit: 1
        });

        this.getAll(options, callback);
    };

    /**
     * Find users by state
     *
     * @param {string} state - US State code, i.e. "CA"
     * @param {Object} options - Request options
     * @param callback
     */
    user.findByState = function(state, options, callback) {
        options = _.merge(options, {
            state: state
        });

        this.getAll(options, callback);
    };

    return user;
};