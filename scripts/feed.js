/* global App:false, FeedItem:false */

var processFeed = function(data){

    'use strict';

    var _findImage = function(nodes){

        var image = '';

        $(nodes).each(function(index, item){
            if($(item)[0].nodeName === 'itunes:image'){
                image = $(item)[0].getAttribute('href');
            }
        });

        return image;
    };

    /**
     * Set channel defaults, maybe overridden by feed item
     */
    var _channelDefaults = function(channel){

        var defaults = {
            title: '',
            image: ''
        };

        var nodes = channel[0].childNodes;

        $(nodes).each(function(index, item){
            if($(item)[0].nodeName === 'itunes:image'){
                defaults.image = $(item)[0].getAttribute('href');
            }
        });

        return defaults;
    };

    var entries = data.xmlDocument.getElementsByTagName('item'),
        channel = data.xmlDocument.getElementsByTagName('channel'),
        defaults = _channelDefaults(channel),
        feedItems = [];

    /**
     * Loop through and create feed items
     */
    for (var i = 0; i < entries.length; i++) {

        var entry = entries[i],
            entryTitle = entry.getElementsByTagName('title')[0].innerHTML,
            entryEnclosure = entry.getElementsByTagName('enclosure')[0],
            entryImage = _findImage(entry.childNodes),
            entryPublishDate = entry.getElementsByTagName('pubDate')[0].innerHTML;

        if(!entryImage){
            entryImage = defaults.image;
        }

        feedItems[i] = new FeedItem({
            title: entryTitle,
            enclosure: entryEnclosure,
            image: entryImage,
            src: (entryEnclosure) ? entryEnclosure.getAttribute('url') : '',
            publishDate: entryPublishDate
        }).render();
    }

    return feedItems;
};

/**
 * Load feeds using Google Feeds API
 */
var LoadFeeds = function(feeds, format) {

    'use strict';

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
