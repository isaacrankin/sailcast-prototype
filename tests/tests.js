var expect = chai.expect;

// DataManager
describe("DataManager", function() {

});

// FeedManager
describe("FeedManager", function() {

	describe(".getFeeds()", function() {

		var feedManager = new FeedManager({});

		it("should return an array of feeds", function(){
			expect(feedManager.getFeeds()).to.be.a('array');
		});
	});
});

// Player module
describe("Player", function() {
	describe("constructor", function() {

		// Create a new audio element
		var newAudioElement = document.createElement('audio');
		newAudioElement.setAttribute('id', 'native-player');
		document.body.insertBefore(newAudioElement);

		// Create new instance of Player module
		var player = new Player({
			audioElement: document.getElementById('native-player')
		});

		it("seekIncrement should return a number", function() {
			expect(player.seekIncrement).to.be.a('number');
		});

		// Audio support is required for these tests, not available for Phantom JS]
		// https://github.com/ariya/phantomjs/wiki/Supported-Web-Standards
		if(Modernizr.audio){
			it("getReadyState should return a number between 0 and 4", function() {
				expect(player.getReadyState()).to.be.within(0,4);
			});

			it("play should return false", function() {
				expect(player.play({ src: 'http://example.com/podcast' })).to.equal(false);
			});
		}

	});
});