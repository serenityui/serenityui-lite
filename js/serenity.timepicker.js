/**
 * Serenity UI v2017.1.170720 (https://www.serenityui.com)
 */
(function ($, serenity) {
    "use strict";

    $.widget("serenity.timepicker", $.serenity.dropdownlist, {
        /// <widget>serenity.timepicker</widget>
        /// <inherits url="serenity.dropdownlist.html">serenity.dropdownlist</inherits>
        /// <typedef>interface TimePicker extends DropDownList</typedef>
        /// <typedef for="JQuery">serenityTimepicker(): JQuery</typedef>
        /// <typedef for="JQuery">serenityTimepicker(options: any): JQuery</typedef>
        /// <summary>Display a list of times.</summary>
        /// <element>select</element>
        /// <gettingstarted>
        /// <![CDATA[
        /// <select id="timepicker"></select>
        ///
        /// <script>
        ///   $("#timepicker").serenityTimepicker();
        /// </script>
        /// ]]>
        /// </gettingstarted>
        /// <version added="2016.1" updated="2016.1" />

        _modeFormat: {
            "12": "{0:hh}:{0:mm} {0:tt}",
            "24": "{0:t}"
        },

        options: {
            /// <option>min</option>
            /// <datatype>String|Date</datatype>
            /// <default>"12:00 AM"</default>
            /// <typedef>min: any</typedef>
            /// <summary>Minimum time to display.</summary>
            /// <version added="2016.1" updated="2016.1" />
            min: "12:00 AM",

            /// <option>max</option>
            /// <datatype>String|Date</datatype>
            /// <default>"11:30 PM"</default>
            /// <typedef>max: any</typedef>
            /// <summary>Maximum time to display.</summary>
            /// <version added="2016.1" updated="2016.1" />
            max: "11:30 PM",

            /// <option>interval</option>
            /// <datatype>Number</datatype>
            /// <default>30</default>
            /// <typedef>interval: number</typedef>
            /// <summary>Number of minutes between each time displayed.</summary>
            /// <version added="2016.1" updated="2016.1" />
            interval: 30,

            /// <option>mode</option>
            /// <datatype>String</datatype>
            /// <default>"12"</default>
            /// <typedef>mode: string</typedef>
            /// <summary>Display the time in 12 or 24 hour clock.</summary>
            /// <version added="2016.1" updated="2016.1" />
            mode: "12",

            /// <option>date</option>
            /// <datatype>Date</datatype>
            /// <default>null</default>
            /// <typedef>date: Date</typedef>
            /// <summary>Date containing the time to select when the widget is rendered.</summary>
            /// <version added="2016.1" updated="2016.1" />
            date: null,

            /// <option>text</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>text: string</typedef>
            /// <summary>The time to select when the widget is rendered.</summary>
            /// <version added="2016.1" updated="2016.1" />
            text: null,

            /// <option>height</option>
            /// <datatype>Number</datatype>
            /// <default>250</default>
            /// <typedef>height: number</typedef>
            /// <summary>Height of the dropdown list.</summary>
            /// <version added="2016.1" updated="2016.1" />
            height: 250,

            /// <option>width</option>
            /// <datatype>Number</datatype>
            /// <default>150</default>
            /// <typedef>width: number</typedef>
            /// <summary>Width of the widget.</summary>
            /// <version added="2016.1" updated="2016.1" />
            width: 150,

            /// <summary>The time to select when the widget is rendered.</summary>
            /// <version added="2016.1" updated="2016.1" />
            valueField: "value",

            /// <summary>The time to select when the widget is rendered.</summary>
            /// <version added="2016.1" updated="2016.1" />
            textField: "text"
        },

        setDataSource: function () {
            /// <summary>Set the data source.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            var list = Enumerable.From(serenity.time.list(this.options.min, this.options.max, this.options.interval, this.options.mode))
                .Select(function (item) { 
                    return { value: item, text: that.options.mode == "12" ? item.replace("00:", "12:") : item };
                }
                ).ToArray()

            var ds = new serenity.DataSource({ data: list });

            if (this.options.date !== null) {
                var text = serenity.format(this._modeFormat[this.options.mode], this.options.date);
                text = this.options.mode === "12" ? text.replace("00:", "12:") : text;
                this.options.text = text;
            }

            this._super(ds);
        }
    });
})(window.jQuery, window.serenity);
