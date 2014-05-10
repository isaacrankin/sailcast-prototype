/* global App:false */

var FeedView = function(options){

	'use strict';

	var properties = {

		$el:{
			value: options.$el
		},

		$feedControls: {
			value: options.$feedControls
		},

		clearFeedItems: {
			value: function(){
				$('.feed-items', this.$el).empty();
			}
		},

		events: {
			value: function(){
				$('.refresh-btn', this.$feedControls).click(function(e){
					App.mediator.publish('loadFeeds');
				});
			}
		}
	};

	Object.defineProperties(this, properties);

	this.events();
};
