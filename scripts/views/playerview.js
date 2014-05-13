/* global App:false */

var PlayerView = function(options) {

	'use strict';

	var properties = {

		$el: {
			value: options.$el,
		},

		$playBtn: {
			value: $('.play-btn', options.$el),
		},

		$pauseBtn: {
			value: $('.pause-btn', options.$el),
		},

		$muteBtn: {
			value: $('.mute-btn', options.$el)
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

		this.$pauseBtn.bind( (Modernizr.touch) ? 'touchstart' : 'click', function(e){
			App.mediator.publish('pauseItem', {});
		});

		this.$playBtn.bind( (Modernizr.touch) ? 'touchstart' : 'click', function(e){
			App.mediator.publish('playItem', {});
		});

		this.$muteBtn.bind( (Modernizr.touch) ? 'touchstart' : 'click', function(e){
			$(e.currentTarget).toggleClass('icon-volume-off');
			$(e.currentTarget).toggleClass('icon-volume-up');
			App.mediator.publish('mute', {});
		});

		return this;
	};

	this.events();

	return this;
};