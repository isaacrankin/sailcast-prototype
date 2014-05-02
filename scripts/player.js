/* global $:false */

/**
 * The main player object
 *
 * @param options
 * @returns {Player}
 * @constructor
 */
var Player = function(options) {

	'use strict';

	var properties = {

		audioElement: {
			value: options.audioElement
		},

		play: {
			value: function(podcast){
				this.audioElement.setAttribute('src', podcast.src);
				this.audioElement.play();
				return this;
			}
		},

		pause: {
			value: function(){
				this.audioElement.pause();
				return this;
			}
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

	return this;
};