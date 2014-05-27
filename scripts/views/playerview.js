/* global App:false */

// TODO: Consider passing in jQuery - $ = jQuery to allow the

var PlayerView = function(options) {

	'use strict';

	var properties = {

		$el: {
			value: options.$el
		},

		$playBtn: {
			value: $('.play-btn', options.$el)
		},

		$stopBtn: {
			value:  $('.stop-btn', options.$el)
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
		},

		$scrubber: {
			value: $('.scrubber', options.$el)
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

		$('.duration .minutes', this.$scrubber).html( data.currentTimeMinutes );
		$('.duration .seconds', this.$scrubber).html( data.currentTimeSeconds );

		$('.progress', this.$scrubber).css('width', data.progress + '%');
	};

	this.reset = function(){

		this.updateScrubber({
			currentTimeMinutes: 0,
			currentTimeSeconds: 0,
			progress: 0
		});

		$('.current-podcast h4', this.$el).empty();

		this.setState('stopped');
	};

	this.events = function(){

		this.$pauseBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			App.mediator.publish('pauseItem');
		});

		this.$playBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			App.mediator.publish('playItem');
		});

		this.$stopBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			App.mediator.publish('stopItem');
		});

		this.$muteBtn.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){
			$(e.currentTarget).toggleClass('icon-volume-off');
			$(e.currentTarget).toggleClass('icon-volume-up');
			App.mediator.publish('mute');
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

		this.$scrubber.bind( (Modernizr.touch) ? 'touchend' : 'click', function(e){

			// TODO: research what e.originalEvent - returned by jQuery
			var clientX  = (Modernizr.touch) ? e.originalEvent.changedTouches[0].pageX : e.clientX;
			var dist = clientX - $(e.currentTarget).offset().left;

			App.mediator.publish('seekToPercentage',{
				percentage: dist / ($(e.currentTarget).width()/100)
			});
		});

		return this;
	};

	this.events();

	return this;
};