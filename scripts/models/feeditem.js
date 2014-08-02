// /* global App:false */
//
// /**
//  * A single feed item
//  */
// var FeedItem = function(options){
//
// 	'use strict';
//
// 	var properties = {
//
// 		$el: {
// 			value: undefined,
// 			writable: true
// 		},
//
// 		title: {
// 			value: options.title
// 		},
//
// 		publishDate: {
// 			value: options.publishDate
// 		},
//
// 		enclosure: {
// 			value: options.enclosure
// 		},
//
// 		image: {
// 			value: options.image
// 		},
//
// 		src: {
// 			value: options.src
// 		},
//
// 		render: {
//
// 			value: function($container){
//
// 				this.$feedsContainer = $container;
//
//
// 				console.log($('#feed-item-template'));
//
//
// 				this.$el = $('<div class="feed-item"><img class="poster" src="'+ this.image + '" /><div class="title"><h4>' + this.title + '</h4><h5>' + this.publishDate + '</h5></div><button class="play-btn icon-play" data-audio-src="'+ this.src +'"><span class="label">play</span></button></div>').appendTo(this.$feedsContainer);
//
// 				this.events(this.$el, this.title);
//
// 				return this;
// 			}
// 		}
// 	};
//
// 	// Define the properties
// 	Object.defineProperties(this, properties);
//
// 	this.events = function($el, title){
//
// 		$('.play-btn', $el).click(function(e){
//
// 			var audioSource = $(e.currentTarget).data('audio-src');
//
// 			// Publish to playItem channel
// 			App.mediator.publish('playItem', {
// 				title: title,
// 				src: audioSource
// 			});
// 		});
//
//
// 		$('.poster', $el).bind( (Modernizr.touch) ? 'touchstart' : 'click', function(e){
//
// 			var audioSource = $(e.currentTarget).data('audio-src');
//
// 			// Publish to playItem channel
// 			App.mediator.publish('playItem', {
// 				title: title,
// 				src: audioSource
// 			});
//
// 		});
//
//
// 		return $el;
// 	};
//
// 	return this;
// };
