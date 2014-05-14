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

			console.log(self.audioElement.duration);
			console.log(self.audioElement.currentTime);

			App.mediator.publish('playback', {
				currentTime: self.audioElement.currentTime,
				currentTimeSeconds: Math.round( self.audioElement.currentTime ),
				currentTimeMinutes: Math.floor( (self.audioElement.currentTime/60) )
			});

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

		if(_validateSrc(this.audioElement, podcast.src)){

			this.audioElement.setAttribute('src', podcast.src);
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

	this.mute = function(){
		this.audioElement.muted = (this.audioElement.muted) ? false : true;
		return this;
	};

	this.seekByIncrement = function(direction, increment){

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

	return this;
};
