/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
(function ($, serenity) {
    serenity.overlay = {
        /// <module>serenity.overlay</module>
        /// <summary>Module to show or hide an overlay to notify the end user to wait for an action to complete.</summary>
        /// <version added="2016.1" updated="2016.1" />

        show: function (e) {
            /// <function>show</function>
            /// <summary>Show an overlay.</summary>
            /// <param name="e.element" type="jQuery Object" optional="true" default="$('body')">The element where the overlay will be displayed.</param>
            /// <param name="e.text" type="String" optional="true">Text to display in the overlay.</param>
            /// <param name="e.cssClass" type="String" optional="true">A CSS class to add to the overlay text element.</param>
            /// <example for="JavaScript" description="Display an overlay over the entire page.">
            /// serenity.overlay.show({ text: "Loading..." });
            /// </example>
            /// <example for="JavaScript" description="Display an overlay over a specific element.">
            /// serenity.overlay.show({ element: $("#table"), text: "Loading..." });
            /// </example>
            /// <version added="2016.1" updated="2016.1" />

            var e = $.extend({ element: $("body"), text: "", cssClass: "" }, e);

            return $.Deferred(function (deferred) {
                var overlay = e.element.find(".jx-overlay");
                if (overlay.length === 0) {
                    overlay = $(serenity.format("<div class='jx-overlay'><div class='ui-widget-overlay ui-front'></div><div class='jx-overlay-text'>{0}</div></div>", e.text));
                    e.element.append(overlay);
                } else {
                    overlay.find(".jx-overlay-text").attr("class", "jx-overlay-text");
                    overlay.find(".jx-overlay-text").text(e.text);
                }
                if (e.cssClass.length > 0) {
                    overlay.find(".jx-overlay-text").addClass(e.cssClass);
                }
                overlay.show();

                setTimeout(function () {
                    deferred.resolve();
                }, 10);
            }).promise();
        },

        hide: function (e) {
            /// <function>hide</function>
            /// <summary>Hide an overlay.</summary>
            /// <param name="e.element" type="jQuery Object" optional="true" default="$('body')">The element where the overlay is located.</param>
            /// <example for="JavaScript" description="Hide an overlay that has been displayed over the entire page.">
            /// serenity.overlay.hide();
            /// </example>
            /// <example for="JavaScript" description="Hide an overlay that has been displayed over a specific element.">
            /// serenity.overlay.hide({ element: $("#table") });
            /// </example>
            /// <version added="2016.1" updated="2016.1" />

            var e = $.extend({ element: $("body") }, e);
            var overlay = e.element.find(".jx-overlay");
            if (overlay.length > 0) {
                overlay.remove();
            }
        }
    };
})(window.jQuery, window.serenity);
