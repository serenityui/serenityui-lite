/**
 * Serenity UI v2017.1.170720 (https://www.serenityui.com)
 */
(function ($) {
    "use strict";

    $.widget("serenity.notificationpanel", $.serenity.widget, {
        /// <core>serenity.notificationpanel</core>
        /// <inherits url="serenity.widget.html">serenity.widget</inherits>
        /// <typedef>interface Notificationpanel extends Widget</typedef>
        /// <typedef for="JQuery">serenityNotificationpanel(): JQuery</typedef>
        /// <typedef for="JQuery">serenityNotificationpanel(options: any): JQuery</typedef>
        /// <summary>The notification panel displayed to the user.</summary>
        /// <version added="2016.1" updated="2016.1" state="prototype" />

        _timeout: null,
        _notification: null,
        _direction: null,

        show: function (notification) {
            /// <summary>Show the notification panel.</summary>
            /// <version added="2016.1" updated="2016.1" state="prototype" />

            var that = this;

            this._notification = notification;

            // Determine the direction to use when displaying the notification.
            var direction = notification.options.animation.show === "bottom"
                ? "down"
                : notification.options.animation.show === "top"
                    ? "up"
                    : notification.options.animation.show;

            // Show the notification.
            that.element.show("slide", { direction: direction }, function () {
                // When the show is complete, if the hide action is "click", then
                // add a click event handler on the element to hide the notification.

                that._trigger.call(that, "show");

                if (notification.options.hideOnClick) {
                    that.element.addClass("sr-hide-on-click");
                    
                    that.element.on("click.notificationpanel", function (event) {
                        that._trigger.call(that, "click", event);
                        clearTimeout(that._timeout);
                        that.hide.call(that);
                    });
                }
            });

            if (notification.options.duration > 0) {
                this._timeout = setTimeout(function () {
                    that.hide.call(that);
                }, notification.options.duration);
            }
        },

        hide: function () {
            /// <summary>Hide the notification panel.</summary>
            /// <version added="2016.1" updated="2016.1" state="prototype" />

            var that = this;

            // If there is a click event for the notification, then remove it.
            that.element.off("click.notificationpanel");

            if (this.element.is(":visible")) {
                var direction = this._notification.options.animation.hide === "bottom"
                    ? "down"
                    : this._notification.options.animation.hide === "top"
                        ? "up"
                        : this._notification.options.animation.hide;

                // Hide the element.
                this.element.hide("slide", { direction: direction }, function () {
                    that._trigger.call(that, "hide");

                    that.destroy();
                });
            }
        }
    });
})(window.jQuery);
