/* global App:false */

// TODO: Consider passing in jQuery - $ = jQuery to allow the

var PlayerView = function(options) {

	'use strict';

	var _leadingZero = function(val){
		return (val < 10) ? '0'+val : val;
	};

	var _updateTimer = function($el, data){

		if(typeof data === 'object' && $el.length === 1){

			var hours = _leadingZero(data.hours),
			minutes = _leadingZero(data.minutes),
			seconds = _leadingZero(data.seconds);

			$('.hours', $el).html(hours);
			$('.minutes', $el).html(minutes);
			$('.seconds', $el).html(seconds);

			return hours + ':' + minutes + ':'  + seconds;
		}else{
			return null;
		}

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
			value: $('.pause-btn', options.$el)
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
		if(podcast){
			$('.current-podcast h4', this.$el).html(podcast.title);
			return this;
		}else{
			return false;
		}
	};

	this.updateScrubber = function(data){

		_updateTimer($('.timer.__progress'), data.progress);
		_updateTimer($('.timer.__progress-negative'), data.negativeProgress);

		$('.progress', this.$scrubber).css('width', data.progress.percentage + '%');
	};

	this.reset = function(){

		this.updateScrubber({
			progress: {
				seconds: 0,
				minutes: 0,
				hours: 0,
				percentage: 0
			},
			negativeProgress: {
				seconds: 0,
				minutes: 0,
				hours: 0,
				percentage: 0
			}
		});

		$('.current-podcast h4', this.$el).empty();

		this.setState('stopped');
	};

	this.toggleMute = function(mute){

		if(mute === 'toggle'){
			this.$muteBtn.toggleClass('icon-volume-off');
			this.$muteBtn.toggleClass('icon-volume-up');
		}else
		if(mute){
			this.$muteBtn.addClass('icon-volume-off');
			this.$muteBtn.removeClass('icon-volume-up');
		}else{
			this.$muteBtn.removeClass('icon-volume-off');
			this.$muteBtn.addClass('icon-volume-up');
		}
	};

	this.events = function(){

		var self = this;

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
			App.mediator.publish('mute', {
				mute: 'toggle'
			});
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