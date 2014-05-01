/* global $:false */

var Player = function(options){

	'use strict';

	return {

		el: document.getElementById('player'),

		audioObj: document.getElementById('native-player'),

		init: (function(options){
			return this;
		}(options)),

		play: function(podcast){
			$(this.audioObj).attr('src', podcast.src);
			this.audioObj.play();
		}
	};
};