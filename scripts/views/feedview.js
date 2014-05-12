/* global App:false */

var FeedView = function(options){

	'use strict';

	var properties = {

		$el:{
			value: options.$el
		},

		$feedControls: {
			value: options.$feedControls
		}
	};

	Object.defineProperties(this, properties);

	this.clearFeedItems = function(){
		$('.feed-items', this.$el).empty();
	};

	this.events = function(){
		$('.refresh-btn', this.$feedControls).click(function(e){
			App.mediator.publish('loadFeeds');
		});
	};

	this.events();
};
