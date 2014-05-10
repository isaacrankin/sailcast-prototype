/* global App:false */

var HeaderView = function(options){

    'use strict';

    var properties = {

        $el:{
            value: options.$el
        }

    };

    Object.defineProperties(this, properties);

    this.events = function(){
        $('.refresh-btn', this.$el).click(function(e){
            App.mediator.publish('loadFeeds');
        });
    };

    this.events();
};
