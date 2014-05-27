/* global App:false, indexedDB: false */

var DataManager = function(options){

	'use strict';

	var _supportsIndexedDB = function(){
		return (window.indexedDB) ? true : false;
	}

	var properties = {

		dbName: {
			value: options.dbName
		},

		dbVersion: {
			value: 1
		}
	};

	Object.defineProperties(this, properties);

	this.deleteDB = function(){
		var request = window.indexedDB.deleteDatabase(this.dbName);
		return request;
	};

	this.connectDB = function(){

		var request = window.indexedDB.open(this.dbName, this.dbVersion);

		request.onupgradeneeded = function() {

			// The database did not previously exist, so create object stores and indexes.
			var db = request.result;

//			var store = db.createObjectStore('books', {keyPath: 'isbn'});
//			var titleIndex = store.createIndex('by_title', 'title', {unique: true});
//			var authorIndex = store.createIndex('by_author', 'author');
//
//			// Populate with initial data.
//			store.put({
//				title: 'Quarry Memories',
//				author: 'Fred',
//				isbn: 123456
//			});
//			store.put({title: 'Water Buffaloes', author: 'Fred', isbn: 234567});
//			store.put({title: 'Bedrock Nights', author: 'Barney', isbn: 345678});
		};

		request.onsuccess = function() {
			var db = request.result;

			console.log(db);
		};

		request.onerror = function(event) {
			// Do something with request.errorCode!
		};
	};

	this.create = function(data){

	};

	this.read = function(key){

	};

	this.update = function(key){
	};

	this.destroy = function(key){

	};
};