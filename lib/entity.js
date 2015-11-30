'use strict';

/**
 * Shortcut methods for interacting with entities
 *
 * @param {string} entity - ActionKit entity name, i.e. "page"
 * @param {Api} api
 * @returns {{get: Function, getAll: Function, create: Function, update: Function, delete: Function}}
 */
exports = module.exports = function(entity, api) {
    entity = entity.toLowerCase();

    return {

        /**
         * Get entity record by id
         *
         * @param {string|number} id - Record ID
         * @param {Object} options - Request options
         * @param callback
         */
        get: function(id, options, callback) {
            api.get('/rest/v1/' + entity + '/' + id + '/', options, callback);
        },

        /**
         * Get all entity records
         *
         * @param {Object} options - Request options
         * @param callback
         */
        getAll: function(options, callback) {
            api.getAll('/rest/v1/' + entity + '/', options, callback);
        },

        /**
         * Create a new entity record
         *
         * @param {Object} data - New record data
         * @param callback
         */
        create: function(data, callback) {
            api.create('/rest/v1/' + entity + '/', data, callback);
        },

        /**
         * Update an existing entity record
         *
         * @param {string|number} id - Record ID
         * @param {Object} data - Sparse record data to update
         * @param callback
         */
        update: function(id, data, callback) {
            api.update('/rest/v1/' + entity + '/' + id + '/', data, callback);
        },

        /**
         * Delete an entity record by ID
         *
         * @param {string|number} id - Record ID
         * @param callback
         */
        delete: function(id, callback) {
            api.delete('/rest/v1/' + entity + '/' + id + '/', callback);
        },

        /**
         * Count all entity records
         *
         * @param {Object} options - Request options
         * @param callback
         */
        count: function(options, callback) {
            api.count('/rest/v1/' + entity + '/', options, callback);
        }

    };
};