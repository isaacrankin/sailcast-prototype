/* global App:false */

/**
 * The main player object
 */
var Player = function(options) {

	'use strict';

	var _validateSrc = function(mediaElement, src){

		if(typeof src !== 'string' || src === ''){
			return false;
		}

		// find type of file by getting the file extension
		var spl = src.split('.'),
			type = 'audio/'+ spl[(spl.length - 1)];

		return (mediaElement.canPlayType(type) === '') ? false : true;
	};

	var _playbackValues = function(audioElement){

		var currentTime = audioElement.currentTime,
			duration = audioElement.duration,
			minutes = Math.floor( currentTime/60 );

		// TODO: Return buffered as a %
		if(audioElement.buffered.length === 1){
//			console.log(audioElement.buffered.start(0));
//			console.log(audioElement.buffered.end(0));
		}

		// TODO: format time correctly with leading zeros e.g. 00:00

		return {
			currentTime: currentTime,
			duration: duration,
			minutes: minutes,
			currentTimeSeconds: Math.round( currentTime ) - (minutes * 60),
			currentTimeMinutes: Math.floor( (currentTime/60) ),
			progress: Math.round( (currentTime / (duration/100)) * 100) / 100
		};
	};

	var properties = {

		audioElement: {
			value: options.audioElement
		},

		playbackLoopInterval: {
			value: 500
		},

		seekIncrement: {
			value: 10
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

	this.playCallback = function(){

		var self = this;

		this.playbackLoop = setTimeout(function(){

			var playbackValues = _playbackValues(self.audioElement);

			// Publish playback values, used by player view for scrubber etc.
			App.mediator.publish('playback', playbackValues);

			//TODO: Handle podcast finished playing - reset player or play next?

			// Call itself
			self.playCallback();

		}, this.playbackLoopInterval);
	};

	this.startPlaybackLoop = function(){
		this.stopPlaybackLoop();
		this.playCallback();
	};

	this.stopPlaybackLoop = function(){
		clearTimeout(this.playbackLoop);
	};

	this.play = function(podcast){

		// Play the given podcast if valid
		if(typeof podcast === 'object' && _validateSrc(this.audioElement, podcast.src)){

			this.audioElement.setAttribute('src', podcast.src);
			this.audioElement.muted = false;
			this.audioElement.play();
			this.startPlaybackLoop();
			this.currentItem = podcast;
			this.state = 'playing';

			return this;

		// Try play a paused item
		}else if(this.state === 'paused' && typeof this.currentItem !== 'undefined'){

			this.audioElement.play();
			this.startPlaybackLoop();
			this.state = 'playing';

			return this;

		}else{
			return false;
		}
	};

	this.pause = function(){
		this.stopPlaybackLoop();
		this.audioElement.pause();
		this.state = 'paused';
		return this;
	};

	this.stop = function(){
		// Removing attribute value stops download of media
		this.audioElement.setAttribute('src', '');
		this.stopPlaybackLoop();
		this.state = 'stopped';
		return this;
	};

	this.mute = function(){
		this.audioElement.muted = (this.audioElement.muted) ? false : true;
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
};
