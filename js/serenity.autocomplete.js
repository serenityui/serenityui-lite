/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
(function($, serenity) {
  $.widget("serenity.autocomplete", $.ui.autocomplete, serenity._dataWidgetDef);

  $.widget("serenity.autocomplete", $.serenity.autocomplete, {
    /// <widget>serenity.autocomplete</widget>
    /// <inherits url="https://api.jqueryui.com/autocomplete/">ui.autocomplete</inherits>
    /// <inherits url="serenity.datawidget.html">serenity.datawidget</inherits>
    /// <typedef>interface Autocomplete extends JQueryUI.Autocomplete</typedef>
    /// <typedef for="JQuery">serenityAutocomplete(): JQuery</typedef>
    /// <typedef for="JQuery">serenityAutocomplete(options: any): JQuery</typedef>
    /// <summary>Auto complete a value for an input field.</summary>
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
    ///   $("#autocomplete").serenityAutocomplete({
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
      /// <option>dataSource</option>
      /// <datatype>serenity.DataSource</datatype>
      /// <default>[]</default>
      /// <summary>Data to be displayed in the autocomplete's dropdown list.</summary>
      /// <example for="JavaScript" description="Initialize the autocomplete with the dataSource option specified as a serenity.DataSource">
      /// <![CDATA[
      /// $(".selector").serenityAutocomplete({
      ///   dataSource: new serenity.DataSource({
      ///     data: [
      ///       { id: 1, text: "Item 1" },
      ///       { id: 2, text: "Item 2" }
      ///     ]
      ///   })
      /// })
      /// ]]>
      /// </example>
      /// <example for="JavaScript" description="Initialize the autocomplete with the dataSource option specified as an Array">
      /// <![CDATA[
      /// $(".selector").serenityAutocomplete({
      ///   dataSource: [
      ///     { id: 1, text: "Item 1" },
      ///     { id: 2, text: "Item 2" }
      ///   ]
      /// })
      /// ]]>
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      dataSource: [],

      /// <option>height</option>
      /// <datatype>Number</datatype>
      /// <default>null</default>
      /// <typedef>height: number</typedef>
      /// <summary>Height of the dropdown list.</summary>
      /// <example for="JavaScript" description="Initialize the autocomplete with the height option specified">
      /// <![CDATA[
      /// $(".selector").serenityAutocomplete({
      ///   height: 250
      /// })
      /// ]]>
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      height: null,

      /// <option>index</option>
      /// <datatype>Number</datatype>
      /// <default>null</default>
      /// <typedef>index: number</typedef>
      /// <summary>The index of the option to be initially selected.</summary>
      /// <example for="JavaScript" description="Initialize the autocomplete with the index option specified">
      /// <![CDATA[
      /// $(".selector").serenityAutocomplete({
      ///   index: 2
      /// })
      /// ]]>
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      index: null,

      /// <option>itemTemplate</option>
      /// <datatype>Function</datatype>
      /// <default>null</default>
      /// <typedef>itemTemplate: any</typedef>
      /// <summary>Provide the HTML to be used when the data item is rendered as a list item.</summary>
      /// <example for="JavaScript" description="Define a function to render the menu item in italic">
	    /// <![CDATA[
      /// $(".selector").serenityAutocomplete({
      ///   dataSource: [
      ///     { id: 1, text: "Item 1" },
      ///     { id: 2, text: "Item 2" }
      ///   ],
      ///   valueField: "id",
      ///   textField: "text",
      ///   itemTemplate: function (dataItem) {
      ///     return serenity.format("<span style='font-style:italic;'>{0}</span>", dataItem.text);
      ///   }
      /// })
      /// ]]>
      /// </example>
      /// <example for="JavaScript" description="Define a Handlebars template to render the menu item in italic">
      /// <![CDATA[
      /// $(".selector").serenityAutocomplete({
      ///   dataSource: [
      ///     { id: 1, text: "Item 1" },
      ///     { id: 2, text: "Item 2" }
      ///   ],
      ///   valueField: "id",
      ///   textField: "text",
      ///   itemTemplate: Handlebars.compile("<span style='font-style:italic;'>{{text}}</span>")
      /// })
      /// ]]>
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      itemTemplate: null,

      /// <option>text</option>
      /// <datatype>String</datatype>
      /// <default>null</default>
      /// <typedef>text: string</typedef>
      /// <summary>The text of the item to be initially selected.</summary>
			/// <example for="JavaScript" description="Initialize the autocomplete with the text option specified">
      /// $(".selector").serenityAutocomplete({
      ///   text: "Item 1"
      /// })
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      text: null,

      /// <option>textField</option>
      /// <datatype>String</datatype>
      /// <default>null</default>
      /// <typedef>textField: string</typedef>
      /// <summary>The field in the dataSource to be displayed for the items in the list.</summary>
			/// <example for="JavaScript" description="Initialize the autocomplete with the textField option specified">
      /// $(".selector").serenityAutocomplete({
      ///   textField: "fullName"
      /// })
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      textField: null,

      /// <option>value</option>
      /// <datatype>any</datatype>
      /// <default>null</default>
      /// <typedef>value: any</typedef>
      /// <summary>The value of the item to be initially selected.</summary>
			/// <example for="JavaScript" description="Initialize the autocomplete with the value option specified">
      /// $(".selector").serenityAutocomplete({
      ///   value: 1
      /// })
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      value: null,

      /// <option>valueField</option>
      /// <datatype>String</datatype>
      /// <default>null</default>
      /// <typedef>valueField: string</typedef>
      /// <summary>The field in the dataSource that is the value for the items in the list.</summary>
			/// <example for="JavaScript" description="Initialize the autocomplete with the valueField option specified">
      /// $(".selector").serenityAutocomplete({
      ///   valueField: "employeeId"
      /// })
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      valueField: null,

      source: []
    },

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

    _create: function() {
      /// <summary>Constructor for the input.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this._super();

      this.element.css("padding", "5px");

      this.setDataSource(this.options.dataSource);
    },

		/***************************************************************************
     *
     * PROTECTED OVERRIDE METHODS
     *
     **************************************************************************/

    _onDataSourceChange: function() {
      /// <summary>When a change is made to the DataSource, refresh the list.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this.refresh();
    },

		/***************************************************************************
     *
     * PROTECTED METHODS
     *
     **************************************************************************/
		
    _renderItem: function(ul, item) {
      /// <summary>Method that controls the creation of each option in the widget's menu.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;
      var $li = this._super(ul, item);

      if (this._dataSourceValid() && this.options.itemTemplate !== null) {
        var text = $li.text();
        var dataItem = this._dataSource.view().Where(function(e) {
          return e[that.options.textField] === text
        }).FirstOrDefault();
        var html = this.options.itemTemplate(dataItem);
        $li.html(html);
      }

      return $li;
    },

		/***************************************************************************
     *
     * PUBLIC OVERRIDE METHODS
     *
     **************************************************************************/

    setDataSource: function(ds) {
      /// <function>setDataSource</function>
      /// <typedef>setDataSource: (ds: serenity.DataSource) => void</typedef>
      /// <summary>Set the data source.</summary>
      /// <param name="ds" type="serenity.DataSource">Contains the data to be displayed in the dropdownlist.</param>
			/// <example for="JavaScript" description="Set the DataSource for the table.">
			/// $(".selector").data("serenityAutocomplete").setDataSource(new serenity.DataSource({ data: employees }));
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this._super(ds);

      if (this._dataSourceValid()) {
        if (this.options.index !== null) {
          this.index(this.options.index);
        } else if (this.options.value !== null) {
          this.value(this.options.value);
        } else if (this.options.text !== null) {
          this.text(this.options.text);
        } else {
          this.refresh();
        }
      }
    },

    /***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/

    dataItem: function() {
      /// <function>dataItem</function>
      /// <typedef>dataItem: () => any</typedef>
      /// <summary>Get the data item for the selected option.</summary>
      /// <return type="JSON Object">The data item for the selected option.</return>
			/// <example for="JavaScript" description="Get the data from the DataSource for the currently selected menu item.">
			/// var dataItem = $(".selector").data("serenityAutocomplete").dataItem();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      var value = this.element.val();

      return this._dataSource.view()
        .Where(function(e) {
          return e[that.options.textField] == value;
        })
        .FirstOrDefault();
    },

    index: function(index) {
      /// <function>index</function>
      /// <typedef>index: (index: number) => void</typedef>
      /// <summary>Set the index for the selected data item.</summary>
      /// <param name="index" type="Number">Index of the item to be selected.</param>
			/// <example for="JavaScript" description="Set the index for the data item in the DataSource to be selected.">
			/// $(".selector").data("serenityAutocomplete").index(1);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this.options.index = index;
      this.refresh();
    },

    text: function(text) {
      /// <function>text</function>
      /// <typedef>text: (text: string) => void</typedef>
      /// <summary>Set the text for the data item to be selected.</summary>
      /// <param name="text" type="String">Text of the item to selected.</param>
			/// <example for="JavaScript" description="Set the text for the data item in the DataSource to be selected.">
			/// $(".selector").data("serenityAutocomplete").text("Item 1");
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      if (typeof text !== "undefined") {
				var that = this,
						found = false;

				this._dataSource.view().ForEach(function(item, idx) {
					if (item[that.options.textField] === text) {
						that.options.value = item[that.options.valueField];
						that.options.text = text;
						that.options.index = idx;
						that.refresh();
						found = true;
						return false;
					}
				});
				if (found === false) {
					this.element.val(text);
				}
			} else {
				return this.element.val();
			}
    },

    value: function(value) {
      /// <function>value</function>
      /// <typedef>value: (value: any) => void</typedef>
      /// <summary>Set or get the value for the selected data item.</summary>
      /// <param name="value" type="Object">Value of the item to be selected.</param>
			/// <example for="JavaScript" description="Set the value for the data item in the DataSource to be selected.">
			/// $(".selector").data("serenityAutocomplete").value(1);
			/// </example>
			/// <example for="JavaScript" description="Get the value for the selected item in the list.">
			/// var value = $(".selector").data("serenityAutocomplete").value();
			/// </example>
      /// <version added="2016.1" updated="2017.3" />

      if (typeof value !== "undefined") {
	      var that = this;

				this._dataSource.view().ForEach(function(item, idx) {
					if (item[that.options.valueField] === value) {
						that.options.value = value;
						that.options.text = item[that.options.textField];
						that.options.index = idx;
						that.refresh();
						return false;
					}
				});
        return this;
      } else {
        var dataItem = this.dataItem();
        if (typeof dataItem === "object") {
          value = dataItem[this.options.valueField];
          return value;
        }
      }
    },

    refresh: function() {
      /// <function>refresh</function>
      /// <typedef>refresh: () => void</typedef>
      /// <summary>Reloads the input item list from the data source.</summary>
			/// <example for="JavaScript" description="Re-render the list.">
			/// $(".selector").data("serenityAutocomplete").refresh();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this.element.empty();

      if (this._dataSourceValid()) {
        var that = this;
        var view = this._dataSource.view();
        var list = [];
        var selected = null;

        view.ForEach(function(dataItem, index) {
          var text = dataItem[that.options.textField];
          list.push(text);
          if (that.options.index === index) {
            selected = text
          }
        });

        try {
          this.option("source", list);
          if (selected !== null) {
            this.element.val(selected);
          }
        } catch (err) {
          // console.log(err);
        }

        this._trigger("dataBound");

        if (this.options.height !== null) {
          this.menu.element.css({
            "max-height": this.options.height + "px",
            "overflow-y": "auto",
            "overflow-x": "hidden"
          });
        }
      }
    }
  });
})(window.jQuery, window.serenity);


/*
 * Events
 */

/// <event>dataBound</event>
/// <summary>Triggered when the list has been populated from the DataSource.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <example for="JavaScript" description="Initialize the autocomplete with the dataBound callback specified">
/// $(".selector").serenityAutocomplete({
///   dataBound: function (event, ui) {
///     console.log("dataBound event raised");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />