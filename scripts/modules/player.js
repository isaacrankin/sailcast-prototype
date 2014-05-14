/* global $:false */

/**
 * The main player object
 */
var Player = function(options) {

	'use strict';

	var _validateSrc = function(mediaElement, src){

		// find type of file
		var spl = src.split('.'),
			type = 'audio/'+ spl[(spl.length - 1)];

		return (mediaElement.canPlayType(type) === '') ? false : true;
	};

	var properties = {

		$el: {
			value: options.$el
		},

		audioElement: {
			value: options.audioElement
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

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

	return this;
};
