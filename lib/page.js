'use strict';

var _ = require('lodash'),
    entity = require('./entity');

/**
 * Shortcut methods for interacting with the Page resource
 *
 * @param {Api} api
 */
exports = module.exports = function(api) {
    var page = entity('page', api);

    /**
     * Find pages by tag name
     *
     * @param {string} tag - Tag name
     * @param {Object} options - Request options
     * @param callback
     */
    page.findByTag = function(tag, options, callback) {
        options = _.merge(options, {
            tags__name: tag
        });

        this.getAll(options, callback);
    };

    /**
     * Find pages by type
     *
     * @param {string} type - Page type, i.e. "Petition"
     * @param {Object} options - Request options
     * @param callback
     */
    page.findByType = function(type, options, callback) {
        options = _.merge(options, {
            type: type
        });

        this.getAll(options, callback);
    };

    return page;
};