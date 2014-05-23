/// <reference path="Loader/IAjaxConfig" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Loader = (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        (function (me) {
            setInterval(function () {
                if (me.pendingRequests > 0 && me.activeRequests == 0)
                    me.next();
            })(100);
        })(this);
        this.numRequests = 0;
        this.activeRequests = 0;
        this.pendingRequests = 0;
    }
    Loader.prototype.ajax = function (config) {
        this.numRequests++;
        this.pendingRequests++;

        this.chain.push(config);
    };

    Loader.prototype.next = function () {
        me.activeRequests++;
        me.pendingRequests--;

        var cfg = this.chain.splice(0, 1)[0], success = cfg.success || function (data) {
        }, error = cfg.error || function () {
        };

        (function (me) {
            cfg.success = function (data) {
                me.activeRequests--;

                if (success)
                    success(data);
            };

            cfg.error = function () {
                me.activeRequests--;

                if (error)
                    error;
            };
        })(this);

        $.ajax(cfg.url, cfg);
    };
    return Loader;
})(Events);

var $$ = new Loader();
