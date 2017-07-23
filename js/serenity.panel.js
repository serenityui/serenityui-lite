/**
 * Serenity UI v2017.1.170722 (https://www.serenityui.com)
 */
(function ($, serenity) {
    "use strict";

    $.widget("serenity.panel", $.serenity.widget, {
        /// <widget>serenity.panel</widget>
        /// <inherits url="serenity.widget.html">serenity.widget</inherits>
        /// <typedef>interface Panel extends Widget</typedef>
        /// <typedef for="JQuery">serenityPanel(): JQuery</typedef>
        /// <typedef for="JQuery">serenityPanel(options: any): JQuery</typedef>
        /// <summary>The panel widget displays a heading and content that is collapsible.</summary>
        /// <element>div</element>
        /// <gettingstarted>
        /// <![CDATA[
        /// <div id="panel" style="width:250px;">
        ///     <div>Sample Panel</div>
        ///     <div>
        ///         Here is some content.
        ///     </div>
        /// </div>
        ///
        /// <script>
        ///   $("#panel").serenityPanel();
        /// </script>
        /// ]]>
        /// </gettingstarted>
        /// <version added="2016.1" updated="2016.1" />

        html: {
            heading: "<div class='sr-panel-heading ui-accordion-header ui-accordion-header-active ui-state-default ui-corner-top'></div>",
            title: "<div class='sr-panel-title'></div>",
            expander: "<span class='sr-panel-expander'></span>",
            body:"<div class='sr-panel-body ui-widget-content ui-corner-bottom'></div>"
        },

        options: {
            /// <option>collapsible</option>
            /// <datatype>Boolean</datatype>
            /// <default>false</default>
            /// <typedef>collapsible: boolean</typedef>
            /// <summary>Flag indicating whether the panel is collapsible.</summary>
            /// <version added="2016.1" updated="2016.1" />
            collapsible: false,

            /// <option>collapsed</option>
            /// <datatype>Boolean</datatype>
            /// <default>false</default>
            /// <typedef>collapsed: boolean</typedef>
            /// <summary>Flag indicating whether the panel is initially collapsed. (collapsible must be set to true for this to apply)</summary>
            /// <version added="2016.1" updated="2016.1" />
            collapsed: false,

            /// <option>title</option>
            /// <datatype>String</datatype>
            /// <default>""</default>
            /// <typedef>title: string</typedef>
            /// <summary>Text displayed in the panel title.</summary>
            /// <version added="2016.1" updated="2016.1" />
            title: "",

            /// <option>body</option>
            /// <datatype>String</datatype>
            /// <default>""</default>
            /// <typedef>body: string</typedef>
            /// <summary>HTML to be displayed as the body content.</summary>
            /// <version added="2016.1" updated="2016.1" />
            body: "",

            expander: {
                /// <option>expander.collapse</option>
                /// <datatype>String</datatype>
                /// <default>"fa fa-minus-circle"</default>
                /// <summary>CSS Class for the icon that is displayed to collapse the panel.</summary>
                /// <version added="2016.1" updated="2016.1" />
                collapse: "fa fa-minus-circle",

                /// <option>expander.expand</option>
                /// <datatype>String</datatype>
                /// <default>"fa fa-plus-circle"</default>
                /// <summary>CSS Class for the icon that is displayed to expand the panel.</summary>
                /// <version added="2016.1" updated="2016.1" />
                expand: "fa fa-plus-circle"
            },

            /// <option>width</option>
            /// <datatype>String</datatype>
            /// <default>"100%"</default>
            /// <typedef>width: string</typedef>
            /// <summary>Width of the panel.</summary>
            /// <version added="2016.1" updated="2016.1" />
            width: "100%"
        },

        _create: function () {
            /// <summary>Constructor for the panel.</summary>
            /// <version added="2016.1" updated="2016.1" />
        
            this._super();

            this.render();
        },

        render: function () {
            /// <summary>Render the panel.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            this.element.addClass("ui-widget ui-accordion");

            this.element.css("width", this.options.width);

            var divs = this.element.children("div");

            // Add the div that will contain the heading div.
            this.element.prepend(this.html.heading);
            this.widgets.heading = this.element.find(".sr-panel-heading");

            // Were there any div elements defined?
            if (divs.length === 0) {
                // Add the title div element to the heading div.
                this.widgets.heading.append(this.html.title);
                // Set the title.
                this.title(this.options.title);
                // Add the body div.
                this.element.append(this.html.body);
                this.widgets.body = this.element.find(".sr-panel-body");
                // Set the body.
                this.body(this.options.body);
            } else if (divs.length === 2) {
                $(divs[0]).addClass("sr-panel-title").appendTo(this.widgets.heading);
                this.widgets.body = $(divs[1]);
                this.widgets.body.addClass("sr-panel-body ui-widget-content ui-corner-bottom");
            }

            this.widgets.body = this.element.find(".sr-panel-body");

            this.collapsible(this.options.collapsible);

            if (this.options.collapsible && this.options.collapsed) {
                this.toggle(false);
            }

            this.element.on("click.sr-panel", ".sr-panel-heading.sr-panel-collapsible", function () {
                that.toggle.call(that);
            });
        },

        toggle: function (expand) {
            /// <function>toggle</function>
            /// <param name="expand" type="Boolean" optional="true">True to expand, false to collapse, or omit to toggle.</param>
            /// <typedef>toggle: (expand: boolean) => this</typedef>
            /// <summary>Render the panel.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var visible = this.widgets.body.is(":visible");
            
            if (arguments.length === 0 || 
                (
                    // Expand when panel not visible.
                    (expand && !visible) || 
                    // Collapse when visible.
                    (!expand && visible)
                )
            ) {
                if (visible) {
                    // Collapse the panel.
                    this.widgets.expander.removeClass(this.options.expander.collapse).addClass(this.options.expander.expand);
                    this.widgets.heading.addClass("ui-corner-bottom");
                    this.widgets.body.hide();
                    this._trigger("close");
                } else {
                    // Expand the panel.
                    this.widgets.expander.removeClass(this.options.expander.expand).addClass(this.options.expander.collapse);
                    this.widgets.heading.removeClass("ui-corner-bottom");
                    this.widgets.body.show();
                    this._trigger("open");
                }
            }

            return this;
        },

        title: function (text) {
            /// <function>title</function>
            /// <param name="text" type="String">The title to be displayed.</param>
            /// <typedef>title: (text: string) => this</typedef>
            /// <summary>Set the title for the panel.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.widgets.heading.find(".sr-panel-title").text(text);

            return this;
        },

        body: function (content) {
            /// <function>body</function>
            /// <param name="content" type="String">The content to be displayed.</param>
            /// <typedef>content: (text: string) => this</typedef>
            /// <summary>Set the content for the panel body.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.widgets.body.html(content);
        },

        collapsible: function (value) {
            /// <function>collapsible</function>
            /// <summary>Enable the panel body to be collapsible.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.widgets.heading.find(".sr-panel-expander").remove();

            if (value === true || value === "left") {
                this.widgets.heading.prepend(this.html.expander);
                this.widgets.expander = this.widgets.heading.find(".sr-panel-expander");
                this.widgets.expander.addClass("sr-panel-expander-left");
                this.widgets.expander.addClass(this.options.expander.collapse);
                this.widgets.heading.addClass("sr-panel-collapsible");
            } else if (value === "right") {
                this.widgets.heading.append(this.html.expander);
                this.widgets.expander = this.widgets.heading.find(".sr-panel-expander");
                this.widgets.expander.addClass("sr-panel-expander-right");
                this.widgets.expander.addClass(this.options.expander.collapse);
                this.widgets.heading.addClass("sr-panel-collapsible");
            }
        }
    });
})(window.jQuery, window.serenity);


/// <event>open</event>
/// <summary>Triggered when the panel is opened.</summary>
/// <version added="2016.1" updated="2016.1" />

/// <event>close</event>
/// <summary>Triggered when the panel is closed.</summary>
/// <version added="2016.1" updated="2016.1" />
