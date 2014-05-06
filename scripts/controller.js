/* global Player:false, Mediator: false, Feed:false */

'use strict';

// Hardcoded feeds are temporary
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

var App = {
	mediator: new Mediator()
};

var player = new Player({
	$el: $('#player'),
	audioElement: document.getElementById('native-player')
});

var primaryFeed = new Feed();

// Play item channel
App.mediator.subscribe('playItem', function(arg){
	player.play(arg);
});

google.load('feeds', '1');

google.setOnLoadCallback(function(){
	primaryFeed.loadFeeds(feeds, 'xml');
});