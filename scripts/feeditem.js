/* global $:false, App:false */

/**
 * A single feed item
 */
var FeedItem = function(options){

	'use strict';

	var _events = function($el){

		$('.play-btn', $el).click(function(e){

			var audioSource = $(e.currentTarget).data('audio-src');

			// This aint't right!!?? - breaking scope?
			App.player.play({
				src: audioSource
			});

		});

		return $el;
	};

	var properties = {

		$el: {
			value: undefined,
			writable: true
		},

		title: {
			value: options.title
		},

		publishDate: {
			value: options.publishDate
		},

		enclosure: {
			value: options.enclosure
		},

		image: {
			value: options.image
		},

		src: {
			value: options.src
		},

		create: {

			value: function(){
				this.$feedsContainer = $('#feed');
				this.$el = this.$feedsContainer.prepend('<div class="feed-item"><h4>' + this.title + '</h4><h5>' + this.publishDate + '</h5><img src="'+ this.image + '" width="100" /><button class="play-btn" data-audio-src="'+ this.src +'">Play</button></div>');
				_events(this.$el);
				return this;
			}
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

	return this;
};