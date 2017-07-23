/**
 * Serenity UI v2017.1.170722 (https://www.serenityui.com)
 */
(function ($, serenity) {
    $.widget("serenity.dropdownlist", $.ui.selectmenu, $.extend(true, {}, serenity._dataWidgetDef));

    $.widget("serenity.dropdownlist", $.serenity.dropdownlist, {
        /// <widget>serenity.dropdownlist</widget>
        /// <inherits url="https://api.jqueryui.com/selectmenu/">ui.selectmenu</inherits>
        /// <typedef>interface DropDownList extends JQueryUI.SelectMenu</typedef>
        /// <typedef for="JQuery">serenityDropdownlist(): JQuery</typedef>
        /// <typedef for="JQuery">serenityDropdownlist(options: any): JQuery</typedef>
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
        /// <version added="2016.1" updated="2016.1" />
        
        _previousIndex: null,

        options: {
            /// <option>dataSource</option>
            /// <datatype>serenity.DataSource</datatype>
            /// <default>[]</default>
            /// <typedef>dataSource: serenity.DataSource</typedef>
            /// <summary>Data to be displayed in the dropdownlist.</summary>
            /// <version added="2016.1" updated="2016.1" />
            dataSource: [],

            /// <option>height</option>
            /// <datatype>Number</datatype>
            /// <default>null</default>
            /// <typedef>height: number</typedef>
            /// <summary>Height of the dropdown list.</summary>
            /// <version added="2016.1" updated="2016.1" />
            height: null,

            /// <option>index</option>
            /// <datatype>Number</datatype>
            /// <default>null</default>
            /// <typedef>index: number</typedef>
            /// <summary>The index of the option to be initially selected.</summary>
            /// <version added="2016.1" updated="2016.1" />
            index: null,

            /// <option>itemTemplate</option>
            /// <datatype>Function</datatype>
            /// <default>null</default>
            /// <typedef>itemTemplate: any</typedef>
            /// <summary>Provide the HTML to be used when the data item is rendered as a menu item.</summary>
            /// <example for="JavaScript" description="Define a function to render the menu item in italic">
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
            /// </example>
            /// <example for="JavaScript" description="Define a Handlebars template to render the menu item in italic">
            /// $("#dropdownlist").serenityDropdownlist({
            ///   dataSource: [
            ///     { id: 1, text: "Item 1" },
            ///     { id: 2, text: "Item 2" }
            ///   ],
            ///   valueField: "id",
            ///   textField: "text",
            ///   itemTemplate: Handlebars.compile("<span style='font-style:italic;'>{{text}}</span>")
            /// })
            /// </example>
            /// <version added="2016.1" updated="2016.1" />
            itemTemplate: null,

            /// <option>textTemplate</option>
            /// <datatype>Function</datatype>
            /// <default>null</default>
            /// <typedef>textTemplate: any</typedef>
            /// <summary>Provide the HTML to be used when the selected data item is rendered as the text for the dropdownlist.</summary>
            /// <example for="JavaScript" description="Define a function to render the text in green">
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
            /// </example>
            /// <example for="JavaScript" description="Define a Handlebars template to render the text in green">
            /// $("#dropdownlist").serenityDropdownlist({
            ///   dataSource: [
            ///     { id: 1, text: "Item 1" },
            ///     { id: 2, text: "Item 2" }
            ///   ],
            ///   valueField: "id",
            ///   textField: "text",
            ///   textTemplate: Handlebars.compile("<span style='color:green;'>{{text}}</span>")
            /// })
            /// </example>
            /// <version added="2016.1" updated="2016.1" />
            textTemplate: null,

            /// <option>text</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>text: string</typedef>
            /// <summary>The text of the item to be initially selected.</summary>
            /// <version added="2016.1" updated="2016.1" />
            text: null,

            /// <option>textField</option>
            /// <datatype>String</datatype>
            /// <default>"text"</default>
            /// <typedef>textField: string</typedef>
            /// <summary>The field in the dataSource to be displayed for the items in the menu.</summary>
            /// <version added="2016.1" updated="2016.1" />
            textField: "text",

            /// <option>value</option>
            /// <datatype>any</datatype>
            /// <default>null</default>
            /// <typedef>value: any</typedef>
            /// <summary>The value of the item to be initially selected.</summary>
            /// <version added="2016.1" updated="2016.1" />
            value: null,

            /// <option>valueField</option>
            /// <datatype>String</datatype>
            /// <default>value</default>
            /// <typedef>valueField: string</typedef>
            /// <summary>The field in the dataSource that is the value for the items in the menu.</summary>
            /// <version added="2016.1" updated="2016.1" />
            valueField: "value"
        },

        html: {
            option: Handlebars.compile("<option {{attr}}>{{text}}</option>", { noEscape: true })
        },

        _create: function () {
            /// <summary>Constructor for the dropdownlist.</summary>
            /// <version added="2016.1" updated="2016.1" />
            
            this._super();

            this.setDataSource(this.options.dataSource);
        },

        _onDataSourceChange: function () {
            /// <summary>When a change is made to the DataSource, refresh the list.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.refresh();
        },

        _select: function (item, event) {
            /// <summary>Override and capture the index of the previous item.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this._previousIndex = this.element[0].selectedIndex;

            this._super(item, event);
        },

        _renderButtonItem: function (item) {
            /// <summary>Override and implement the method that controls the creation of the button text.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var buttonItem = this._super(item);

            if (typeof this.options.textTemplate === "function" && this._dataSourceValid()) {
                var textField = this.options.textField;
                var dataItem = this._dataSource.view()
                    .Where(function (e) {
                        return e[textField] === item.label;
                    })
                    .FirstOrDefault();
                var html = this.options.textTemplate(dataItem);
                buttonItem.html(html);
            }

            return buttonItem;
        },

        _renderItem: function (ul, item) {
            /// <summary>Override and implement the method that controls the creation of each option in the widget's menu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var $li = this._super(ul, item);

            if (this._dataSourceValid() && this.options.itemTemplate !== null) {
                var index = $li.index();
                var dataItem = this._dataSource.view().ElementAt(index);
                var html = this.options.itemTemplate(dataItem);
                $li.children("div").html(html);
            }

            return $li;
        },

        open: function () {
            /// <summary>Override the open function and show the selected item in the menu.</summary>

            this._super();

            var el = this._getSelectedItem().get(0);
            el.parentNode.scrollTop = el.offsetTop;
        },

        previousDataItem: function () {
            /// <function>previousDataItem</function>
            /// <typedef>previousDataItem: () => any</typedef>
            /// <summary>Get the data item for the previous selected option.</summary>
            /// <return type="JSON Object">The data item for the previous selected option.</return>
            /// <version added="2016.1" updated="2016.1" />

            var dataItem = null;

            if (typeof this._previousIndex === "number") {
                try {
                    dataItem = this.dataSource().view().Skip(this._previousIndex).Take(1).First();
                } catch (err) {
                }
            }
            return dataItem;
        },

        dataItem: function () {
            /// <function>dataItem</function>
            /// <typedef>dataItem: () => any</typedef>
            /// <summary>Get the data item for the selected option.</summary>
            /// <return type="JSON Object">The data item for the selected option.</return>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            var value = this.element.select().find("option:selected").val();

            return this._dataSource.view()
                .Where(function (e) {
                    return JSON.stringify(e[that.options.valueField]) == value;
                })
                .FirstOrDefault();
        },

        setDataSource: function (ds) {
            /// <function>setDataSource</function>
            /// <typedef>setDataSource: (ds: serenity.DataSource) => void</typedef>
            /// <summary>Set the data source.</summary>
            /// <param name="ds" type="serenity.DataSource">Contains the data to be displayed in the dropdownlist.</param>
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

        index: function (index) {
            /// <function>index</function>
            /// <typedef>index: (index: number) => void</typedef>
            /// <summary>Set the index for the selected data item.</summary>
            /// <param name="index" type="Number">Index of the item to be selected.</param>
            /// <version added="2016.1" updated="2016.1" />

            this.options.index = index;
            this.refresh();
        },

        text: function (text) {
            /// <function>text</function>
            /// <typedef>text: (text: string) => void</typedef>
            /// <summary>Set the text for the data item to be selected.</summary>
            /// <param name="text" type="String">Text of the item to selected.</param>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            this._dataSource.view().ForEach(function (item, idx) {
                if (item[that.options.textField] == text) {
                    that.options.value = item[that.options.valueField];
                    that.options.text = item[that.options.textField];
                    that.options.index = idx;
                    that.refresh();
                    return false;
                }
            });
        },

        value: function (value) {
            /// <function>value</function>
            /// <typedef>value: (value: any) => void</typedef>
            /// <summary>Set the value for the selected data item.</summary>
            /// <param name="value" type="Object">Value of the item to be selected.</param>
            /// <version added="2016.1" updated="2016.1" />

            var that = this,
                hasSelected = this.element.select().find("option:selected").length > 0;

            if (hasSelected === false || this.options.value !== value) {
                this._dataSource.view().ForEach(function (item, idx) {
                    if (item[that.options.valueField] == value) {
                        that.options.value = item[that.options.valueField];
                        that.options.text = item[that.options.textField];
                        that.options.index = idx;
                        that.refresh();
                        return false;
                    }
                });
            }
        },

        refresh: function () {
            /// <function>refresh</function>
            /// <typedef>refresh: () => void</typedef>
            /// <summary>Parses the original element and re-renders the menu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.element.empty();

            if (this._dataSourceValid()) {
                var view = this._dataSource.view();
                var that = this;

                view.ForEach(function (dataItem, index) {
                    var $option = $(that.html.option({
                        attr: that.options.valueField !== null ? serenity.format("value='{0}'", JSON.stringify(dataItem[that.options.valueField])) : "",
                        text: that.options.textField !== null ? dataItem[that.options.textField] : ""
                    }));

                    if (that.options.index === index) {
                        $option.attr("selected", "selected"); 
                    }

                    that.element.append($option);
                });

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
        }
    });
})(window.jQuery, window.serenity);

/// <event>dataBound</event>
/// <summary>Triggered when the list has been populated from the DataSource.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <version added="2016.1" updated="2016.1" />
