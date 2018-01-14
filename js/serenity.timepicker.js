/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
(function($, serenity) {
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

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

    _modeFormat: {
      "12": "{0:hh}:{0:mm} {0:tt}",
      "24": "{0:t}"
    },

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      /// <option>min</option>
      /// <datatype>String|Date</datatype>
      /// <default>"12:00 AM"</default>
      /// <typedef>min: any</typedef>
      /// <summary>Minimum time to display.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the min option specified">
			/// $(".selector").serenityTimepicker({
      ///   interval: "9:00 AM"
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      min: "12:00 AM",

      /// <option>max</option>
      /// <datatype>String|Date</datatype>
      /// <default>"11:30 PM"</default>
      /// <typedef>max: any</typedef>
      /// <summary>Maximum time to display.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the max option specified">
			/// $(".selector").serenityTimepicker({
      ///   interval: "5:00 PM"
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      max: "11:30 PM",

      /// <option>interval</option>
      /// <datatype>Number</datatype>
      /// <default>30</default>
      /// <typedef>interval: number</typedef>
      /// <summary>Number of minutes between each time displayed.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the interval option specified">
			/// $(".selector").serenityTimepicker({
      ///   interval: 60
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      interval: 30,

      /// <option>mode</option>
      /// <datatype>String</datatype>
      /// <default>"12"</default>
      /// <typedef>mode: string</typedef>
      /// <summary>Display the time in 12 or 24 hour clock.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the mode option specified">
			/// $(".selector").serenityTimepicker({
      ///   mode: "24"
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      mode: "12",

      /// <option>date</option>
      /// <datatype>Date</datatype>
      /// <default>null</default>
      /// <typedef>date: Date</typedef>
      /// <summary>Date containing the time to select when the widget is rendered.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the date option specified">
			/// $(".selector").serenityTimepicker({
      ///   date: new Date(new Date().setHours(13, 0, 0))
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      date: null,

      /// <option>text</option>
      /// <datatype>String</datatype>
      /// <default>null</default>
      /// <typedef>text: string</typedef>
      /// <summary>The time to select when the widget is rendered.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the text option specified">
			/// $(".selector").serenityTimepicker({
      ///   text: "09:00 AM"
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      text: null,

      /// <option>height</option>
      /// <datatype>Number</datatype>
      /// <default>250</default>
      /// <typedef>height: number</typedef>
      /// <summary>Height of the dropdown list.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the height option specified">
			/// $(".selector").serenityTimepicker({
      ///   height: 300
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      height: 250,

      /// <option>width</option>
      /// <datatype>Number</datatype>
      /// <default>150</default>
      /// <typedef>width: number</typedef>
      /// <summary>Width of the widget.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the width option specified">
			/// $(".selector").serenityTimepicker({
      ///   width: 200
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      width: 150,

      /// <option>valueField</option>
      /// <summary>The time to select when the widget is rendered.</summary>
      /// <version added="2016.1" updated="2016.1" />
      /// <ignore>true</ignore>
      valueField: "value",

      /// <option>textField</option>
      /// <summary>The time to select when the widget is rendered.</summary>
      /// <version added="2016.1" updated="2016.1" />
      /// <ignore>true</ignore>
      textField: "text"
      
      /// <option>dataSource</option>
      /// <ignore>true</ignore>
      
      /// <option>itemTemplate</option>
      /// <ignore>true</ignore>
      
      /// <option>textTemplate</option>
      /// <ignore>true</ignore>
    },

    setDataSource: function() {
			/// <function>setDataSource</function>
      /// <summary>Set the data source.</summary>
      /// <version added="2016.1" updated="2016.1" />
      /// <ignore>true</ignore>

      var that = this;

      var list = Enumerable.From(serenity.time.list(this.options.min, this.options.max, this.options.interval, this.options.mode))
        .Select(function(item) {
          return {
            value: item,
            text: that.options.mode == "12" ? item.replace("00:", "12:") : item
          };
        }).ToArray()

      var ds = new serenity.DataSource({
        data: list
      });

      if (this.options.date !== null) {
        var text = serenity.format(this._modeFormat[this.options.mode], this.options.date);
        text = this.options.mode === "12" ? text.replace("00:", "12:") : text;
        this.options.text = text;
      }

      this._super(ds);
    }
    
    /// <function>dataSource</function>
    /// <summary>Get the data source.</summary>
    /// <version added="2016.1" updated="2016.1" />
    /// <ignore>true</ignore>
  });
})(window.jQuery, window.serenity);


/*
 * Events
 */

/// <event>dataBound</event>
/// <ignore>true</ignore>
