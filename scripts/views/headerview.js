/* global App:false */

var HeaderView = function(options){

	'use strict';

	var properties = {

		$el:{
			value: options.$el
		}
	};

	Object.defineProperties(this, properties);

	this.populateFeedMenu = function(feeds){

		$('select#feed-list-select option:not(:first-child)', this.$el).remove();

		for(var key in feeds){
			$('select#feed-list-select', this.$el).append('<option value="'+ feeds[key].url +'">'+feeds[key].name+'</option>');
		}

		return this;
	};

	this.events = function(){

		$('.refresh-btn', this.$el).bind( (Modernizr.touch) ? 'touchstart' : 'click', function(e){
			App.mediator.publish('loadFeeds');
		});
	};

	this.events();
};
