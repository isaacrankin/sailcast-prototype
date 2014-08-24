/* global App:false, FeedItem:false, google:false */

var Feed = function(){

	'use strict';

	var properties = {
		feedItems: {
			value: [],
			writable: true,
			enumerable: true
		}
	};

	/**
	 * Get the feed ID by mutating the title
	 *
	 * @param  {xml node} channel
	 * @return {string}
	 */
	var _getFeedID = function(channel){
		var feedTitle = channel[0].getElementsByTagName('title')[0].innerHTML;
		return feedTitle.toLowerCase().replace(/[|&;:$%@"<>()+,]/g, '').replace(/ /g, '-');
	};

	/**
	 * Get all podcast properties from XML node
	 *
	 * @param  {[type]} entry The podcast XML node
	 * @return {[type]}       All of the podcast properties
	 */
	var _getItemValues = function(entry){

		var newItem = {};

		$(entry.childNodes).each(function(index, item){

			switch(item.nodeName){

				case 'title':
					newItem.title = $(item).text();
				break;

				case 'pubDate':
					newItem.publishDate = $(item).text();
				break;

				case 'enclosure':
					newItem.enclosure = {
						url: item.getAttribute('url'),
						length: item.getAttribute('length'),
						type: item.getAttribute('type')
					};
				break;

				case 'itunes:image':
					newItem.image = $(item)[0].getAttribute('href');
				break;
				
			}
		});

		return newItem;
	};

	/**
	 * Process a single RSS feed base on the Itunes feed specification:
	 * https://www.apple.com/au/itunes/podcasts/specs.html#rss
	 *
	 * @param  {xml} data
	 * @return {array}
	 */
	var _processFeed = function(data){

		var channel = data.xmlDocument.getElementsByTagName('channel'),
			entries = data.xmlDocument.getElementsByTagName('item'),
			entriesLength = entries.length,
			feedItems = [],

			// Create feed ID
			feedID = _getFeedID(channel),

			//TODO: Convert to using a <template>
			//TODO: pass in parent element?
			$feedContainer = $('<div id="'+ feedID +'" class="feed-items"></div>').appendTo('#feed .inner');

		var channelDefaults = _getItemValues(channel[0]);

		 // Loop through and create feed items
		for (var i = 0; i < entriesLength; i++) {

			var podcastValues = _getItemValues(entries[i]);

			// Merge podcast values into channel defaults
			var podcast = $.extend(channelDefaults, podcastValues);

			// Publish new feed item
			App.mediator.publish('newFeedItem', {
				$feedContainer: $feedContainer,
				feeditem: podcast
			});
		}

		return feedItems;
	};

	Object.defineProperties(this, properties);

	/**
	 * Loads RSS feeds using Google Feeds
	 *
	 * @param  {object} feeds
	 * @param  {string} format
	 * @return {array}
	 */
	this.loadFeeds = function(feeds, format) {

		var result,
			self = this,
			feedCount = feeds.length;

		/**
		 * Google Feed callback
		 */
		var callback = function(result){

			if (!result.error && result.status.code === 200) {
				_processFeed(result);
				return true;
			}else{
				console.error('Failed to load feed', result);
				return false;
			}
		};

		for (var i = 0; i < feedCount; i++) {

			var feed = new google.feeds.Feed(feeds[i].url);

			if(format === 'xml'){
				feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
			}else{
				feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
			}

			feed.load(callback, result);
		}

		return this;
	};
};
