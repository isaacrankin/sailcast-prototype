/* global App:false */

/**
 * A single feed item view
 *
 * @param {object} options the feed item attribute
 */
var FeedItemView = function(options){

	'use strict';

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

		template: {
			value: document.querySelector('#feed-item-template')
		},

		render: {

			value: function($parent){

				var item = this.template;

				//TODO: If enclosure note valid - render with broken state or don't render at all?
				if(typeof this.enclosure !== 'undefined' && this.enclosure.url){

					item.content.querySelector('img.poster').src = this.image;
					item.content.querySelector('.title').innerText = this.title;
					item.content.querySelector('.date').innerText = this.publishDate;
					item.content.querySelector('.play-btn').setAttribute('data-audio-src', this.enclosure.url);
					item.content.querySelector('.podcast-src').setAttribute('href', this.enclosure.url);

					var clone = document.importNode(item.content, true);

					this.$el = $parent.append(clone);

					this.events(this.$el, this.title);
				}

				return this;
			}
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

	this.events = function($el, title){

		$('.poster, .play-btn', $el).bind( (Modernizr.touch) ? 'touchstart' : 'click', function(e){

			var audioSource = $(e.currentTarget).data('audio-src');

			// Publish to playItem channel
			App.mediator.publish('playItem', {
				title: title,
				src: audioSource
			});
		});

		return $el;
	};

	return this;
};
