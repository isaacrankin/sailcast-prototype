/* global $:false, google:false, Player:false */

'use strict';

var App = {};

var FeedItem = function(options){

	var _events = function(){

		$('.feed-item .play-btn').click(function(e){
			var audioSource = $(e.currentTarget).data('audio-src');

			App.player.play({
				src: audioSource
			});

		});
	};

	return {

		init: (function(options){

			this.$feedsContainer = $('#feed');
			this.$feedsContainer.prepend('<div class="feed-item"><h4>' + options.title + '</h4><h5>' + options.publishDate + '</h5><img src="'+ options.img + '" width="100" /><button class="play-btn" data-audio-src="'+ options.src +'">Play</button></div>');

			_events();

			return this;

		}(options))
	};
};

var processFeed = function(data){

	var entries = data.xmlDocument.getElementsByTagName('item');

	var _findImage = function(){

		var img = '';

		// Find an image!?
		$(entry.childNodes).each(function(index, item){
			if($(item)[0].nodeName === 'itunes:image'){
				img = $(item)[0].getAttribute('href');
			}
		});

		return img;
	};

	for (var i = 0; i < entries.length; i++) {

		var entry = entries[i],
			enclosure = entry.getElementsByTagName('enclosure')[0],
			img = _findImage(entry);

		var item = new FeedItem({
			title: entry.getElementsByTagName('title')[0].innerHTML,
			enclosure: enclosure,
			img: img,
			src: (enclosure) ? enclosure.getAttribute('url') : '',
			publishDate: entry.getElementsByTagName('pubDate')[0].innerHTML
		});
	}

	return entries;
};

/**
 * Load feeds using Google Feeds API
 */
var LoadFeeds = function(feeds, format) {

	var result;

	var _createFeed = function(result){
		if (!result.error && result.status.code === 200) {
			processFeed(result);
			return true;
		}else{
			console.error('Failed to load feed', result);
			return false;
		}
	};

	for (var i = 0; i < feeds.length; i++) {

		var feed = new google.feeds.Feed(feeds[i].url);

		if(format === 'xml'){
			feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
		}

		feed.load(_createFeed, result);
	}
};

var feeds = [
	{
		name: '5by5',
		url: 'http://5by5.tv/rss'
	},
	{
		name: 'ATP',
		url: 'http://atp.fm/episodes?format=rss'
	},
	{
		name: 'Twit',
		url: 'http://feeds.twit.tv/brickhouse.xml'
	},
	{
		name: 'RadioLab',
		url: 'http://feeds.wnyc.org/radiolab'
	},
	{
		name: 'Ted Radio Hour',
		url: 'http://www.npr.org/rss/podcast.php?id=510298'
	},
	{
		name: 'The Gaurdian - Techweekly',
		url: 'http://www.theguardian.com/technology/series/techweekly/rss'
	},
	{
		name: 'Hanselminutes',
		url: 'http://feeds.feedburner.com/HanselminutesCompleteMP3?format=xml'
	}
];

google.load('feeds', '1');

google.setOnLoadCallback(function(){
	new LoadFeeds(feeds, 'xml');
});

App.player = new Player({});