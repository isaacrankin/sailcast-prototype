// TODO: Find a better way to avoid this list for jsHint

/* global
Player:false,
Mediator: false,
Feed:false,
FeedControlsView:false,
FeedView:false,
HeaderView:false,
PlayerView:false,
FeedManager:false,
DataManager:false */

'use strict';

// TODO: Create a keyboard controls module - play, pause, next, prev, scan, mute

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

// Declare models & views
// ---------------------------------------------------
var App = {
	mediator: new Mediator()
};

var db = new DataManager({
	dbName: 'SailCast'
});

var player = new Player({
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

// Player related channels
// ---------------------------------------------------

// Play item
App.mediator.subscribe('playItem', function(arg){

	var playItem = player.play(arg);

	playerView.renderItem(arg);

	if(!playItem){
		playerView.reset();
		window.alert('ERROR: Cannot play podcast, invalid src.');
	}

});

// Loading started
App.mediator.subscribe('loadstart', function(e){
	playerView.setState('loading');
});

// Playback loop
App.mediator.subscribe('timeupdate', function(arg){
	playerView.updateScrubber(arg);
});

// Media has began playing
App.mediator.subscribe('playing', function(arg){
	playerView.setState('playing');
});

// Stop item
App.mediator.subscribe('stopItem', function(arg){
	player.stop();
	playerView.reset();
});

// Pause item channel
App.mediator.subscribe('pauseItem', function(arg){
	player.pause();
	playerView.setState('pause');
});

// Mute channel
App.mediator.subscribe('mute', function(arg){
	player.mute(arg.mute);
	playerView.toggleMute(arg.mute);
});

// Seek by an increment
App.mediator.subscribe('seekIncrement', function(arg){
	if(player.getReadyState() > 0){
		player.seekByIncrement(arg.direction, arg.increment);
	}
});

App.mediator.subscribe('seekToPercentage', function(arg){
	if(player.getReadyState() > 0){
		player.seekToPercentage(arg.percentage);
	}
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
