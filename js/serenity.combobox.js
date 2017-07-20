/**
 * Serenity UI v2017.1.170720 (https://www.serenityui.com)
 */
(function ($, serenity) {
    $.widget("serenity.combobox", $.serenity.autocomplete, {
        /// <widget>serenity.combobox</widget>
        /// <inherits url="serenity.autocomplete.html">serenity.autocomplete</inherits>
        /// <typedef>interface Combobox extends Autocomplete</typedef>
        /// <typedef for="JQuery">serenityCombobox(): JQuery</typedef>
        /// <typedef for="JQuery">serenityCombobox(options: any): JQuery</typedef>
        /// <summary>An input field with a list of selectable items displayed in a drop-down.</summary>
        /// <element>input</element>
        /// <gettingstarted>
        /// <![CDATA[
        /// <input id="autocomplete" />
        ///
        /// <script>
        ///   var colors = new serenity.DataSource({
        ///     data: [{ id: 1, text: "Red" }, { id: 2, text: "Blue" }, { id: 2, text: "Green" }]
        ///   });
        /// 
        ///   $("#combobox").serenityCombobox({
        ///     valueField: "id", 
        ///     textField: "text", 
        ///     dataSource: colors
        ///   });
        /// </script>
        /// ]]>
        /// </gettingstarted>
        /// <version added="2016.1" updated="2016.1" />

        options: {
            minLength: 0,
            delay: 0
        },

        html: {
            wrapper: "<span class='sr-combobox-wrapper' style='display:inline-block;position:relative;'></span>"
        },

        _open: null,

        _create: function () {
            /// <summary>Constructor for the combobox.</summary>
            /// <version added="2016.1" updated="2016.1" />

            // Place the input element into a wrapper element.
            var $wrapper = $(this.html.wrapper);
            this.element.before($wrapper);
            $wrapper.append(this.element);

            // Add a show button.
            $("<a>").appendTo($wrapper)
                .button({
                    icons: { primary: "ui-icon-triangle-1-s" }, 
                    text: false })
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right")
                .css({
                    "position": "absolute",
                    "top": 0,
                    "bottom": 0,
                    "margin-left": "-1px"
                })
                .on("mousedown", $.proxy(this._onShowListMouseDown, this))
                .on("click", $.proxy(this._onShowListClick, this));

            this._super();

            this.widgets.wrapper = $wrapper;
        },

        _onShowListMouseDown: function () {
            /// <summary>Determine wheter the menu list is visible.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this._open = this.menu.element.is(":visible");
        },

        _onShowListClick: function () {
            /// <summary>Show / hide menu list when the button is clicked.</summary>
            /// <version added="2016.1" updated="2016.1" />

            if (this._open === false) {
                var text = this.element.val();
                this.element.trigger("focus");
                this.search(text);
            }
        }
    });
})(window.jQuery, window.serenity);
