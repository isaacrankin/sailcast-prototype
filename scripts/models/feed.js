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
	 * Get podcast image
	 *
	 * @param  {xml node} entry
	 * @return {string}
	 */
	var _getImage = function(entry){

		var image = '';

		$(entry.childNodes).each(function(index, item){
			if($(item)[0].nodeName === 'itunes:image'){
				image = $(item)[0].getAttribute('href');
			}
		});

		return image;
	};

	/**
	 * Get podcast title
	 *
	 * @param  {xml node} entry
	 * @return {string}
	 */
	var _getTitle = function(entry){
		return entry.getElementsByTagName('title')[0].innerHTML;
	};

	/**
	 * Get podcast enclosure/media
	 *
	 * @param  {xml node} entry
	 * @return {string}
	 */
	var _getEnclosure = function(entry){

		var encolsure = entry.getElementsByTagName('enclosure')[0];

		if(encolsure){
			return {
				url: encolsure.getAttribute('url'),
				length: encolsure.getAttribute('length'),
				type: encolsure.getAttribute('type')
			}
		}else{
			return null;
		}
	};

	/**
	 * Get podcast publication date
	 *
	 * @param  {xml node} entry
	 * @return {string}
	 */
	var _getPubDate = function(entry){
		return entry.getElementsByTagName('pubDate')[0].innerHTML;
	};

	/**
	 * Get the feed ID by mutating the title
	 *
	 * @param  {xml node} channel
	 * @return {string}
	 */
	var _getFeedID = function(channel){
		var feedTitle = channel[0].getElementsByTagName('title')[0].innerHTML;
		return feedTitle.toLowerCase().replace(/[|&;:$%@"<>()+,]/g, "").replace(/ /g, '-');
	};

	/**
	 * Process a single RSS feed base on the Itunes feed specification:
	 * https://www.apple.com/au/itunes/podcasts/specs.html#rss
	 *
	 * @param  {xml} data
	 * @return {array}
	 */
	var _processFeed = function(data){

		var entries = data.xmlDocument.getElementsByTagName('item'),
			entriesLength = entries.length,
			channel = data.xmlDocument.getElementsByTagName('channel'),
			feedItems = [],

			// Create feed ID
			feedID = _getFeedID(channel),

			//TODO: Convert to using a <template>
			//TODO: pass in parent element?
			$feedsContainer = $('<div id="'+ feedID +'" class="feed-items"></div>').appendTo('#feed .inner');

		 // Loop through and create feed items
		for (var i = 0; i < entriesLength; i++) {

			//TODO: New Feeditem?
			var entry 		= entries[i],
				title 		= _getTitle(entry),
				enclosure 	= _getEnclosure(entry),
				image 		= _getImage(entry),
				pubDate 	= _getPubDate(entry);

			// Publish new feed item
			App.mediator.publish('newFeedItem', {
				$feedsContainer: $feedsContainer,
				feeditem: {
					title: title,
					enclosure: enclosure,
					image: image,
					publishDate: pubDate
				}
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
