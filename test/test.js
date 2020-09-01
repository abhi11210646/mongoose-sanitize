'use strict';

const should = require('chai').should();
const mongoose = require('mongoose');
const sanitizerPlugin = require('../lib/mongoose-sanitizer.js');
const xss_string = 'hello world <SCRIPT SRC=http://hacker.org/malacious.js></SCRIPT>';
const legitimate_string = '<script>Will not be sanitized!</script>';

const TestSchema = new mongoose.Schema({ 
	sanitizible_field: String,	
	non_sanitizible_field: String,
	object_field: {
		sub_sanitizable_field: {
			type: String
		},
		sub_non_sanitizable_field: {
			type: String
		}
	}
});

TestSchema.plugin(sanitizerPlugin, {skip: ['non_sanitizible_field']});

mongoose.model('Test', TestSchema);

const Test = mongoose.model('Test');

const testDoc = new Test({
	sanitizible_field: xss_string,
	non_sanitizible_field: legitimate_string,
	object_field: {
		sub_sanitizable_field: xss_string
	}
});

describe('Mongoose Sanitizer Tests', function() {

	before(function(done) {
		mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true }, function(err) {
		    should.not.exist(err);
		    done();
		});		
	});
				
	it('should save a test document', function(done) {
	 	testDoc.save(function (err) {
			should.not.exist(err);
			done();
		});	 	
	});

	it('should sanitize sanitizible_field', function(done) {
	 	testDoc.sanitizible_field.should.not.equal(xss_string);
	 	done();
	});

	it('should not sanitize non_sanitizible_field', function(done) {	 	
	 	testDoc.non_sanitizible_field.should.equal(legitimate_string);
	 	done();
	});

	it('should sanitize sub_sanitizable_field', function(done) {
	 	testDoc.object_field.sub_sanitizable_field.should.not.equal(xss_string);
	 	done();
	});

	after(function(done){
		// https://github.com/sindresorhus/gulp-mocha/issues/54#issuecomment-59713090
		mongoose.connection.close();
		done();
	});

});

