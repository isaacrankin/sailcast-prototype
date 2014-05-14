var expect = chai.expect;

// Player module
describe("Player", function() {
	describe("constructor", function() {

		// Create a new audio element
		var newAudioElement = document.createElement('audio');
		newAudioElement.setAttribute('id', 'native-player');
		document.body.insertBefore(newAudioElement);

		var player = new Player({
			audioElement: document.getElementById('native-player')
		});

		it("seekIncrement should return a number", function() {
			expect(player.seekIncrement).to.be.a('number');
		});

		it("getReadyState should return a number between 0 and 4", function() {
			expect(player.getReadyState()).to.be.within(0,4);
		});

		it("play should return false", function() {
			expect(player.play({ src: 'http://example.com/podcast' })).to.equal(false);
		});

		// How to test DOM or Browser dependent conditions?
		// play depends on if Browser supports podcast file format

	});
});