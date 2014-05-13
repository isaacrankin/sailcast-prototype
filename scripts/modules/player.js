/* global $:false */

/**
 * The main player object
 */
var Player = function(options) {

	'use strict';

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

		if(typeof podcast === 'object' && podcast.src){
			this.audioElement.setAttribute('src', podcast.src);
		}

		this.audioElement.play();
		return this;
	};

	this.pause = function(){
		this.audioElement.pause();
		return this;
	};

	this.mute = function(){
		if(this.audioElement.volume === 0){
			this.audioElement.volume = 1;
		}else{
			this.audioElement.volume = 0;
		}
		return this;
	};

	return this;
};
