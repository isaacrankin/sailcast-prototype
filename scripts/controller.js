/* global
Player:false,
Mediator: false,
Feed:false,
FeedControlsView:false,
FeedView:false,
HeaderView:false,
PlayerView:false */

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

var playerView = new PlayerView({
	$el: $('#player')
});

var feed = new Feed();

var feedView = new FeedView({
	$el: $('#feed'),
	$feedControls: $('#feed .feed-controls')
});

var headerView = new HeaderView({
	$el: $('#primary-header')
});

headerView.populateFeedMenu(feeds);

// Play item channel
App.mediator.subscribe('playItem', function(arg){
	if(player.play(arg)){
		playerView.setState('playing');
		playerView.renderItem(arg);
	}else{
		alert('Cannot play podcast, invalid src.')
	}
});

// Pause item channel
App.mediator.subscribe('pauseItem', function(arg){
	player.pause();
	playerView.setState('pause');
});

// Mute channel
App.mediator.subscribe('mute', function(arg){
	player.mute();
});

// Load feeds channel
App.mediator.subscribe('loadFeeds', function(arg){
	feedView.clearFeedItems();
	feed.loadFeeds(feeds, 'xml');
});

// Change the current feed
App.mediator.subscribe('viewFeed', function(arg){

});

google.load('feeds', '1');

google.setOnLoadCallback(function(){
	App.mediator.publish('loadFeeds');
});
