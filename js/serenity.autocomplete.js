/**
 * Serenity UI v2017.1.170720 (https://www.serenityui.com)
 */
(function ($, serenity) {
    $.widget("serenity.autocomplete", $.ui.autocomplete, serenity._dataWidgetDef);

    $.widget("serenity.autocomplete", $.serenity.autocomplete, {
        /// <widget>serenity.autocomplete</widget>
        /// <inherits url="https://api.jqueryui.com/autocomplete/">ui.autocomplete</inherits>
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
        
        options: {
            /// <option>dataSource</option>
            /// <datatype>serenity.DataSource</datatype>
            /// <default>[]</default>
            /// <typedef>dataSource: serenity.DataSource</typedef>
            /// <summary>Data to be displayed in the input's dropdown list.</summary>
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
            /// <summary>Provide the HTML to be used when the data item is rendered as a list item.</summary>
            /// <version added="2016.1" updated="2016.1" />
            itemTemplate: null,

            /// <option>text</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>text: string</typedef>
            /// <summary>The text of the item to be initially selected.</summary>
            /// <version added="2016.1" updated="2016.1" />
            text: null,

            /// <option>textField</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>textField: string</typedef>
            /// <summary>The field in the dataSource to be displayed for the items in the list.</summary>
            /// <version added="2016.1" updated="2016.1" />
            textField: null,

            /// <option>value</option>
            /// <datatype>any</datatype>
            /// <default>null</default>
            /// <typedef>value: any</typedef>
            /// <summary>The value of the item to be initially selected.</summary>
            /// <version added="2016.1" updated="2016.1" />
            value: null,

            /// <option>valueField</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>valueField: string</typedef>
            /// <summary>The field in the dataSource that is the value for the items in the list.</summary>
            /// <version added="2016.1" updated="2016.1" />
            valueField: null,

            source: []
        },

        _create: function () {
            /// <summary>Constructor for the input.</summary>
            /// <version added="2016.1" updated="2016.1" />
            
            this._super();

            this.element.css("padding", "5px");

            this.setDataSource(this.options.dataSource);
        },

        _onDataSourceChange: function () {
            /// <summary>When a change is made to the DataSource, refresh the list.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.refresh();
        },

        _renderItem: function (ul, item) {
            /// <summary>Method that controls the creation of each option in the widget's menu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;
            var $li = this._super(ul, item);

            if (this._dataSourceValid() && this.options.itemTemplate !== null) {
                var text = $li.text();
                var dataItem = this._dataSource.view().Where(function (e) { return e[that.options.textField] === text }).FirstOrDefault();
                var html = this.options.itemTemplate(dataItem);
                $li.html(html);
            }

            return $li;
        },

        dataItem: function () {
            /// <function>dataItem</function>
            /// <typedef>dataItem: () => any</typedef>
            /// <summary>Get the data item for the selected option.</summary>
            /// <return type="JSON Object">The data item for the selected option.</return>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            var value = this.element.val();

            return this._dataSource.view()
                .Where(function (e) {
                    return e[that.options.textField] == value;
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
                if (item[that.options.textField] === text) {
                    that.options.value = item[that.options.valueField];
                    that.options.text = text;
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

            var that = this;

            this._dataSource.view().ForEach(function (item, idx) {
                if (item[that.options.valueField] === value) {
                    that.options.value = value;
                    that.options.text = item[that.options.textField];
                    that.options.index = idx;
                    that.refresh();
                    return false;
                }
            });
        },

        refresh: function () {
            /// <function>refresh</function>
            /// <typedef>refresh: () => void</typedef>
            /// <summary>Reloads the input item list from the data source.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.element.empty();

            if (this._dataSourceValid()) {
                var that = this;
                var view = this._dataSource.view();
                var list = [];
                var selected = null;

                view.ForEach(function (dataItem, index) {
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

                this._trigger("load");

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

/// <event>load</event>
/// <summary>Triggered when the list has been populated from the DataSource.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <version added="2016.1" updated="2016.1" />
