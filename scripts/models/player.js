/* global App:false */

/**
 * The main player object
 */
var Player = function(options) {

	'use strict';

	/**
	 * Validate audio url, check if client can play format
	 *
	 * @param mediaElement
	 * @param src
	 * @returns {boolean}
	 * @private
	 */
	var _validateSrc = function(mediaElement, src){

		if(typeof src !== 'string' || src === ''){
			return false;
		}

		// find type of file by getting the file extension
		var spl = src.split('.'),
			extension = spl[(spl.length - 1)];

		return (mediaElement.canPlayType('audio/'+ extension) === '') ? false : true;
	};

	/**
	 * Formats seconds to hours, minutes and seconds for use with hh:mm:ss format
	 * Also returns duration as a percentage
	 *
	 * @param timeSeconds
	 * @param duration
	 * @returns {{seconds: Number, minutes: Number, hours: Number, percentage: number}}
	 * @private
	 */
	var _formatTime = function(seconds, duration){
		return {
			seconds: parseInt( seconds % 60),
			minutes: parseInt( (seconds/60) % 60),
			hours: parseInt( (seconds/ (60*60)) % 24),
			percentage: Math.round( (seconds / (duration/100)) * 100) / 100
		};
	};

	/**
	 * Compile values to be published by playback
	 *
	 * @param audioElement
	 * @private
	 */
	var _playbackValues = function(audioElement){

		var progressTime = _formatTime(audioElement.currentTime, audioElement.duration),
			negativeProgressTime = _formatTime((audioElement.duration - audioElement.currentTime), audioElement.duration);


		// TODO: Return buffered audio data as a %

		return {
			currentTime: audioElement.currentTime,
			duration: audioElement.duration,
			playerState: audioElement.readyState,
			progress: {
				seconds: progressTime.seconds,
				minutes: progressTime.minutes,
				hours: progressTime.hours,
				percentage: progressTime.percentage
			},
			negativeProgress: {
				seconds: negativeProgressTime.seconds,
				minutes: negativeProgressTime.minutes,
				hours: negativeProgressTime.hours,
				percentage: negativeProgressTime.percentage
			}
		};
	};

	var properties = {

		audioElement: {
			value: options.audioElement
		},

		playbackLoopInterval: {
			value: 1000
		},

		seekIncrement: {
			value: 20
		},

		state:{
			value: undefined,
			writable: true
		},

		currentItem: {
			value: undefined,
			writable: true
		},

		playbackLoop: {
			value: undefined,
			writable: true
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

	this.getReadyState = function(){
		return this.audioElement.readyState;
	};


	this.play = function(podcast){

		// Play the podcast if valid
		if(typeof podcast === 'object' && _validateSrc(this.audioElement, podcast.src)){

			this.audioElement.setAttribute('src', podcast.src);

			App.mediator.publish('mute', {
				mute: false
			});

			this.audioElement.play();
			this.currentItem = podcast;
			this.state = 'playing';

			return this;

		// Try play a paused item
		}else if(this.audioElement.paused && typeof this.currentItem !== 'undefined'){

			this.audioElement.play();
			this.state = 'playing';

			return this;

		}else{
			return false;
		}
	};

	this.pause = function(){
		this.audioElement.pause();
		this.state = 'paused';
		return this;
	};

	this.stop = function(){
		// Removing attribute value stops download of media
		this.audioElement.setAttribute('src', '');
		this.state = 'stopped';
		return this;
	};

	this.mute = function(mute){
		if(mute === 'toggle'){
			this.audioElement.muted = (this.audioElement.muted) ? false : true;
		}else{
			this.audioElement.muted = mute;
		}
		return this;
	};

	this.seekToPercentage = function(percentage){
		this.audioElement.currentTime = (this.audioElement.duration / 100) * percentage;
		return this.audioElement.currentTime;
	};

	this.seekByIncrement = function(direction, increment){

		// Fallback to default increment
		if(typeof increment === 'undefined'){
			increment = this.seekIncrement;
		}

		if(direction === 'back'){
			this.audioElement.currentTime -= increment;
		}else{
			this.audioElement.currentTime += increment;
		}

		return this.audioElement.currentTime;
	};

	/**
	 * Listen for media events on audio element and publish them
	 */
	this.mediaEvents = function(){

		// Playback loop
		this.audioElement.addEventListener('timeupdate', function(e) {

			// Publish playback values
			var playbackValues = _playbackValues(e.target);
			App.mediator.publish('timeupdate', playbackValues);

		}, true);

		// Download progress
		this.audioElement.addEventListener('progress', function(e){

		}, true);

		// Error
		this.audioElement.addEventListener('error', function(e){
			console.log(e);
		}, true);

		// Playing
		this.audioElement.addEventListener('playing', function(e){
			App.mediator.publish('playing');
		});

		// Loading started
		this.audioElement.addEventListener('loadstart', function(e){
			App.mediator.publish('loadstart');
		});

	};

	this.mediaEvents();
};