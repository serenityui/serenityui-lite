/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
(function($, serenity) {
  $.widget("serenity.dropdownlist", $.ui.selectmenu, $.extend(true, {}, serenity._dataWidgetDef));

  $.widget("serenity.dropdownlist", $.serenity.dropdownlist, {
    /// <widget>serenity.dropdownlist</widget>
    /// <inherits url="https://api.jqueryui.com/selectmenu/">ui.selectmenu</inherits>
		/// <inherits url="serenity.datawidget.html">serenity.datawidget</inherits>
    /// <summary>A list of selectable items in a dropdown.</summary>
    /// <element>select</element>
    /// <gettingstarted>
    /// <![CDATA[
    /// <select id="dropdownlist"></select>
    ///
    /// <script>
    ///   var colors = new serenity.DataSource({
    ///     data: [{ id: 1, text: "Red" }, { id: 2, text: "Blue" }, { id: 2, text: "Green" }]
    ///   });
    /// 
    ///   $("#dropdownlist").serenityDropdownlist({
    ///     valueField: "id", 
    ///     textField: "text", 
    ///     dataSource: colors
    ///   });
    /// </script>
    /// ]]>
    /// </gettingstarted>
    /// <version added="2016.1" updated="2017.1" />

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

    _previousValue: null,

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      /// <option>dataSource</option>
      /// <datatype>serenity.DataSource</datatype>
      /// <default>[]</default>
      /// <summary>Data to be displayed in the dropdownlist.</summary>
      /// <example for="JavaScript" description="Initialize the dropdownlist with the dataSource option specified as a serenity.DataSource">
      /// <![CDATA[
      /// $("#dropdownlist").serenityDropdownlist({
      ///   dataSource: new serenity.DataSource({
			///     data: [
      ///       { id: 1, text: "Item 1" },
      ///       { id: 2, text: "Item 2" }
      ///     ]
      ///   })
      /// })
      /// ]]>
      /// </example>
      /// <example for="JavaScript" description="Initialize the dropdownlist with the dataSource option specified as an Array">
      /// <![CDATA[
      /// $("#dropdownlist").serenityDropdownlist({
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
      /// <summary>Height of the dropdown list.</summary>
      /// <example for="JavaScript" description="Initialize the dropdownlist with the height option specified">
      /// <![CDATA[
      /// $("#dropdownlist").serenityDropdownlist({
      ///   height: 250
      /// })
      /// ]]>
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      height: null,

      /// <option>index</option>
      /// <datatype>Number</datatype>
      /// <default>null</default>
      /// <summary>The index of the option to be initially selected.</summary>
      /// <example for="JavaScript" description="Initialize the dropdownlist with the index option specified">
      /// <![CDATA[
      /// $("#dropdownlist").serenityDropdownlist({
      ///   index: 2
      /// })
      /// ]]>
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      index: null,

      /// <option>itemTemplate</option>
      /// <datatype>Function</datatype>
      /// <default>null</default>
      /// <summary>Provide the HTML to be used when the data item is rendered as a menu item.</summary>
      /// <example for="JavaScript" description="Define a function to render the menu item in italic">
	    /// <![CDATA[
      /// $("#dropdownlist").serenityDropdownlist({
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
      /// $("#dropdownlist").serenityDropdownlist({
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

      /// <option>placeholder</option>
      /// <datatype>JSON Object</datatype>
      /// <summary>
			/// An option to be displayed when no option has been selected. The placeholder.text option must be set to a string for the placeholder to render.
			/// </summary>
      /// <example for="JavaScript" description="Define a placeholder that will display 'Select...' as the text and have a value of zero.">
      /// $("#dropdownlist").serenityDropdownlist({
      ///   dataSource: [
      ///     { id: 1, text: "Item 1" },
      ///     { id: 2, text: "Item 2" }
      ///   ],
      ///   valueField: "id",
      ///   textField: "text",
      ///   placeholder: {
      ///     value: 0,
      ///     text: "Select..."
      ///   }
      /// })
      /// </example>
      /// <version added="2017.1" updated="2017.1" />
      placeholder: {
				/// <option>placeholder.value</option>
				/// <datatype>Object</datatype>
				/// <default>true</default>
				/// <summary>The value for the placeholder item.</summary>
				/// <example for="JavaScript" description="Initialize the dropdownlist with the placeholder.value option specified">
				/// <![CDATA[
				/// $("#dropdownlist").serenityDropdownlist({
				///   placeholder: { value: 0 }
				/// })
				/// ]]>
				/// </example>
				/// <version added="2017.1" updated="2017.1" />
				value: null,

				/// <option>placeholder.text</option>
				/// <datatype>String</datatype>
				/// <summary>The text for the placeholder item.</summary>
				/// <example for="JavaScript" description="Initialize the dropdownlist with the placeholder.text option specified">
				/// <![CDATA[
				/// $("#dropdownlist").serenityDropdownlist({
				///   placeholder: { text: "Select..." }
				/// })
				/// ]]>
				/// </example>
				/// <version added="2017.1" updated="2017.1" />
				text: null,

				/// <option>placeholder.template</option>
				/// <datatype>Function</datatype>
				/// <summary>A template for rendering the text when the placeholder item is selected or displayed in the list.</summary>
				/// <example for="JavaScript" description="Initialize the dropdownlist with the placeholder.template option specified">
				/// <![CDATA[
				/// $("#dropdownlist").serenityDropdownlist({
				///   placeholder: { template: Handlebars.compile("<span style='font-style:italic;'>{{text}}</span>" }
				/// })
				/// ]]>
				/// </example>
				/// <version added="2017.1" updated="2017.1" />
				template: null,

				/// <option>placeholder.showInList</option>
				/// <datatype>Boolean</datatype>
				/// <default>true</default>
				/// <summary>Flag indicating whether the placeholder should be displayed as an item in the list or not.</summary>
				/// <example for="JavaScript" description="Initialize the dropdownlist with the placeholder.showInList option specified">
				/// <![CDATA[
				/// $("#dropdownlist").serenityDropdownlist({
				///   placeholder: { showInList: false }
				/// })
				/// ]]>
				/// </example>
				/// <version added="2017.1" updated="2017.1" />
				showInList: true
			},
      
      /// <option>textTemplate</option>
      /// <datatype>Function</datatype>
      /// <default>null</default>
      /// <summary>Provide the HTML to be used when the selected data item is rendered as the text for the dropdownlist.</summary>
      /// <example for="JavaScript" description="Define a function to render the text in green">
	    /// <![CDATA[
      /// $("#dropdownlist").serenityDropdownlist({
      ///   dataSource: [
      ///     { id: 1, text: "Item 1" },
      ///     { id: 2, text: "Item 2" }
      ///   ],
      ///   valueField: "id",
      ///   textField: "text",
      ///   textTemplate: function (dataItem) {
      ///     return serenity.format("<span style='color:green;'>{0}</span>", dataItem.text);
      ///   }
      /// })
			/// ]]>
      /// </example>
      /// <example for="JavaScript" description="Define a Handlebars template to render the text in green">
	    /// <![CDATA[
      /// $("#dropdownlist").serenityDropdownlist({
      ///   dataSource: [
      ///     { id: 1, text: "Item 1" },
      ///     { id: 2, text: "Item 2" }
      ///   ],
      ///   valueField: "id",
      ///   textField: "text",
      ///   textTemplate: Handlebars.compile("<span style='color:green;'>{{text}}</span>")
      /// })
			/// ]]>
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      textTemplate: null,

      /// <option>text</option>
      /// <datatype>String</datatype>
      /// <default>null</default>
      /// <summary>The text of the item to be initially selected.</summary>
			/// <example for="JavaScript" description="Initialize the dropdownlist with the text option specified">
      /// $("#dropdownlist").serenityDropdownlist({
      ///   text: "Item 1"
      /// })
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      text: null,

      /// <option>textField</option>
      /// <datatype>String</datatype>
      /// <default>"text"</default>
      /// <summary>The field in the dataSource to be displayed for the items in the menu.</summary>
			/// <example for="JavaScript" description="Initialize the dropdownlist with the textField option specified">
      /// $("#dropdownlist").serenityDropdownlist({
      ///   textField: "fullName"
      /// })
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      textField: "text",

      /// <option>value</option>
      /// <datatype>any</datatype>
      /// <default>null</default>
      /// <summary>The value of the item to be initially selected.</summary>
			/// <example for="JavaScript" description="Initialize the dropdownlist with the value option specified">
      /// $("#dropdownlist").serenityDropdownlist({
      ///   value: 1
      /// })
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      value: null,

      /// <option>valueField</option>
      /// <datatype>String</datatype>
      /// <default>value</default>
      /// <summary>The field in the dataSource that is the value for the items in the menu.</summary>
			/// <example for="JavaScript" description="Initialize the dropdownlist with the valueField option specified">
      /// $("#dropdownlist").serenityDropdownlist({
      ///   valueField: "employeeId"
      /// })
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      valueField: "value"
    },

    html: {
      option: Handlebars.compile("<option {{attr}}>{{text}}</option>", {
        noEscape: true
      })
    },

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

    _create: function() {
      /// <summary>Constructor for the dropdownlist.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this._super();

      this.setDataSource(this.options.dataSource);
    },

    /***************************************************************************
     *
     * EVENT HANDLERS
     *
     **************************************************************************/

    _onDataSourceChange: function() {
      /// <summary>When a change is made to the DataSource, refresh the list.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this.refresh();
    },

		/***************************************************************************
     *
     * PROTECTED OVERRIDE METHODS
     *
     **************************************************************************/

    _select: function(item, event) {
      /// <summary>Override and capture the index of the previous item.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this._previousValue = this.element.find(":selected").val();

      this._super(item, event);
    },

    _renderButtonItem: function(item) {
      /// <summary>Override and implement the method that controls the creation of the button text.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var buttonItem = this._super(item);

      if (this.options.placeholder.text !== null && item.index === 0) {
        var text = this.options.placeholder.template !== null
          ? this.options.placeholder.template(this.options.placeholder)
          : this.options.placeholder.text;
        buttonItem.html(text);
      } else if (typeof this.options.textTemplate === "function" && this._dataSourceValid()) {
        var textField = this.options.textField;
        var dataItem = this._dataSource.view()
          .Where(function(e) {
            return e[textField] === item.label;
          })
          .FirstOrDefault();
        var html = this.options.textTemplate(dataItem);
        buttonItem.html(html);
      }

      return buttonItem;
    },

    _renderItem: function(ul, item) {
      /// <summary>Override and implement the method that controls the creation of each option in the widget's menu.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var $li = this._super(ul, item);

			try {
				// If the list item is for the placeholder.
				if (this.options.placeholder.text !== null && this.options.placeholder.showInList === true && $li.index() === 0) {
					// If the placeholder has a template...
					if (typeof this.options.placeholder.template === "function") {
						$li.children("div").html(this.options.placeholder.template(this.options.placeholder));
					}
				} else {
					if (this._dataSourceValid() && this.options.itemTemplate !== null) {
						var index = $li.index();
						if (this.options.placeholder.text !== null && this.options.placeholder.showInList === true) {
							index -= 1;
						}
						var dataItem = this._dataSource.view().ElementAt(index);
						var html = this.options.itemTemplate(dataItem);
						$li.children("div").html(html);
					}
				}
			} catch (err) {
				console.log(err);
			}
      
      return $li;
    },

		/***************************************************************************
     *
     * PROTECTED METHODS
     *
     **************************************************************************/
		
		_renderOptions: function() {
			
			var selectedIndex = this.options.index;
			var view = this._dataSource.view();
			var that = this;

			// If the placeholder option is set...
			if (this.options.placeholder.text !== null && this.options.placeholder.showInList === true) {
				var value = this.options.placeholder.value !== null
					? this.options.placeholder.value
					: "";
				var text = this.options.placeholder.text;

				// Create the placeholder option.
				var $option = $(this.html.option({
					attr: serenity.format("value='{0}'", value),
					text: text
				}));

				if (selectedIndex === null) {
					$option.attr("selected", "selected");
				}

				// Add the placeholder option.
				that.element.append($option);
			}

			view.ForEach(function(dataItem, index) {
				var $option = $(that.html.option({
					attr: that.options.valueField !== null 
						? serenity.format("value='{0}'", 
								typeof dataItem[that.options.valueField] === "object" 
									? JSON.stringify(dataItem[that.options.valueField]) 
									: dataItem[that.options.valueField]) 
						: "",
					text: that.options.textField !== null ? dataItem[that.options.textField] : ""
				}));

				if (selectedIndex === index) {
					$option.attr("selected", "selected");
				}

				that.element.append($option);
			});
		},

		/***************************************************************************
     *
     * PUBLIC OVERRIDE METHODS
     *
     **************************************************************************/

    open: function() {
      /// <summary>Override the open function and show the selected item in the menu.</summary>

      this._super();

      var el = this._getSelectedItem().get(0);
      el.parentNode.scrollTop = el.offsetTop;
    },

    setDataSource: function(ds) {
      /// <function>setDataSource</function>
      /// <summary>Set the data source.</summary>
      /// <param name="ds" type="serenity.DataSource">Contains the data to be displayed in the dropdownlist.</param>
			/// <example for="JavaScript" description="Set the DataSource for the dropdownlist.">
			/// $("#dropdownlist").data("serenityDropdownlist").setDataSource(new serenity.DataSource({ data: employees }));
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

    refresh: function() {
      /// <function>refresh</function>
      /// <summary>Parses the original element and re-renders the menu.</summary>
			/// <example for="JavaScript" description="Re-render the dropdownlist.">
			/// $("#dropdownlist").data("serenityDropdownlist").refresh();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this.element.empty();

      if (this._dataSourceValid()) {
				this._renderOptions();
				
        try {
          this._super();
        } catch (err) {
          // console.log(err);
        }

        this._trigger("dataBound");

        if (this.options.height !== null) {
          this.menuWidget().css("height", this.options.height + "px");
        }
      }
    },
		
    /***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/

    previousDataItem: function() {
      /// <function>previousDataItem</function>
      /// <summary>Get the data item for the previous selected option.</summary>
      /// <return type="JSON Object">The data item for the previous selected option.</return>
			/// <example for="JavaScript" description="Get the data from the DataSource for the previously selected menu item.">
			/// var previousDataItem = $("#dropdownlist").data("serenityDropdownlist").previousDataItem();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var dataItem = null;

      if (this._previousValue !== null) {
        try {
          // If a placeholder has been specified...
          if (this.options.placeholder.text !== null && this.options.placeholder.value == this._previousValue) {
            // Set the dataItem to the placeholder.
            dataItem = { placeholder: true };
            dataItem[this.options.textField] = this.options.placeholder.text;
            dataItem[this.options.valueField] = value;
          } else {
            var that = this;
            dataItem = this.dataSource().view()
              .Where(function (item) {
								if (typeof item[that.options.valueField] === "object") {
									return JSON.stringify(item[that.options.valueField]) == that._previousValue;
								} else {
									return item[that.options.valueField] == that._previousValue;
								}
              })
              .FirstOrDefault();
          }
        } catch (err) {
          
        }
      }
      return dataItem;
    },

    dataItem: function() {
      /// <function>dataItem</function>
      /// <summary>Get the data item for the selected option.</summary>
      /// <return type="JSON Object">The data item for the selected option.</return>
			/// <example for="JavaScript" description="Get the data from the DataSource for the currently selected menu item.">
			/// var dataItem = $("#dropdownlist").data("serenityDropdownlist").dataItem();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      var value = this.element.select().find("option:selected").val();

      var dataItem = this._dataSource.view()
        .Where(function(item) {
					if (typeof item[that.options.valueField] === "object") {
	          return JSON.stringify(item[that.options.valueField]) == value;
					} else {
	          return item[that.options.valueField] == value;
					}
        })
        .FirstOrDefault();
      
      // The dataItem was not found in the dataSource.
      if (typeof dataItem === "undefined") {
        // Set the dataItem to an empty JSON object.
        dataItem = {};
        // If the placeholder option has been set and the option value
        // is the placeholder value...
        if (this.options.placeholder.text !== null && this.options.placeholder.value == value) {
          dataItem.placeholder = true;
          dataItem[this.options.textField] = this.options.placeholder.text;
          dataItem[this.options.valueField] = value;
        }
      }
      
      return dataItem;
    },

    index: function(index) {
      /// <function>index</function>
      /// <summary>Set the index for the selected data item.</summary>
      /// <param name="index" type="Number">Index of the item to be selected.</param>
			/// <example for="JavaScript" description="Set the index for the data item in the DataSource to be selected.">
			/// $("#dropdownlist").data("serenityDropdownlist").index(1);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this.options.index = index;
      this.refresh();
    },

    text: function(text) {
      /// <function>text</function>
      /// <summary>Set the text for the data item to be selected.</summary>
      /// <param name="text" type="String">Text of the item to selected.</param>
			/// <example for="JavaScript" description="Set the text for the data item in the DataSource to be selected.">
			/// $("#dropdownlist").data("serenityDropdownlist").text("Item 1");
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      this._dataSource.view().ForEach(function(item, idx) {
        if (item[that.options.textField] == text) {
          that.options.value = item[that.options.valueField];
          that.options.text = item[that.options.textField];
          that.options.index = idx;
          that.refresh();
          return false;
        }
      });
    },

    value: function(value) {
      /// <function>value</function>
      /// <summary>Set or get the value for the selected data item.</summary>
      /// <param name="value" type="Object" optional="true">Value of the item to be selected.</param>
      /// <return type="Object" optional="true">If no parameter is passed in, then the value of the selected item is returned.</return>
			/// <example for="JavaScript" description="Set the value for the data item in the DataSource to be selected.">
			/// $("#dropdownlist").data("serenityDropdownlist").value(1);
			/// </example>
			/// <example for="JavaScript" description="Get the value for the selected item in the list.">
			/// var value = $("#dropdownlist").data("serenityDropdownlist").value();
			/// </example>
      /// <version added="2016.1" updated="2017.3" />

      if (typeof value !== "undefined") {
        var that = this,
          hasSelected = this.element.select().find("option:selected").length > 0;

        if (hasSelected === false || this.options.value !== value) {
          this._dataSource.view().ForEach(function(item, idx) {
            if (item[that.options.valueField] == value) {
              that.options.value = item[that.options.valueField];
              that.options.text = item[that.options.textField];
              that.options.index = idx;
              that.refresh();
              return false;
            }
          });
        }
        return this;
      } else {
        var dataItem = this.dataItem();
        if (typeof dataItem === "object") {
          value = dataItem[this.options.valueField];
          return value;
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
/// <example for="JavaScript" description="Initialize the dropdownlist with the dataBound callback specified">
/// $("#dropdownlist").serenityDropdownlist({
///   dataBound: function (event, ui) {
///     console.log("dataBound event raised");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />
