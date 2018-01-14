/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
(function($, serenity) {
  
    $.widget("serenity.listview", $.serenity.datawidget, {
        /// <widget>serenity.listview</widget>
        /// <inherits url="serenity.datawidget.html">serenity.datawidget</inherits>
        /// <summary>Listview displays a list of items that can be viewed using one of 2 different modes.</summary>
        /// <gettingstarted>
        /// <![CDATA[
        /// <div id="listview"></div>
        ///
        /// <script>
        /// $("#listview").serenityListview({
        ///   dataSource: employees,
        ///   titleField: "fullName",
        ///   selectable: true,
        ///   mode: "tile"
        /// });
        /// </script>
        /// ]]>
        /// </gettingstarted>
        /// <element>div</element>
        /// <version added="2017.4" updated="2017.4" />

        /***************************************************************************
         *
         * PRIVATE MEMBER VARIABLES
         *
         **************************************************************************/

        _mode: null,

        html: {
            heading: "<div class='sr-listview-heading ui-widget-content'><select class='sr-listview-mode'></select></div>",
            body: "<div class='sr-listview-body'></div>",
            pager: "<div class='sr-listview-pager'></div>",
            list: {
                item: "<div class='sr-listview-item sr-{{mode.view}}-mode'><div class='sr-content'>{{content}}</div></div>"
            },
            tile: {
                item: "<div class='sr-listview-item sr-{{mode.view}}-mode sr-content'>{{content}}</div>"
            } 
        },

        /***************************************************************************
         *
         * OPTIONS
         *
         **************************************************************************/

        options: {
            /// <option>mode</option>
            /// <datatype>String | Object</datatype>
            /// <default>"list"</default>
            /// <summary>
            /// <![CDATA[
            /// The initial mode to view the litems in the listview.
            /// <p>Options are:
            /// <ul>
            /// <li>list</li>
            /// <li>tile</li>
            /// </ul>
            /// </p>
            /// ]]>
            /// </summary>
            /// <example for="JavaScript" description="Initialize the listview with the mode option specified">
            /// $(".selector").serenityListview({
            ///   mode: "tile"
            /// });
            /// </example>
            /// <version added="2017.4" updated="2017.4" />
            mode: "list",

            // See bottom for mode options.

            /// <option>selectable</option>
            /// <datatype>Boolean</datatype>
            /// <default>false</default>
            /// <summary>
            /// Flag indicating whether the items in the listview can be selected.
            /// </summary>
            /// <example for="JavaScript" description="Initialize the listview with the selectable option specified">
            /// $(".selector").serenityListview({
            ///   selectable: true
            /// });
            /// </example>
            /// <version added="2017.4" updated="2017.4" />
            selectable: false,

            /// <option>pageable</option>
            /// <datatype>Boolean | Object</datatype>
            /// <default>false</default>
            /// <summary>
            /// Flag indicating whether the listview pager panel is displayed.
            /// </summary>
            /// <example for="JavaScript" description="Initialize the listview with the pageable option specified">
            /// $(".selector").serenityListview({
            ///   pageable: true
            /// });
            /// </example>
            /// <version added="2017.4" updated="2017.4" />
            pageable: false,

            // See bottom for pageable options.

            /// <option>list</option>
            /// <datatype>Object</datatype>
            /// <summary>
            /// Options for the listview when rendered in list mode.
            /// </summary>
            /// <version added="2017.4" updated="2017.4" />
            list: {
                /// <option>list.template</option>
                /// <datatype>String</datatype>
                /// <default>"{{titleField}}"</default>
                /// <summary>
                /// Template used to render the listview in list mode.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the list.template option specified">
                /// <![CDATA[
                /// $(".selector").serenityListview({
                ///   list: {
                ///     template: "<i class='fa fa-user' aria-hidden='true' style='margin-right:5px;'></i> {{titleField}}"
                ///   }
                /// });
                /// ]]>
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                template: "{{titleField}}",
                
                /// <option>list.templateSelector</option>
                /// <datatype>String</datatype>
                /// <default>null</default>
                /// <summary>
                /// CSS Selector for the HTML element that contains the template used to render the listview in list mode.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the list.templateSelector option specified">
                /// $(".selector").serenityListview({
                ///   list: {
                ///     templateSelector: "#listTemplate"
                ///   }
                /// });
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                templateSelector: null,
                
                /// <option>list.border</option>
                /// <datatype>Boolean</datatype>
                /// <default>true</default>
                /// <summary>
                /// Flag indicating whether a border is displayed around each item.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the list.border option specified">
                /// $(".selector").serenityListview({
                ///   list: {
                ///     border: true
                ///   }
                /// });
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                border: true,
                
                /// <option>list.selector</option>
                /// <datatype>String</datatype>
                /// <default>".sr-content"</default>
                /// <summary>
                /// CSS Selector of the HTML element that is selectable in the list item. By default the entire item is selected.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the list.selector option specified">
                /// <![CDATA[
                /// $(".selector").serenityListview({
                ///   list: {
                ///     template: "<i class='fa fa-user' aria-hidden='true' style='margin-right:5px;'></i> {{titleField}}",
                ///     selector: "i.fa-user"
                ///   }
                /// });
                /// ]]>
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                selector: ".sr-content",
                
                /// <option>list.selectedClass</option>
                /// <datatype>String</datatype>
                /// <default>"ui-state-active"</default>
                /// <summary>
                /// CSS Class to apply to the selected list item.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the list.selectedClass option specified">
                /// $(".selector").serenityListview({
                ///   list: {
                ///     selectedClass: "ui-state-highlight"
                ///   }
                /// });
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                selectedClass: "ui-state-active"
            },

            /// <option>tile</option>
            /// <datatype>Object</datatype>
            /// <summary>
            /// Options for the listview when rendered in tile mode.
            /// </summary>
            /// <version added="2017.4" updated="2017.4" />
            tile: {
                /// <option>tile.template</option>
                /// <datatype>String</datatype>
                /// <default>"{{titleField}}"</default>
                /// <summary>
                /// Template used to render the listview in list mode.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the tile.template option specified">
                /// <![CDATA[
                /// $(".selector").serenityListview({
                ///   tile: {
                ///     template: "<div style='font-weight:bold;width:100%;margin-top:10px;text-align:center;'>{{titleField}}</div>" + 
                ///               "<i class='fa fa-2x fa-user' aria-hidden='true' style='position:absolute;bottom:5px;right:5px;'></i>"
                ///   }
                /// });
                /// ]]>
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                template: "{{titleField}}",
                
                /// <option>tile.templateSelector</option>
                /// <datatype>String</datatype>
                /// <default>null</default>
                /// <summary>
                /// CSS Selector for the HTML element that contains the template used to render the listview in tile mode.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the tile.templateSelector option specified">
                /// $(".selector").serenityListview({
                ///   tile: {
                ///     templateSelector: "#tileTemplate"
                ///   }
                /// });
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                templateSelector: null,
                
                /// <option>tile.height</option>
                /// <datatype>Number</datatype>
                /// <default>150</default>
                /// <summary>
                /// Height in pixels for the tile.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the tile.height option specified">
                /// $(".selector").serenityListview({
                ///   tile: {
                ///     height: 200
                ///   }
                /// });
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                height: 150,
                
                /// <option>tile.width</option>
                /// <datatype>Number</datatype>
                /// <default>150</default>
                /// <summary>
                /// Width in pixels for the tile.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the tile.width option specified">
                /// $(".selector").serenityListview({
                ///   tile: {
                ///     width: 200
                ///   }
                /// });
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                width: 150,
                
                /// <option>tile.selector</option>
                /// <datatype>String</datatype>
                /// <default>".sr-content"</default>
                /// <summary>
                /// CSS Selector of the HTML element that is selectable in the tile. By default the entire tile is selected.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the tile.selector option specified">
                /// <![CDATA[
                /// $(".selector").serenityListview({
                ///   tile: {
                ///     template: "<div style='font-weight:bold;width:100%;margin-top:10px;text-align:center;'>{{titleField}}</div>" + 
                ///               "<i class='fa fa-2x fa-user' aria-hidden='true' style='position:absolute;bottom:5px;right:5px;'></i>",
                ///     selector: "i.fa-user"
                ///   }
                /// });
                /// ]]>
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                selector: ".sr-content",
                
                /// <option>tile.selectedClass</option>
                /// <datatype>String</datatype>
                /// <default>"ui-state-active"</default>
                /// <summary>
                /// CSS Class to apply to the selected tile.
                /// </summary>
                /// <example for="JavaScript" description="Initialize the listview with the tile.selectedClass option specified">
                /// $(".selector").serenityListview({
                ///   tile: {
                ///     selectedClass: "ui-state-highlight"
                ///   }
                /// });
                /// </example>
                /// <version added="2017.4" updated="2017.4" />
                selectedClass: "ui-state-active"
            },

      /// <option>titleField</option>
      /// <datatype>String</datatype>
      /// <default>"title"</default>
      /// <summary>The field in the dataSource to be displayed as the title for the items in the listview.</summary>
            /// <example for="JavaScript" description="Initialize the listview with the titleField option specified">
      /// $("#dropdownlist").serenityListview({
      ///   titleField: "fullName"
      /// })
      /// </example>
            /// <version added="2017.4" updated="2017.4" />
            titleField: "title",

            /// <option>height</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <summary>Height of the table.</summary>
            /// <example for="JavaScript" description="Initialize the table with the height option specified">
            /// $(".selector").serenityListview({
            ///   height: "400px"
            /// });
            /// </example>
            /// <version added="2017.4" updated="2017.4" />
            height: null,

            initialMode: {
                view: "list",
                selectable: false
            },
        },

        /***************************************************************************
         *
         * INITIALIZATION
         *
         **************************************************************************/

        _create: function() {
            /// <summary>Constructor for the tree.</summary>
            /// <version added="2017.4" updated="2017.4" />

            this._super();

            this.element.addClass("ui-widget-content");
            
            if (this.options.height !== null) {
                this.element.css("height", this.options.height);
                this.element.addClass("sr-fixed-height");
            }

            this._initMode();

            this._renderHeading();

            this._renderBody();

            this.setDataSource(this.options.dataSource);

            this._renderPager();
        },

        _initEventsHandlers: function () {
            /// <summary>Initialize event handlers for the widget.</summary>
            /// <version added="2017.4" updated="2017.4" />

            if (this.options.selectable === true) {
                this.widgets.body.find(this.options[this._mode.view].selector).on("click.serenityListview", $.proxy(this._onSelectItem, this));
            }
        },

        _initMode: function () {
            /// <summary>Set the initial mode for the widget.</summary>
            /// <version added="2017.4" updated="2017.4" />

            var mode = null;

            if (typeof this.options.mode === "string") {
                mode = {
                    view: this.options.mode
                };
            } else if (typeof this.options.mode === "object") {
                mode = this.options.mode;
            }

            this._mode = $.extend(this.options.initialMode, mode);
        },

        /***************************************************************************
         *
         * EVENT HANDLERS
         *
         **************************************************************************/

        _onSelectItem: function (e) {
            /// <summary>Handle the item click event.</summary>
            /// <version added="2017.4" updated="2017.4" />

            var $el = $(e.target);
            var idx = $el.closest(".sr-listview-item").index();
            var modeOptions = this.options[this._mode.view];

            if (typeof modeOptions.selectedClass === "string") {
                this.element.find(modeOptions.selector).removeClass(modeOptions.selectedClass);
                $el.addClass(modeOptions.selectedClass);
            }

            var item = this.dataSource().page().ElementAt(idx);

            this._trigger("select", e, { item: item });
        },

        _onModeChange: function (e) {
            /// <summary>Handle the mode dropdownlist change event.</summary>
            /// <version added="2017.4" updated="2017.4" />

            // alert(this.widgets.heading.mode.dataItem().text);
            this._mode.view = this.widgets.heading.mode.dataItem().value;

            this._trigger("modeChange", e, { mode: this._mode.view });

            this.render();
        },

        _onDataSourceChange: function(e) {
            /// <summary>Handle the dataSource change event.</summary>
            /// <version added="2017.4" updated="2017.4" />

            this.render();
        },

        /***************************************************************************
         *
         * PROTECTED METHODS
         *
         **************************************************************************/

        _renderHeading: function () {
            /// <summary>Render the widget heading if the mode is selectable.</summary>
            /// <version added="2017.4" updated="2017.4" />

            // Mode is selectable.
            if (this.options.mode.selectable === true) {
                // Add the heading.
                this.element.append(this.html.heading);
                this.widgets.heading = this.element.children(".sr-listview-heading");

                // Initialize the dropdown list to select a mode.
                this.widgets.heading.mode = this.widgets.heading.children(".sr-listview-mode").serenityDropdownlist({
                    dataSource: [
                        { value: "list", text: "List" },
                        { value: "tile", text: "Tile" }
                    ],
                    width: 100,
                    value: this._mode.view,
                    change: $.proxy(this._onModeChange, this)
                }).data("serenityDropdownlist");
            }
        },

        _renderBody: function () {
            /// <summary>Render the widget body.</summary>
            /// <version added="2017.4" updated="2017.4" />

            this.element.append(this.html.body);
            this.widgets.body = this.element.children(".sr-listview-body");

            // If the mode is selectable then make room for the heading.
            if (this.options.mode.selectable === true) {
                this.widgets.body.css("top", "40px");
            } else {
                this.widgets.body.css("top", "0px");
            }

            // If the widget is pageable, then make room for the pager.
            if (this.options.pageable === true) {
                this.widgets.body.css("bottom", "28px");
            } else {
                this.widgets.body.css("bottom", "0px");
            }
        },

        _renderPager: function () {
            /// <summary>Render the widget pager if the widget is pageable.</summary>
            /// <version added="2017.4" updated="2017.4" />

            if (this.options.pageable !== false) {
                var that = this;

                // Initialize the pager options.
                var options = $.extend(true, 
                    {}, 
                    {
                        dataSource: this._dataSource
                    },
                    typeof this.options.pageable === "object" ?
                        this.options.pageable :
                        {}
                );

                // Add the HTML for the pager.
                this.element.append(this.html.pager);

                // Initialize the pager widget.
                this.widgets.pager = this.element.children(".sr-listview-pager").serenityPagerpanel(options).data("serenityPagerpanel");

                this._dataSource.bind("change", function (args) {
                    if (args.type === "page") {
                        that._trigger("pageChange", null, { page: { before: args.before.current, current: args.value.current } });
                    }
                });
            }
        },

        /***************************************************************************
         *
         * PUBLIC OVERRIDE METHODS
         *
         **************************************************************************/

        setDataSource: function(ds) {
            /// <function>setDataSource</function>
            /// <summary>Set the data source.</summary>
            /// <param name="ds" type="serenity.DataSource">Contains the data to be displayed.</param>
            /// <example for="JavaScript" description="Set the DataSource for the listview.">
            /// $(".selector").data("serenityListview").setDataSource(new serenity.DataSource({ data: employees }));
            /// </example>
            /// <version added="2017.4" updated="2017.4" />

            this._super(ds);

            // The widget is pageable.
            if (this.options.pageable !== false) {
                // Are any of the DataSource.options.page settings missing?
                if (this._dataSource.options.page.current === null || this._dataSource.options.page.size === null) {
                    this._dataSource.options.page.current = this._dataSource.options.page.current === null ? 1 : this._dataSource.options.page.current;
                    this._dataSource.options.page.size = this._dataSource.options.page.size === null ? 10 : this._dataSource.options.page.size;
                    this._dataSource._resetCurrent();
                }
            }

            this.render();
        },

        render: function() {
            /// <function>render</function>
            /// <summary>Render the widget.</summary>
            /// <example for="JavaScript" description="Render the listview.">
            /// $(".selector").data("serenityListview").render();
            /// </example>
            /// <version added="2017.4" updated="2017.4" />

            if (this.dataSource() instanceof serenity.DataSource) {
                var that = this;

                var contentTemplate = null;

                var itemTemplate = Handlebars.compile(this.html[this._mode.view].item, { noEscape: true });

                if (typeof this.options[this._mode.view].templateSelector === "string") {
                    var $templateEl = $(this.options[this._mode.view].templateSelector);
                    if ($templateEl.length > 0) {
                        this.options[this._mode.view].template = Handlebars.compile($templateEl.html(), { noEscape: true });
                    }
                }

                if (typeof this.options[this._mode.view].template === "function") {
                    contentTemplate = this.options[this._mode.view].template;
                } else {
                    contentTemplate = Handlebars.compile(this.options[this._mode.view].template, { noEscape: true });
                }

                this.widgets.body.empty();

                this.widgets.body.off(".serenityListview");

                this.dataSource().page().ForEach(function(item) {
                    var params = $.extend({ titleField: item[that.options.titleField] }, item);
                    var content = contentTemplate(params);

                    var $itemEl = $(itemTemplate({ mode: that._mode, content: content }));

                    if (that._mode.view === "tile") {
                        $itemEl
                            .height(that.options.tile.height)
                            .width(that.options.tile.width)
                            .addClass("ui-widget-content");
                    } else if (that.options.list.border === true) {
                        $itemEl
                            .addClass("ui-widget-content");
                    }
                    that.widgets.body.append($itemEl);
                });

                if (this.options.selectable === true) {
                    if (this._mode.view === "list") {
                        this.widgets.body.find(".sr-content").addClass("sr-selectable");
                    } else {
                        this.widgets.body.find(".sr-content").addClass("sr-selectable");
                    }
                }

                this._initEventsHandlers();

                this._trigger("dataBound");
            }
        }
    });
})(window.jQuery, window.serenity);



/*
* Mode Options
*/

/// <option>mode.view</option>
/// <datatype>String</datatype>
/// <default>"list"</default>
/// <summary>
/// <![CDATA[
/// The initial mode to view the litems in the listview.
/// <p>Options are:
/// <ul>
/// <li>list</li>
/// <li>tile</li>
/// </ul>
/// </p>
/// ]]>
/// </summary>
/// <example for="JavaScript" description="Initialize the listview with the mode.view option specified">
/// $(".selector").serenityListview({
///   mode: { view: "tile" }
/// });
/// </example>
/// <version added="2017.4" updated="2017.4" />

/// <option>mode.selectable</option>
/// <datatype>Boolean</datatype>
/// <default>false</default>
/// <summary>
/// Determine whether the mode can be selected. If true, then a header is displayed with a dropdown list 
/// containing "List" and "Tile". When selected, the mode is updated and the widget is rendered.
/// </summary>
/// <example for="JavaScript" description="Initialize the listview with the mode.selectable option specified">
/// $(".selector").serenityListview({
///   mode: { selectable: true }
/// });
/// </example>
/// <version added="2017.4" updated="2017.4" />


/*
* Pageable Options
*/

/// <option>pageable.messages.goto</option>
/// <datatype>String</datatype>
/// <default>"Go to page:"</default>
/// <summary>
/// The message to be displayed on the pager panel for the input field to go to a page.
/// </summary>
/// <example for="JavaScript" description="Initialize the listview with the pageable.messages.goto option specified">
/// $(".selector").serenityListview({
///   pageable: { messages: { goto: "Page:" } }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>pageable.messages.pagesize</option>
/// <datatype>String</datatype>
/// <default>"Show rows:"</default>
/// <summary>
/// The message to be displayed on the pager panel for the page size.
/// </summary>
/// <example for="JavaScript" description="Initialize the listview with the pageable.messages.pagesize option specified">
/// $(".selector").serenityListview({
///   pageable: { messages: { pagesize: "Rows per page:" } }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>pageable.messages.items</option>
/// <datatype>Function | Handlebars template</datatype>
/// <default>Handlebars.compile("{{start}}-{{end}} of {{size}}")</default>
/// <summary>
/// The message to be displayed on the pager panel for what page items are currently displayed.
/// </summary>
/// <example for="JavaScript" description="Initialize the listview with the pageable.messages.items option specified">
/// $(".selector").serenityListview({
///   pageable: { messages: { items: Handlebars.compile("from {{start}} to {{end}} of {{size}}") } }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>pageable.pagesizes</option>
/// <datatype>Array</datatype>
/// <default>[10, 25, 50, 100]</default>
/// <summary>
/// The pages sizes available in the pager panel.
/// </summary>
/// <example for="JavaScript" description="Initialize the listview with the pageable.pagesizes option specified">
/// $(".selector").serenityListview({
///   pageable: { pagesizes: [10, 20, 30, 40, 50] }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />


/*
* Events
*/

/// <event>dataBound</event>
/// <summary>Triggered when the data has been bound to the widget.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.listview">Instance of the listview.</param>
/// <example for="JavaScript" description="Initialize the listview with the dataBound callback specified">
/// $(".selector").serenityListview({
///   dataBound: function (event, ui) {
///     console.log("dataBound event raised");
///   }
/// });
/// </example>
/// <version added="2017.4" updated="2017.4" />

/// <event>select</event>
/// <summary>Triggered when an item is selected.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.listview">Instance of the listview.</param>
/// <param name="ui.item" type="Object">Item from the DataSource that was used to render the item in the listview.</param>
/// <example for="JavaScript" description="Initialize the listview with the select callback specified">
/// $(".selector").serenityListview({
///   select: function (event, ui) {
///     console.log("select event raised");
///   }
/// });
/// </example>
/// <version added="2017.4" updated="2017.4" />

/// <event>modeChange</event>
/// <summary>Triggered when the mode has changed.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.listview">Instance of the listview.</param>
/// <param name="ui.mode" type="String">The mode that was selected.</param>
/// <example for="JavaScript" description="Initialize the listview with the modeChange callback specified">
/// $(".selector").serenityListview({
///   modeChange: function (event, ui) {
///     console.log("modeChange event raised");
///   }
/// });
/// </example>
/// <version added="2017.4" updated="2017.4" />

/// <event>pageChange</event>
/// <summary>Triggered when the current page has changed.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.listview">Instance of the listview.</param>
/// <param name="ui.page.before" type="String">The page that was displayed in the listview before it was changed.</param>
/// <param name="ui.page.current" type="String">The current page that is displayed in the listview.</param>
/// <example for="JavaScript" description="Initialize the listview with the pageChange callback specified">
/// $(".selector").serenityListview({
///   pageChange: function (event, ui) {
///     console.log("pageChange event raised");
///   }
/// });
/// </example>
/// <version added="2017.4" updated="2017.4" />
