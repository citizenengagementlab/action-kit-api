'use strict';

/**
 * Shortcut methods for interacting with the User resource
 *
 * @param {Api} api
 * @returns {{get: Function, getAll: Function, create: Function, update: Function, delete: Function}}
 */
exports = module.exports = function(api) {
    return {

        get: function(id, options, callback) {
            api.get('/rest/v1/user/' + id + '/', options, callback);
        },

        getAll: function(options, callback) {
            api.getAll('/rest/v1/user/', options, callback);
        },

        create: function(data, callback) {
            api.create('/rest/v1/user/', data, callback);
        },

        update: function(id, data, callback) {
            api.update('/rest/v1/user/' + id + '/', data, callback);
        },

        delete: function(id, callback) {
            api.delete('/rest/v1/user/' + id + '/', callback);
        }

    };
};