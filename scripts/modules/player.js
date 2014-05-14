/* global $:false */

/**
 * The main player object
 */
var Player = function(options) {

	'use strict';

	var _validateSrc = function(mediaElement, src){

		if(typeof src !== 'string'){
			return false;
		}

		// find type of file
		var spl = src.split('.'),
			type = 'audio/'+ spl[(spl.length - 1)];

		return (mediaElement.canPlayType(type) === '') ? false : true;
	};

	var properties = {

		audioElement: {
			value: options.audioElement
		},

		seekIncrement: {
			value: 10
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

	this.getReadyState = function(){
		return this.audioElement.readyState;
	};

	this.play = function(podcast){

		if(_validateSrc(this.audioElement, podcast.src)){

			this.audioElement.setAttribute('src', podcast.src);
			this.audioElement.play();

			return this;

		}else{
			return false;
		}
	};

	this.pause = function(){
		this.audioElement.pause();
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
