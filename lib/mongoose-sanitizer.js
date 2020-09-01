'use strict';

const traverse = require("traverse");
const sanitizer = require('sanitizer');

module.exports = exports = function sanitizerPlugin(schema, options) {

	// Set defaut options.
	options = options || {
		skip: [],
		include: []
	};
	options.include = Object.prototype.toString.call(options.include) === '[object Array]' ? options.include : [];
	options.skip = Object.prototype.toString.call(options.skip) === '[object Array]' ? options.skip : [];

	schema.pre('save', function (next) {
		const doc = JSON.parse(JSON.stringify(this._doc));
		if (options.include.length < 1) {
			// Sanitize every field by default:
			options.include = Object.keys(this._doc);
		}
		// Sanitize every node in tree:
		const sanitized = traverse(doc).map(function (node) {
			if (typeof node === 'string') {
				const sanitizedNode = sanitizer.sanitize(node);
				this.update(sanitizedNode);
			}
		});
		// Exclude skipped nodes:
		options.include.forEach(function (node) {
			// Sanitize field unless explicitly excluded:
			if (options.skip.indexOf(node) < 0) {
				this[node] = sanitized[node];
			}
		}, this);

		next();
	});
};
