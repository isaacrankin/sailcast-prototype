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
		},

		$seekBackBtn: {
			value: $('.seek-back-btn', options.$el)
		},

		$seekForwardBtn: {
			value: $('.seek-forward-btn', options.$el)
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

	this.updateScrubber = function(data){
		$('.scrubber .duration .minutes', this.$el).html( data.currentTimeMinutes );
		$('.scrubber .duration .seconds', this.$el).html( data.currentTimeSeconds );
	};

	this.events = function(){

		this.$pauseBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			App.mediator.publish('pauseItem', {});
		});

		this.$playBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			App.mediator.publish('playItem', {});
		});

		this.$muteBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			$(e.currentTarget).toggleClass('icon-volume-off');
			$(e.currentTarget).toggleClass('icon-volume-up');
			App.mediator.publish('mute', {});
		});

		this.$seekBackBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			App.mediator.publish('seekIncrement', {
				direction: 'back',
				increment: 15
			});
		});

		this.$seekForwardBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			App.mediator.publish('seekIncrement',{
				direction: 'forward',
				increment: 15
			});
		});

		return this;
	};

	this.events();

	return this;
};