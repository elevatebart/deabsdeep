'use strict';

const escape = require('escape-string-regexp');
const getRootDir = require('./getRootDir');
const mapObj = require('./mapObj');

const MASK = '~';
const DIRNAME = getRootDir();

/**
 * Recursively replace absolute paths in object keys and values or in array values with a “~”.
 *
 * @param {object} obj
 * @param {object} [options]
 * @param {string} [options.root]
 * @param {string} [options.mask]
 * @return {object}
 */
module.exports = function(obj, options) {
	options = options || {};
	const root = options.root || DIRNAME;
	const mask = options.mask || MASK;

	const regExp = new RegExp(escape(root), 'g');
	const pureDeabs = s => s.replace(regExp, mask);

	const normalizeSeparators = s => s.replace(/\\/g, '/');

	const deabs = s =>
		typeof s === 'string' ? normalizeSeparators(pureDeabs(s)) : s;

	if (Array.isArray(obj)) {
		return obj.map(deabs);
	}

	return typeof obj === 'string'
		? deabs(obj)
		: mapObj(obj, (key, value) => [deabs(key), deabs(value)]);
};
