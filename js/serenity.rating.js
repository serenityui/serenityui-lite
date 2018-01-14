/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
// http://gjunge.github.io/rateit.js/examples/
// http://www.jqueryscript.net/other/Highly-Customizable-Rating-Plugin-jQuery-Rateit-js.html
// http://www.alt-codes.net/star_alt_code.php
// https://jqueryplugins.net/


(function($, serenity) {
  "use strict";

  $.widget("serenity.rating", $.serenity.widget, {
    /// <widget>serenity.rating</widget>
    /// <inherits url="serenity.widget.html">serenity.widget</inherits>
    /// <summary>
    /// The rating widget allows you to choose a rating. You can configure rating items 
    /// as font characters or icons as well as font size and color.
    /// </summary>
    /// <element>input</element>
		/// <gettingstarted>
		/// <![CDATA[
		/// <input id="rating"/>
		/// 
		/// <script>
		///   $("#rating").serenityRating();
		/// </script>
		/// ]]>
		/// </gettingstarted>
    /// <version added="2017.1" updated="2017.1" />

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

    // <summary>
    // When the mouse is clicked, pause the processing of the mouse move events
    // for a moment so that the "highlight" div will stay hidden until the mouse 
    // moves again.
    // </summary>
    _pause: null,

    // <summary>
    // The number of pixels for the selected rating.
    // </summary>
    _pixels: null,

    // <summary>
    // The current value and pixels of the highlighted rating as the mouse moves.
    // </summary>
    _intermediate: null,

    // <summary>
    // The width of the "available" rating div.
    // </summary>
    _width: null,

    // <summary>
    // The calculated number of pixels for each "step".
    // </summary>
    _interval: null,

    // <summary>
    // The number of steps based on options.count / options.step.
    // </summary>
    _steps: null,

    html: {
      wrapper: "<div class='sr-rating-wrapper' style='display:inline-block;'><div class='sr-rating-container' style='position:relative;display:inline-block;'></div></div>",
      font: {
        available: Handlebars.compile("<div class='sr-rating-available' style='font-size:{{fontSize}};color:{{color}};display:inline-block;'>{{content}}</div>", {
          noEscape: true
        }),
        selected: Handlebars.compile("<div class='sr-rating-selected' style='font-size:{{fontSize}};color:{{color}};position:absolute;top:0px;left:0px;overflow:hidden;width:0px;'>{{content}}</div>", {
          noEscape: true
        }),
        highlight: Handlebars.compile("<div class='sr-rating-highlight' style='font-size:{{fontSize}};color:{{color}};position:absolute;top:0px;left:0px;width:0px;overflow:hidden;'>{{content}}</div>", {
          noEscape: true
        })
      },
      icon: {
        available: Handlebars.compile("<div class='sr-rating-available {{cssClass}}' style='height:{{height}}px;display:inline-block;width:{{width}}px;'></div>", {
          noEscape: true
        }),
        selected: Handlebars.compile("<div class='sr-rating-selected {{cssClass}}' style='height:{{height}}px;position:absolute;top:0px;left:0px;overflow:hidden;width:0px;'></div>", {
          noEscape: true
        }),
        highlight: Handlebars.compile("<div class='sr-rating-highlight {{cssClass}}' style='height:{{height}}px;position:absolute;top:0px;left:0px;width:0px;overflow:hidden;'></div>", {
          noEscape: true
        })
      },
      clear: Handlebars.compile("<i class='sr-rating-clear {{cssClass}}' data-color='{{color}}' data-highlight-color='{{highlightColor}}' style='color:{{color}};float:left;'></i>", {
        noEscape: true
      })
    },

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      /// <option>count</option>
      /// <datatype>Number</datatype>
      /// <default>5</default>
      /// <summary>The number of "icons" to display.</summary>
			/// <example for="JavaScript" description="Initialize the rating with the count option specified">
			/// $(".selector").serenityRating({
			///   count: 10
			/// });
			/// </example>
      /// <version added="2017.1" updated="2017.1" />
      count: 5,

      /// <option>step</option>
      /// <datatype>Number</datatype>
      /// <default>0.5</default>
      /// <typedef>step: int</typedef>
      /// <summary>The number of icons that equal a value of 1 step.</summary>
			/// <example for="JavaScript" description="Initialize the rating with the step option specified">
			/// $(".selector").serenityRating({
			///   step: 0.25
			/// });
			/// </example>
      /// <version added="2017.1" updated="2017.1" />
      step: 0.5,

      /// <option>value</option>
      /// <datatype>Number</datatype>
      /// <default>null</default>
      /// <typedef>value: int</typedef>
      /// <summary>The initial value.</summary>
			/// <example for="JavaScript" description="Initialize the rating with the value option specified">
			/// $(".selector").serenityRating({
			///   value: 3
			/// });
			/// </example>
      /// <version added="2017.1" updated="2017.1" />
      value: null,

      /// <option>readonly</option>
      /// <datatype>Boolean</datatype>
      /// <default>false</default>
      /// <typedef>readonly: bool</typedef>
      /// <summary>Flag indicating whether the widget is readonly.</summary>
			/// <example for="JavaScript" description="Initialize the rating with the readonly option specified">
			/// $(".selector").serenityRating({
			///   readonly: true
			/// });
			/// </example>
      /// <version added="2017.1" updated="2017.1" />
      readonly: false,

      /// <option>mode</option>
      /// <datatype>String</datatype>
      /// <default>"font"</default>
      /// <summary>The mode for displaying "icons". Options are "font" and "icon".</summary>
			/// <example for="JavaScript" description="Initialize the rating with the mode option specified">
			/// $(".selector").serenityRating({
			///   mode: "icons"
			/// });
			/// </example>
      /// <version added="2017.1" updated="2017.1" />
      mode: "font",

      /// <option>font</option>
      /// <datatype>JSON Object</datatype>
      /// <summary>The options used when the mode is set to "font".</summary>
      /// <version added="2017.1" updated="2017.1" />
      font: {
        /// <option>font.code</option>
        /// <datatype>Number</datatype>
        /// <default>null</default>
        /// <summary>The ASCII code for the charecter to be displayed as the "icon". The default 9733 ASCII value is for a star.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the font.code option specified">
        /// $(".selector").serenityRating({
        ///   font: {
        ///     code: 10022
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        code: null,

        /// <option>font.char</option>
        /// <datatype>String</datatype>
        /// <default>null</default>
        /// <typedef>code: int</typedef>
        /// <summary>The charecter to be displayed as the "icon". The default 9733 ASCII value is for a star.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the font.char option specified">
        /// $(".selector").serenityRating({
        ///   font: {
        ///     char: "@"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        char: null,

        /// <option>font.size</option>
        /// <datatype>String</datatype>
        /// <default>"1em"</default>
        /// <typedef>size: string</typedef>
        /// <summary>The font-size for the "icon".</summary>
        /// <example for="JavaScript" description="Initialize the rating with the font.size option specified">
        /// $(".selector").serenityRating({
        ///   font: {
        ///     size: "1.5em"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        size: "1em",

        /// <option>font.availableColor</option>
        /// <datatype>String</datatype>
        /// <default>"gray"</default>
        /// <typedef>availableColor: string</typedef>
        /// <summary>The color for the "icon" when it is available for selection.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the font.availableColor option specified">
        /// $(".selector").serenityRating({
        ///   font: {
        ///     availableColor: "silver"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        availableColor: "gray",

        /// <option>font.highlightColor</option>
        /// <datatype>String</datatype>
        /// <default>"goldenrod"</default>
        /// <typedef>highlightColor: string</typedef>
        /// <summary>The color for the "icon" when it is highlighted.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the font.highlightColor option specified">
        /// $(".selector").serenityRating({
        ///   font: {
        ///     highlightColor: "gray"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        highlightColor: "goldenrod",

        /// <option>font.selectedColor</option>
        /// <datatype>String</datatype>
        /// <default>"red"</default>
        /// <typedef>selectedColor: string</typedef>
        /// <summary>The color for the "icon" when it is selected.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the font.selectedColor option specified">
        /// $(".selector").serenityRating({
        ///   font: {
        ///     selectedColor: "black"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        selectedColor: "red"
      },
      
      /// <option>icon</option>
      /// <datatype>JSON Object</datatype>
      /// <summary>The options used when the mode is set to "icon".</summary>
      /// <version added="2017.1" updated="2017.1" />
      icon: {
        /// <option>icon.width</option>
        /// <datatype>Number</datatype>
        /// <default>null</default>
        /// <typedef>width: int</typedef>
        /// <summary>The width of each icon.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the icon.width option specified">
        /// $(".selector").serenityRating({
        ///   icon: {
        ///     width: 16
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        width: null,

        /// <option>icon.height</option>
        /// <datatype>Number</datatype>
        /// <default>null</default>
        /// <typedef>height: int</typedef>
        /// <summary>The height of each icon.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the icon.height option specified">
        /// $(".selector").serenityRating({
        ///   icon: {
        ///     height: 16
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        height: null,

        /// <option>icon.availableClass</option>
        /// <datatype>String</datatype>
        /// <default>null</default>
        /// <typedef>availableClass: string</typedef>
        /// <summary>The CSS class for the "available" icon.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the icon.availableClass option specified">
        /// $(".selector").serenityRating({
        ///   icon: {
        ///     availableClass: "rating-icon available-star"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        availableClass: null,

        /// <option>icon.highlightClass</option>
        /// <datatype>String</datatype>
        /// <default>null</default>
        /// <typedef>highlightClass: string</typedef>
        /// <summary>The CSS class for the "highlight" icon.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the icon.highlightClass option specified">
        /// $(".selector").serenityRating({
        ///   icon: {
        ///     highlightClass: "rating-icon highlight-star"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        highlightClass: null,

        /// <option>icon.selectedClass</option>
        /// <datatype>String</datatype>
        /// <default>null</default>
        /// <typedef>selectedClass: string</typedef>
        /// <summary>The CSS class for the "selected" icon.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the icon.selectedClass option specified">
        /// $(".selector").serenityRating({
        ///   icon: {
        ///     selectedClass: "rating-icon selected-star"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        selectedClass: null
      },
      
      /// <option>icon</option>
      /// <datatype>JSON Object</datatype>
      /// <summary>The options for the "clear" icon.</summary>
      /// <version added="2017.1" updated="2017.1" />
      clear: {
        /// <option>clear.visible</option>
        /// <datatype>Boolean</datatype>
        /// <default>true</default>
        /// <summary>Flag indicating whether the "clear" icon is displayed.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the clear.visible option specified">
        /// $(".selector").serenityRating({
        ///   clear: {
        ///     visible: false
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        visible: true,

        /// <option>clear.cssClass</option>
        /// <datatype>String</datatype>
        /// <default>"fa fa-minus-circle"</default>
        /// <typedef>cssClass: string</typedef>
        /// <summary>The CSS class for the "clear" icon.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the clear.cssClass option specified">
        /// $(".selector").serenityRating({
        ///   clear: {
        ///     cssClass: "fa fa-minus-square"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        cssClass: "fa fa-minus-circle",

        /// <option>clear.color</option>
        /// <datatype>String</datatype>
        /// <default>null</default>
        /// <typedef>color: string</typedef>
        /// <summary>The color of the "clear" icon.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the clear.color option specified">
        /// $(".selector").serenityRating({
        ///   clear: {
        ///     color: "silver"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        color: null,

        /// <option>clear.highlightColor</option>
        /// <datatype>String</datatype>
        /// <default>null</default>
        /// <typedef>color: string</typedef>
        /// <summary>The color of the "clear" icon when it is highlighted.</summary>
        /// <example for="JavaScript" description="Initialize the rating with the clear.highlightColor option specified">
        /// $(".selector").serenityRating({
        ///   clear: {
        ///     highlightColor: "gray"
        ///   }
        /// });
        /// </example>
        /// <version added="2017.1" updated="2017.1" />
        highlightColor: null
      }
    },

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

    _create: function() {
      /// <summary>Constructor for the rating.</summary>

      // Call the base class.
      this._super();

      // Wrap the input element in a div and hide it.
      this.element.after(this.html.wrapper);
      this.widgets.wrapper = this.element.next("div.sr-rating-wrapper");
      this.widgets.container = this.widgets.wrapper.find(".sr-rating-container");
      this.widgets.wrapper.append(this.element);
      this.element.hide();

      // Render the rating "icons".
      if (this.options.mode === "font") {
        this._renderFont();
      } else {
        this._renderIcon();
      }

      // Render the icon to clear the rating.
      this._renderClear();

      // Initialize events.
      this._initEvents();

      // Define the values to be used when moving the mouse over the widget.
      this._intermediate = {
        pixels: 0,
        steps: 0
      };

      // Load the value.
      this.load();
    },

    _renderFont: function() {
      /// <summary>Render font characters.</summary>

      // Define the rating "icons".
      var content = "";

      var char = this.options.font.code !== null ?
        String.fromCharCode(this.options.font.code) :
        this.options.font.char !== null ?
        this.options.font.char :
        String.fromCharCode(9733);

      for (var idx = 0; idx < this.options.count; idx++) {
        content += char;
      }

      // Display the available rating "icons".
      this.widgets.container.append(this.html.font.available({
        fontSize: this.options.font.size,
        color: this.options.font.availableColor,
        content: content
      }));
      this.widgets.available = this.widgets.container.find(".sr-rating-available");

      // Define the selected rating "icons".
      this.widgets.container.append(this.html.font.selected({
        fontSize: this.options.font.size,
        color: this.options.font.selectedColor,
        content: content
      }));
      this.widgets.selected = this.widgets.container.find(".sr-rating-selected");

      // Define the highlight rating "icons".
      this.widgets.container.append(this.html.font.highlight({
        fontSize: this.options.font.size,
        color: this.options.font.highlightColor,
        content: content
      }));
      this.widgets.highlight = this.widgets.container.find(".sr-rating-highlight");
    },

    _renderIcon: function() {
      /// <summary>Render icons.</summary>

      var width = this.options.count * this.options.icon.width;
      var height = this.options.icon.height;

      // Display the available rating "icons".
      this.widgets.container.append(this.html.icon.available({
        cssClass: this.options.icon.availableClass,
        height: height,
        width: width
      }));
      this.widgets.available = this.widgets.container.find(".sr-rating-available");


      // Define the selected rating "icons".
      this.widgets.container.append(this.html.icon.selected({
        cssClass: this.options.icon.selectedClass,
        height: height
      }));
      this.widgets.selected = this.widgets.container.find(".sr-rating-selected");

      // Define the highlight rating "icons".
      this.widgets.container.append(this.html.icon.highlight({
        cssClass: this.options.icon.highlightClass,
        height: height
      }));
      this.widgets.highlight = this.widgets.container.find(".sr-rating-highlight");
    },

    _renderClear: function() {
      /// <summary>Display the icon to clear the value for the rating widget.</summary>

      // Show the clear icon.
      if (this.options.clear.visible === true) {
        var params = this.options.clear;
        if (params.color === null) {
          params.color = this.options.font.availableColor;
        }
        if (params.highlightColor === null) {
          params.highlightColor = this.options.font.selectedColor;
        }
        this.widgets.wrapper.prepend(this.html.clear(this.options.clear));
        this.widgets.clear = this.widgets.wrapper.find(".sr-rating-clear");
        this.widgets.clear.css("margin-top", ((this.widgets.container.height() - this.widgets.clear.height()) / 2) + "px");

        this.widgets.clear.on("mouseenter", function() {
          var $el = $(this);
          $el.css("color", $el.attr("data-highlight-color"));
        });

        this.widgets.clear.on("mouseleave", function() {
          var $el = $(this);
          $el.css("color", $el.attr("data-color"));
        });

        var that = this;
        this.widgets.clear.on("click", function() {
          that._intermediate = {
            pixels: 0,
            steps: 0
          };
          that._setSelectedValue();
        });
      }
    },

    _initEvents: function() {
      /// <summary>Initialize the event handlers.</summary>

      if (this.options.readonly === false) {
        // Define the events.
        this.widgets.container.on("mousemove", $.proxy(this._onMouseMove, this));
        this.widgets.container.on("mouseleave", $.proxy(this._onMouseLeave, this));
        this.widgets.container.on("click", $.proxy(this._onClick, this));
      }
    },

    _initIntervalValues: function() {
      /// <summary>Initialize the interval values that will be used to calculate the width for the highlighted and selected ratings.</summary>

      var width = this.widgets.available.width();

      if (this._width !== width) {
        this._width = width;

        this._steps = this.options.count / this.options.step;
        this._interval = this._width / this._steps;
      }
    },

    /***************************************************************************
     *
     * EVENT HANDLERS
     *
     **************************************************************************/

    _onMouseMove: function(event) {
      /// <summary>Handle the mouse move event.</summary>

      if (this._pause !== true) {
        // Hide the selected "icons".
        this.widgets.selected.width(0);

        // calculate the steps for the current mouse position.
        this._intermediate.steps = this._calculateSelectedSteps(event.offsetX);

        // Calculate and set the width for the highlighted "icons".
        this._intermediate.pixels = this._calculateSelectedPixels(this._intermediate.steps);

        this.widgets.highlight.css("width", this._intermediate.pixels + "px");
      }
    },

    _onMouseLeave: function() {
      /// <summary>Handle the mouse leave event.</summary>

      // Hide the highlighted "icons" and show the selected "icons".
      this.widgets.highlight.width(0);
      this.widgets.selected.width(this._pixels);
    },

    _onClick: function() {
      /// <summary>Handle the mouse click event.</summary>

      this._setSelectedValue();
    },

		/***************************************************************************
     *
     * PROTECTED METHODS
     *
     **************************************************************************/

    _calculateSelectedSteps: function(pixels) {
      /// <summary>Calculate the number of steps for the pixels passed in.</summary>

      var found = false;
      var steps = 0;

      this._initIntervalValues();

      // Find the steps.
      for (var idx = 1; idx <= this._steps && found === false; idx++) {

        if (pixels < (idx * this._interval) && pixels > ((idx - 1) * this._interval)) {
          steps = idx;
          found = true;
        }
      }

      return found === true ? steps : this._intermediate.steps;
    },

    _calculateSelectedPixels: function(steps) {
      /// <summary>Calculate the pixels for the steps passed in.</summary>

      this._initIntervalValues();

      return steps * this._interval;
    },

    _convertValueToSteps: function(value) {
      /// <summary>Convert the value to steps.</summary>

      return value / this.options.step;
    },

    _convertStepsToValue: function(steps) {
      /// <summary>Convert the steps to a value.</summary>

      return steps * this.options.step;
    },

    _setSelectedValue: function() {

      // Stop processing mouse events.
      this._pause = true;

      // Hide the highlighted "icons".
      this.widgets.highlight.width(0);

      // Set the value and pixels for the selected "icons".
      this.options.value = this._convertStepsToValue(this._intermediate.steps);
      this._pixels = this._intermediate.pixels;
      this.element.val(this.options.value);

      // Set the width for the selected "icons".
      this.widgets.selected.css("width", this._pixels + "px");

      // Trigger the change event.
      this._trigger("change", null, {
        value: this.options.value
      });

      var that = this;

      // Wait a moment before processing any mouse events.
      setTimeout(function() {
        that._pause = false;
      }, 250);
    },
		
    /***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/

    load: function() {
      /// <summary>Load the rating widget with the value.</summary>

      // Display the initial value for the widget.
      var value = 0;
      if ($.isNumeric(this.options.value)) {
        value = this.options.value;
      } else {
        var val = this.element.val();

        if (val.length > 0) {
          value = parseFloat(val);
        }
      }
      this._pixels = this._calculateSelectedPixels(this._convertValueToSteps(value));
      this.widgets.selected.css("width", this._pixels + "px");
    }
  });
})(window.jQuery, window.serenity);


/*
 * Events
 */

/// <event>change</event>
/// <summary>Triggered when a change occurs to the rating value.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.value" type="Number">Rating value.</param>
/// <param name="ui.sender" type="serenity.rating">Instance of the widget.</param>
/// <example for="JavaScript" description="Initialize the rating with the change callback specified">
/// $(".selector").serenityRating({
///   change: function (event, ui) {
///     console.log("change event raised");
///   }
/// });
/// </example>
/// <version added="2017.1" updated="2017.1" />
