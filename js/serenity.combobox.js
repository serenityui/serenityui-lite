/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
(function($, serenity) {
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
    /// <input id="combobox" />
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

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      minLength: 0,
      delay: 0
    },

    html: {
      wrapper: "<span class='sr-combobox-wrapper' style='display:inline-block;position:relative;'></span>",
      button: "<a class='ui-button ui-widget ui-button-icon-only ui-corner-right sr-show-list-button'><span class='ui-button-icon ui-icon ui-icon-triangle-1-s'></span><span class='ui-button-icon-space'> </span></a>"
    },

    _open: null,

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

    _create: function() {
      /// <summary>Constructor for the combobox.</summary>
      /// <version added="2016.1" updated="2016.1" />

      // Place the input element into a wrapper element.
      var $wrapper = $(this.html.wrapper);
      this.element.before($wrapper);
      $wrapper.append(this.element);
      $wrapper = this.element.closest("span.sr-combobox-wrapper");

      this._super();
      
      this.widgets.wrapper = $wrapper;

      // Add a show button.
      this.widgets.wrapper.append(this.html.button);
      
      this.widgets.button = this.widgets.wrapper.find("a.sr-show-list-button");
      this.widgets.button.on("mousedown", $.proxy(this._onShowListMouseDown, this));
      this.widgets.button.on("click", $.proxy(this._onShowListClick, this));
      
      var buttonWidth = this.widgets.button.width();
      var inputWidth = this.element.width();
      
      this.element.css("width", (inputWidth - buttonWidth) + "px");
    },

    /***************************************************************************
     *
     * EVENT HANDLERS
     *
     **************************************************************************/

    _onShowListMouseDown: function() {
      /// <summary>Determine wheter the menu list is visible.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this._open = this.menu.element.is(":visible");
    },

    _onShowListClick: function() {
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