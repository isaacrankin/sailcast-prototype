/* global App:false */

/**
 * A single feed item
 */
var FeedItem = function(options){

	'use strict';

	var _events = function($el, title){

		$('.play-btn', $el).click(function(e){

			var audioSource = $(e.currentTarget).data('audio-src');

            // Publish to playItem channel
            App.mediator.publish('playItem', {
                title: title,
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

		render: {

			value: function(){
				this.$feedsContainer = $('#feed');
				this.$el = $('<div class="feed-item"><header><img class="poster" src="'+ this.image + '" width="100" /><h4>' + this.title + '</h4><h5>' + this.publishDate + '</h5></header><button class="play-btn" data-audio-src="'+ this.src +'">Play</button></div>').appendTo(this.$feedsContainer);

				_events(this.$el, this.title);

				return this;
			}
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

	return this;
};
