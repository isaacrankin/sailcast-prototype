/* global App:false */

var FeedItem = function(options){

	'use strict';

	/**
	 * Podcast fields required
	 *
	 * All fields are required unless otherwise specified
	 *
	 * title
	 * link
	 * pubDate
	 * imageURL
	 * audioURL
	 * author (optional)
	 * guid (optional)
	 *
	 * These feilds are informed by the Itunes RSS spec for podcasts:
	 * https://www.apple.com/au/itunes/podcasts/specs.html#rss
	 */

	var properties = {

		$el: {
			value: undefined,
			writable: true
		},

		title: {
			value: options.title
		},

		pubDate: {
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
		}
	};

	// Define the properties
	Object.defineProperties(this, properties);

	return this;
};
