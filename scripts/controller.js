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

// Play item channel
App.mediator.subscribe('playItem', function(arg){

	//TODO: player state could be managed better - preventing re-render
	var playerState = player.state;

	if(player.play(arg)){

		//TODO: show a loading state

		if(playerState !== 'paused' ) {
			playerView.renderItem(arg);
		}

		playerView.setState('loading');

	}else{
		window.alert('Cannot play podcast, invalid src.');
	}
});

// Playback loop
App.mediator.subscribe('playback', function(arg){
	playerView.updateScrubber(arg);

	// TODO: refactor so only player module reports player state
	if(player.state === 'playing'){
		playerView.setState('playing');
	}
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
	player.mute();
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
