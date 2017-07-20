/**
 * Serenity UI v2017.1.170720 (https://www.serenityui.com)
 */
(function ($) {
    "use strict";

    $.widget("serenity.notification", $.serenity.widget, {
        /// <widget>serenity.notification</widget>
        /// <inherits url="serenity.widget.html">serenity.widget</inherits>
        /// <typedef>interface Notification extends Widget</typedef>
        /// <typedef for="JQuery">serenityNotification(): JQuery</typedef>
        /// <typedef for="JQuery">serenityNotification(options: any): JQuery</typedef>
        /// <summary>The notification widget displays an unobstrusive notification to the user.</summary>
        /// <element>div</element>
        /// <gettingstarted>
        /// <![CDATA[
        /// <div id="notification">
        ///   <div>
        ///     Hello from Serenity UI!
        ///   </div>
        /// </div>
        ///
        /// <script>
        ///   var notification = $("#notification").serenityNotification().data("serenityNotification");
        ///   notification.show();
        /// </script>
        /// ]]>
        /// </gettingstarted>
        /// <version added="2016.1" updated="2016.1" />

        _container: null,

        html: {
            container: "<div class='sr-notification-container'></div>",
            instance: "<div class='ui-widget ui-widget-content sr-notification-instance' style='display:none;'></div>",
            instanceContainer: "<div class='sr-notification-instance-container'></div>"
        },

        options: {
            position: {
                /// <option>position.top</option>
                /// <datatype>Number</datatype>
                /// <default>null</default>
                /// <summary>
                /// The number of pixels from the top of the document to display notifications.
                /// If null, then the notification will appear at the bottom of the document.
                /// </summary>
                /// <version added="2016.1" updated="2016.1" />
                top: null,

                /// <option>position.left</option>
                /// <datatype>Number</datatype>
                /// <default>null</default>
                /// <summary>
                /// The number of pixels from the left of the document to display notifications.
                /// If null, then the notification will appear at the right of the document.
                /// </summary>
                /// <version added="2016.1" updated="2016.1" />
                left: null,

                /// <option>position.bottom</option>
                /// <datatype>Number</datatype>
                /// <default>20</default>
                /// <summary>
                /// The number of pixels from the bottom of the document to display notifications.
                /// </summary>
                /// <version added="2016.1" updated="2016.1" />
                bottom: 20,

                /// <option>position.right</option>
                /// <datatype>Number</datatype>
                /// <default>20</default>
                /// <summary>
                /// The number of pixels from the right of the document to display notifications.
                /// </summary>
                /// <version added="2016.1" updated="2016.1" />
                right: 20
            },

            animation: {
                /// <option>animation.show</option>
                /// <datatype>String</datatype>
                /// <default>"bottom"</default>
                /// <summary>The part of the notification element that is displayed first when showing the notification.</summary>
                /// <version added="2016.1" updated="2016.1" />
                show: "bottom",

                /// <option>animation.hide</option>
                /// <datatype>String</datatype>
                /// <default>"top"</default>
                /// <summary>The part of the notification element that is hidden last when hiding the notification.</summary>
                /// <version added="2016.1" updated="2016.1" />
                hide: "bottom"
            },

            /// <option>cssClass</option>
            /// <datatype>String</datatype>
            /// <default>""</default>
            /// <summary>CSS Classes for the notification element.</summary>
            /// <version added="2016.1" updated="2016.1" />
            cssClass: "",

            /// <option>hideOnClick</option>
            /// <datatype>Boolean</datatype>
            /// <default>true</default>
            /// <summary>Hide the notification when the user clicks anywhere in the window.</summary>
            /// <version added="2016.1" updated="2016.1" />
            hideOnClick: true,

            /// <option>duration</option>
            /// <datatype>Number</datatype>
            /// <default>3000</default>
            /// <summary>The number of miliseconds that the notification is displayed.  Set to 0 to disable auto hide.</summary>
            /// <version added="2016.1" updated="2016.1" />
            duration: 3000,

            /// <option>width</option>
            /// <datatype>Number</datatype>
            /// <default>200</default>
            /// <summary>The width of the notification element.</summary>
            /// <version added="2016.1" updated="2016.1" />
            width: 200
        },

        _create: function () {
            /// <summary>Constructor for the notification.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this._super();

            this.render();
        },

        render: function () {
            /// <function>render</function>
            /// <typedef>render: () => this</typedef>
            /// <summary>Render the notification.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.element.hide();

            this.widgets.container = $(this.html.container);
            this.widgets.container.appendTo("body");

            this.widgets.panels = {};

            this._trigger("render");

            return this;
        },

        show: function (e) {
            /// <function>show</function>
            /// <typedef>show: () => void</typedef>
            /// <summary>Show the notification.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var css = {};
            var that = this;
            var $window = $(window);
            var $el = $(this.element.children()[0]);

            if (arguments.length > 0) {
                $el = e instanceof jQuery
                    ? e
                    : (typeof e === "string"
                        ? $(e)
                        : $el);
            }

            // Create the notification panel element and add it to the container.
            var $panel = $(this.html.instance);
            $panel.append($el.html().trim());
            $panel.css("width", this.options.width + "px").addClass(this.options.cssClass);

            // Create a panel container and add the panel to it.
            var $panelContainer = $(this.html.instanceContainer);
            $panelContainer.append($panel);

            // Append / prepend the panel container to the notification container.
            if (this.options.position.bottom !== null) {
                $panelContainer.prependTo(this.widgets.container);
            } else {
                $panelContainer.appendTo(this.widgets.container);
            }
            
            // Set the height of the panel container.
            $panelContainer.css("height", $panel.outerHeight() + "px");
            
            // Create the notification panel and show it.
            var panel = $panel.serenityNotificationpanel({
                show: function (event, ui) {

                    that._trigger("show", null, { panel: ui.sender });
                },
                hide: function (event, ui) {

                    that._trigger("hide", null, { panel: ui.sender });

                    // Remove the panel from the container and destroy it. 
                    ui.sender.element.remove();
                    ui.sender.destroy();

                    // Remove the panel from the dictionary of panels.
                    delete that.widgets.panels[ui.sender.uuid];

                    // If that was the last of the panels, then empty the container.
                    if (that.widgets.container.find("div.sr-notification-instance").length === 0) {
                        that.widgets.container.empty();

                        that._trigger("hide", null, { panel: ui.sender });
                    }
                },
                click: function (event, ui) {

                    that._trigger("click", event, { panel: ui.sender });
                }
            }).data("serenityNotificationpanel");

            // Add the panel to the dictionary of panels.
            this.widgets.panels[panel.uuid] = panel;

            // Position the notification container horizontally.
            if (this.options.position.right !== null) {
                // If the notification is on the right, then calculate distance from the left as:
                // ((window width) plus[+] (how much the horizontal scrollbar has been scrolled))
                //  minus[-] (the width of the container element)
                //  minus[-] (how far from the right edge of the window that the notification should appear).  
                css.left = (($window.width() + $window.scrollLeft()) - 0 - 
                    $panel.outerWidth() -
                    // this.widgets.container.outerWidth() - 
                    this.options.position.right) + "px";
            } else if (this.options.position.left !== null) {
                // If the notification is on the left, then calculate distance from the left as:
                // (how much the horizontal scrollbar has been scrolled)
                //  plus[+] (how far from the left edge of the window that the notification should appear).  
                css.left = $window.scrollLeft() + this.options.position.left + "px";
            }

            // Position the notification container vertically.
            if (this.options.position.bottom !== null) {
                // If the notification is on the bottom, then calculate distance from the top as:
                // ((window height) plus[+] (how much the vertical scrollbar has been scrolled))
                //  minus[-] (the height of the container element)
                // X  minus[-] (the height of the panel element)
                //  minus[-] (how far from the bottom edge of the window that the notification should appear).  
                css.top = (($window.height() + $window.scrollTop()) - 0
                    - this.widgets.container.outerHeight() 
                    // - $panel.outerHeight() 
                    - this.options.position.bottom) + "px";
            } else if (this.options.position.top !== null) {
                // If the notification is on the top, then calculate distance from the top as:
                // (how much the vertical scrollbar has been scrolled)
                //  plus[+] (how far from the top edge of the window that the notification should appear).  
                css.top = $window.scrollTop() + this.options.position.top + "px";
            }

            this.widgets.container.css("width", this.options.width + "px").css(css);

            panel.show(this);

            // Return the notification panel.
            return panel;
        },

        hide: function (uuid) {
            /// <function>hide</function>
            /// <param name="uuid" type="string">The UUID of the panel to hide.</param>
            /// <typedef>hide: (uuid: string) => this</typedef>
            /// <summary>Hide a notification instance.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var panel = this.widgets.panels[uuid];

            if (typeof panel !== "undefined") {
                panel.hide();
            }

            return this;
        },

        hideAll: function () {
            /// <function>hideAll</function>
            /// <typedef>hideAll: () => this</typedef>
            /// <summary>Hide all notification instances.</summary>
            /// <version added="2016.1" updated="2016.1" />

            for (var uuid in this.widgets.panels) {
                var panel = this.widgets.panels[uuid];
                panel.hide();
            }

            return this;
        }
    });
})(window.jQuery);

/// <event>render</event>
/// <summary>Triggered when the notification is rendered.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.notification">Instance of the notification.</param>
/// <version added="2016.1" updated="2016.1" />

/// <event>show</event>
/// <summary>Triggered when a notification instance is shown.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.notification">Instance of the notification.</param>
/// <version added="2016.1" updated="2016.1" />

/// <event>hide</event>
/// <summary>Triggered when a notification instance is hidden.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.notification">Instance of the notification.</param>
/// <version added="2016.1" updated="2016.1" />

/// <event>click</event>
/// <summary>Triggered when the hideOnClick option is true and a notification instance is clicked.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.notification">Instance of the notification.</param>
/// <version added="2016.1" updated="2016.1" />
