/* global App:false */

var PlayerView = function(options) {

	'use strict';

	var properties = {

		$el: {
			value: options.$el,
			writable: false
		},

		$playBtn: {
			value: $('.play-btn', options.$el),
			writable: false
		},

		$pauseBtn: {
			value: $('.pause-btn', options.$el),
			writable: false
		}

	};

	// Define the properties
	Object.defineProperties(this, properties);

	this.setState = function(state){
		this.$el.attr('data-state', state);
		return this;
	};

	this.renderItem = function(podcast){
		$('.current-podcast h4', this.$el).html(podcast.title);
		return this;
	};

	this.events = function(){

		this.$pauseBtn.click(function(e){
			App.mediator.publish('pauseItem', {});
		});

		this.$playBtn.click(function(e){
			App.mediator.publish('playItem', {});
		});

		return this;
	};

	this.events();

	return this;
};