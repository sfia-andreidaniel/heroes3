var Events = (function () {
    function Events() {
        this._listeners = {};
    }
    Events.prototype._createListener = function (event) {
        this._listeners[event] = this._listeners[event] || {
            "global": [],
            "once": [],
            "count": 0
        };

        return this._listeners[event];
    };

    Events.prototype.addListener = function (event, listener) {
        var grp = this._createListener(event);

        grp.global.push(listener);
        grp.count++;

        this.emit('newListener', event, listener);

        return this;
    };

    Events.prototype.on = function (event, listener) {
        return this.addListener(event, listener);
    };

    Events.prototype.once = function (event, listener) {
        var grp = this._createListener(event);
        grp.once.push(listener);
    };

    Events.prototype.removeListener = function (event, listener) {
        var grp;

        if (this._listeners[event]) {
            grp = this._createListener(event);
            for (var i = 0, len = grp.global.length; i < len; i++)
                if (grp.global[i] == listener) {
                    grp.global.splice(i, 1);
                    this.emit('removeListener', event, listener);
                    return this;
                }
            for (var i = 0, len = grp.once.length; i < len; i++)
                if (grp.once[i] == listener) {
                    grp.once.splice(i, 1);
                    this.emit('removeListener', event, listener);
                    return this;
                }
        }

        return this;
    };

    Events.prototype.removeAllListeners = function (event) {
        if (typeof event === "undefined") { event = null; }
        if (event !== null) {
            if (this._listeners[event])
                delete this._listeners[event];
        } else {
            this._listeners = {};
        }
    };

    Events.prototype.emit = function (event) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        var anyCalled = false;

        if (this._listeners[event]) {
            while (this._listeners[event].once.length) {
                this._listeners[event].once[0].apply(this, args);
                this._listeners[event].once.splice(0, 1);
                this._listeners[event].count--;
                anyCalled = true;
            }
            for (var i = 0, len = this._listeners[event].global.length; i < len; i++) {
                this._listeners[event].global[i].apply(this, args);
                anyCalled = true;
            }
        }

        return anyCalled;
    };

    Events.listenerCount = function (emitter, event) {
        return emitter._listeners[event] ? emitter._listeners[event].count : 0;
    };
    return Events;
})();
