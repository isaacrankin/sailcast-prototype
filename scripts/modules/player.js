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

		$el: {},

		audioElement: {
			value: options.audioElement
		},

		play: {
			value: function(podcast){
				this.audioElement.setAttribute('src', podcast.src);
				this.renderItem(podcast);
				this.audioElement.play();
				return this;
			}
		},

		pause: {
			value: function(){
				this.audioElement.pause();
				return this;
			}
		},

		renderItem: {
			value: function(podcast){
				$('.current-podcast h4', this.$el).html(podcast.title);
			}
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

	return this;
};