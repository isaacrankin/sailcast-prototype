var expect = chai.expect;

var App = {
	mediator: new Mediator()
};

// Player module
describe("Player", function() {

	var player;

	describe("constructor", function(){

		// Create a new audio element
		var newAudioElement = document.createElement('audio');
		newAudioElement.setAttribute('id', 'native-player');
		document.body.insertBefore(newAudioElement);

		// Create new instance of Player module
		player = new Player({
			audioElement: document.getElementById('native-player')
		});

		it("player should have an audioElement in the DOM", function() {
			expect(player.audioElement).to.equal(document.getElementById('native-player'));
		});

	});

	describe("audio features", function() {

		it("seekIncrement should return a number", function() {
			expect(player.seekIncrement).to.be.a('number');
		});

		// Audio support is required for these tests, not available for Phantom JS]
		// https://github.com/ariya/phantomjs/wiki/Supported-Web-Standards
		if(Modernizr.audio){

			it("play should only play valid audio URLs", function() {
				expect(player.play({ src: 'http://example.com/podcast' })).to.equal(false);
				expect(player.play({ src: 'http://cdn.5by5.tv/audio/broadcasts/frequency/2014/frequency-167.mp3' })).to.equal(player);
			});

			it("getReadyState should return a number between 0 and 4", function() {
				expect(player.getReadyState()).to.be.within(0,4);
			});

			it("only accept valid audio src URLs and test if client supports it", function(){
				expect(player.__tests__._validateSrc(player.audioElement, 'http://example.com/podcast.mp3')).to.equal(true);
			});
		}

		it("should mute the audio DOM element", function(){

			// Mute it
			expect(player.mute(true).audioElement.muted).equal(true);

			// Toggle mute / un mute
			expect(player.mute('toggle').audioElement.muted).equal(false);

		});
	});

	describe("utilities", function(){

		it("_formatTime should return time in a hh:mm:ss format", function(){
			expect(player.__tests__._formatTime(1, 5).seconds).to.equal(1);
			expect(player.__tests__._formatTime(61, 120).minutes).to.equal(1);
			expect(player.__tests__._formatTime(61, 120).hours).to.equal(0);
		});
	});
});