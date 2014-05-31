/* global App:false */

// TODO: Consider passing in jQuery - $ = jQuery to allow the

var PlayerView = function(options) {

	'use strict';

	var _leadingZero = function(val){
		return (val < 10) ? '0'+val : val;
	};

	var _updateTimer = function($el, data){

		var hours = _leadingZero(data.hours),
			minutes = _leadingZero(data.minutes),
			seconds = _leadingZero(data.seconds);

		$('.hours', $el).html(hours);
		$('.minutes', $el).html(minutes);
		$('.seconds', $el).html(seconds);
	};

	var properties = {

		state: {
			value: undefined,
			writable: true
		},

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
		this.state = state;
		return this;
	};

	this.renderItem = function(podcast){
		$('.current-podcast h4', this.$el).html(podcast.title);
		return this;
	};

	this.updateScrubber = function(data){

		_updateTimer($('.timer.__progress'), data.progress);
		_updateTimer($('.timer.__progress-negative'), data.negativeProgress);

		$('.progress', this.$scrubber).css('width', data.progress.percentage + '%');
	};

	this.reset = function(){

		this.updateScrubber({
			progressHours: 0,
			progressMinutes: 0,
			progressSeconds: 0,
			progressPercentage: 0
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