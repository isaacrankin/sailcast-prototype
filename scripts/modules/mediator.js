var Mediator = function(){

    'use strict';

    var subscribe = function(channel, fn){
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({
            context: this,
            callback: fn
        });
        return this;
    },

    publish = function(channel){
        if (!this.channels[channel]) {
            return false;
        }

        var args = Array.prototype.slice.call(arguments, 1);

        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        console.log('Mediator - publish channel: '+ channel);

        return this;
    };

    return {
        channels: {},
        publish: publish,
        subscribe: subscribe,
        installTo: function(obj){
            obj.subscribe = subscribe;
            obj.publish = publish;
        }
    };
};
