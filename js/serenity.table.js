/**
 * Serenity UI v2017.1.170722 (https://www.serenityui.com)
 */
(function ($, serenity) {
    $.widget("serenity.table", $.serenity.datawidget, {
        /// <widget>serenity.table</widget>
        /// <inherits url="serenity.datawidget.html">serenity.datawidget</inherits>
        /// <typedef>interface Table extends DataWidget</typedef>
        /// <typedef for="JQuery">serenityTable(): JQuery</typedef>
        /// <typedef for="JQuery">serenityTable(options: any): JQuery</typedef>
        /// <summary>A lightweight table built to replace an HTML table.</summary>
        /// <element>div</element>
        /// <gettingstarted>
        /// <![CDATA[
        /// <div id="table"></div>
        /// 
        /// <script>
        ///   var employees = new serenity.DataSource({ 
        ///     data: [
        ///       { "id": 1, "fullName": "Anthony Nelson", "title": "Junior Quality Assurance Engineer" },
        ///       { "id": 2, "fullName": "Helen Garcia", "title": "Principal Systems Engineer" },
        ///       { "id": 3, "fullName": "John Williams", "title": "Senior Software Engineer" },
        ///       { "id": 4, "fullName": "Karen Robinson", "title": "Quality Assurance Engineer" },
        ///       { "id": 5, "fullName": "Brian Adams", "title": "Deputy Director" }
        ///     ]
        ///   });
        ///   $("#table").serenityTable({
        ///     dataSource: employees,
        ///     columns: [
        ///       { title: "Name", field: "fullName" },
        ///       { title: "Title", field: "title" }
        ///     ]_tr
        ///   });
        /// </script>
        /// ]]>
        /// </gettingstarted>
        /// <version added="2016.1" updated="2016.1" />

        _widths: null,

        html: {
            header: {
                html: "<div class='sr-table-header ui-widget-content'><table class='ui-widget-content' style='width:100%;'><colgroup></colgroup><tr></tr></table></div>",
				colgroup: {
					col: "<col style='{0};'/>"
				},
                column: {
                    html: "<th data-field='{0}' class='ui-widget-header' style='position:relative;'><span class='sr-table-col-text'>{1}</span></th>",
                    action: {
                        html: "<div class='sr-table-col-actions'></div>",
                        sort: "<span class='sr-table-col-sort fa fa-sort{0}'></span>",
                        filter: {
                            icon: "<span class='fa fa-filter'></span>",
                            popup: "<div class='sr-table-col-filter-popup' style='position:absolute;right:0px;width:200px;display:none;'></div>"
                        }
                    }
                }
            },
            body: {
                html: "<div class='sr-table-body ui-widget-content' style='{0}'><table style='width:100%;'><colgroup></colgroup></table></div>"
				// ,
                // row: "<tr></tr>"
            },
            calc: {
                html: "<div class='sr-table-calc'><table class='ui-widget-content' style='width:100%;'><colgroup></colgroup><tr></tr></table></div>",
				colgroup: {
					col: "<col style='{0};'/>"
				},
                column: Handlebars.compile("<th data-field='{{field}}' class='ui-widget-header' style='position:relative;'><span class='sr-table-col-text' style='{{styles}}'>{{html}}</span></th>", { noEscape: true }),
            },
            pager: {
                html: "<div class='sr-table-pager'></div>"
            }
        },

        options: {
            /// <option>rowCss</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>rowCss: string</typedef>
            /// <summary>CSS Class to be applied to odd numbered rows. Set to null to not apply any style.</summary>
            /// <version added="2016.1" updated="2016.1" />
			rowCss: null,
			
            /// <option>altRowCss</option>
            /// <datatype>String</datatype>
            /// <default>"sr-table-altrow"</default>
            /// <typedef>altRowCss: string</typedef>
            /// <summary>CSS Class to be applied to even numbered rows. Set to null to not apply any style.</summary>
            /// <version added="2016.1" updated="2016.1" />
			altRowCss: "sr-table-altrow",
			
            /// <option>columns</option>
            /// <datatype>Array</datatype>
            /// <default>null</default>
            /// <typedef>columns: any[]</typedef>
            /// <summary>Columns to be displayed in the table.</summary>
            /// <version added="2016.1" updated="2016.1" />
            columns: null,

            // See bottom for columns options.

            /// <option>dataSource</option>
            /// <datatype>serenity.DataSource</datatype>
            /// <default>[]</default>
            /// <typedef>dataSource: serenity.DataSource</typedef>
            /// <summary>Data to be displayed in the table.</summary>
            /// <version added="2016.1" updated="2016.1" />
            dataSource: [],

            /// <option>pageable</option>
            /// <datatype>Boolean</datatype>
            /// <default>false</default>
            /// <typedef>pageable: boolean</typedef>
            /// <summary>Display table as pageable.</summary>
            /// <version added="2016.1" updated="2016.1" />
            pageable: false,

            /// <option>selectionmode</option>
            /// <datatype>String</datatype>
            /// <default>"none"</default>
            /// <typedef>selectionmode: string</typedef>
            /// <summary>Selection mode.  Options are: 'none', 'singlerow', and 'multiplerows'.</summary>
            /// <version added="2016.1" updated="2016.1" />
			selectionmode: "none",

            /// <option>showCalculations</option>
            /// <datatype>Boolean</datatype>
            /// <default>false</default>
            /// <typedef>showCalculations: boolean</typedef>
            /// <summary>Show field calculations.</summary>
            /// <version added="2016.1" updated="2016.1" />
			showCalculations: false,
			
            /// <option>rowTemplate</option>
			/// <datatype>String | Function | HandleBars Template</datatype>
			/// <default>"<tr></tr>"</default>
			/// <summary>A template for rendering the row.</summary>
            /// <version added="2017.1" updated="2017.1" />
			rowTemplate: "<tr></tr>"
        },

        _create: function () {
            /// <summary>Constructor for the table.</summary>

            this._widths = [];

            // Call the base class.
            this._super();

            // Set the dataSource.
            this.setDataSource(this.options.dataSource);

            this.element.on("click.serenityTable", "th.sr-table-col-sortable", $.proxy(this._onColumnSort, this));

            this.element.on("click.serenityTable", "th div.sr-table-col-actions span.fa-filter", $.proxy(this._onColumnFilter, this));

            if (this.options.selectionmode !== "none") {
                this.element.addClass("sr-selectable");
                this.element.on("click.serenityTable", "div.sr-table-body tbody tr", $.proxy(this._onRowSelect, this));
            }
        },
        
        _onColumnSort: function (event) {
            /// <summary>The user clicked on the column heading for a sortable column.</summary>

            // Ignore the click event if it is from any icon in the actions div except the sort icon.
            if ($(event.target).closest("div.sr-table-col-actions").length > 0
                && $(event.target).hasClass("sr-table-col-sort") === false) return;

            var $th = $(event.currentTarget);
            var field = $th.attr("data-field");
            var dir = $th.attr("data-sort-dir");

            // determine the new direction for the sort.
            switch (dir) {
                case "asc": dir = "desc"; break;
                case "desc": dir = ""; break;
                default: dir = "asc";
            }

            // If there is a sort for the field already then remove it.
            var sort = Enumerable.From(this._dataSource.sort())
                .Where(function (e) { return e.field !== field; })
                .ToArray();

            // Add the sort for the field.
            sort.push({ field: field, dir: dir });

            // Apply the sort.
            this._dataSource.sort(sort);
        },

        _onColumnFilter: function (event) {
            /// <summary>The user clicked the filter icon in the column heading.</summary>
            /// <version added="2016.1" updated="2016.1" />

            event.stopPropagation();

            var $filterIcon = $(event.currentTarget);
            var $action = $filterIcon.closest("div.sr-table-col-actions");
            var field = $action.closest("th").attr("data-field");
            var that = this;

            // Move the filtermenu to the column heading.
            this.widgets.filtermenu.element.appendTo($action);

            // Set the field to be filtered in the filtermenu.
            this.widgets.filtermenu.load(field);

            // Show the filtermenu.
            this.widgets.filtermenu.element.show("down");

            // Hide the filtermenu if click occurs outside of the filtermenu.
            $("body").on("click.tablefiltermenu", $.proxy(this._onBodyClick, this));
        },

        _onBodyClick: function (event) {
            /// <summary>Handle the body click event.</summary>
            /// <version added="2016.1" updated="2016.1" />

            // If the filtermenu is visible.
            if (this.widgets.filtermenu && this.widgets.filtermenu.element.is(":visible")) {

                var $el = $(event.target);

                // If the element that was clicked is not part of the filtermenu, then close the filtermenu.
                if ($el.closest("div.sr-filtermenu").length === 0 && $el.hasClass("ui-menu-item-wrapper") === false) {
                    this.widgets.filtermenu.element.hide("blind", null, 200);
                    $("body").off(".tablefiltermenu");
                }
            }
        },

        _onRowSelect: function (event) {
            /// <summary>Handle the row click event.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var $target = $(event.currentTarget);
            if (this.options.selectionmode === "multiplerows") {
                if ($target.hasClass("ui-state-active")) {
                    $target.removeClass("ui-state-active");
                } else {
                    $target.addClass("ui-state-active");
                }
            } else {
                this.widgets.body.find("tr").removeClass("ui-state-active");
                $target.addClass("ui-state-active");
            }
            this._trigger("select", event);
        },

        _renderColumnHeader: function (column, colIndex, $tr) {
            /// <summary>Render the table column header.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var title = typeof column.title !== "undefined" ? column.title : "";
            var $th = $(serenity.format(this.html.header.column.html, column.field, title));
            var $actions = $(this.html.header.column.action.html);
			
            if (column.sortable === true) {
                $th.addClass("sr-table-col-sortable");

                var sort = Enumerable.From(this._dataSource.options.sort)
                    .Where(function (e) { return e.field === column.field; })
                    .FirstOrDefault();

                var html = serenity.format(this.html.header.column.action.sort,
                    typeof sort !== "undefined" ? '-' + sort.dir : '');

                if (typeof sort !== "undefined") {
                    $th.attr("data-sort-dir", sort.dir);
                }
                $actions.append(html);
            }

            if (column.filterable === true) {
                $th.addClass("sr-table-col-filterable");
                $actions.append(this.html.header.column.action.filter.icon);
            }

            $th.append($actions);

            $tr.append($th);

            return $th;
        },

        _renderHeader: function () {
            /// <summary>Render the table header.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;
            this.widgets.header = $(this.html.header.html);
            var $tr = this.widgets.header.find("tr");

            // Add column headings.
            for (var cdx = 0; cdx < this.options.columns.length; cdx++) {
				var $col = $(serenity.format(this.html.header.colgroup.col, this._widths[cdx].width))
				this.widgets.header.find("colgroup").append($col);
                var column = this.options.columns[cdx];
                this._renderColumnHeader(column, cdx, $tr);
            }
			
            this.element.append(this.widgets.header);

            // If any of the columns are filterable, then initialize a filter input.
            if (Enumerable.From(this.options.columns).Where(function (e) { return e.filterable === true; }).Count() > 0) {
                this.element.append(this.html.header.column.action.filter.popup);
                this.widgets.filtermenu = this.element.find("div.sr-table-col-filter-popup").serenityFiltermenu({
                    dataSource: this._dataSource,
                    clear: function () {
                        that.widgets.filtermenu.element.hide("up");
                    },
                    filter: function () {
                        that.widgets.filtermenu.element.hide("up");
                    }
                }).data("serenityFiltermenu");
            }
        },

        _renderRow: function (dataItem, rowIndex, $table) {
            /// <summary>Render a table row.</summary>
            /// <version added="2016.1" updated="2016.1" />

			var html = typeof this.options.rowTemplate === "string" ? this.options.rowTemplate : this.options.rowTemplate(dataItem);
            var $tr = $(html);

            $table.append($tr);
			
			if (this.options.rowCss !== null) {
				if ($tr.index() % 2 === 0) {
					$tr.addClass(this.options.rowCss);
				}
			}
			
			if (this.options.altRowCss !== null) {
				if ($tr.index() % 2 !== 0) {
					$tr.addClass(this.options.altRowCss);
				}
			}
			
            for (var cdx = 0; cdx < this.options.columns.length; cdx++) {
                var column = this.options.columns[cdx];
                var value = dataItem[column.field];

                if (typeof value === "undefined" || value === null) {
                    value = "";
                }

                $tr.append(
                    serenity.format("<td{0}>{1}</td>",
                        column.styles ? " style='" + column.styles + "'" : "",
                        typeof column.template === "function"
                            ? column.template(dataItem)
                            : (typeof column.template === "string"
                                ? (Handlebars.compile(column.template))(dataItem)
                                : value.toString())
                    )
                );
            }
        },

        _renderBody: function () {
            /// <summary>Render the table body.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            this.widgets.body = $(String.format(this.html.body.html,
                typeof this.options.height !== "undfined" ? String.format("height:{0}", this.options.height) : ""));
            var $table = this.widgets.body.find("table");

            // Add column headings.
            for (var cdx = 0; cdx < this.options.columns.length; cdx++) {
				var $col = $(serenity.format(this.html.header.colgroup.col, this._widths[cdx].width))
				$table.find("colgroup").append($col);
            }
			
            this.element.append(this.widgets.body);
        },

        _renderAggregates: function () {
            /// <summary>Render the calculations based on the table aggregates.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;
            this.widgets.calc = $(this.html.calc.html);
            var $tr = this.widgets.calc.find("tr");
            var calculations = this._dataSource.calculations();

            // Add columns.
            for (var cdx = 0; cdx < this.options.columns.length; cdx++) {
				var $col = $(serenity.format(this.html.header.colgroup.col, this._widths[cdx].width))
				this.widgets.calc.find("colgroup").append($col);
                var column = this.options.columns[cdx];
                var calculation = calculations[column.field];
                var value = "";
                var attributes = "";
                if (typeof calculation !== "undefined") {
                    if (typeof column.footerTemplate === "string") {
                        var template = Handlebars.compile(column.footerTemplate);
                        value = template(calculation);
                    } else if (typeof column.footerTemplate === "function") {
                        value = column.footerTemplate(calculation);
                    } else {
                        for (var key in calculation) {
                            value += serenity.format("{0}{1}{2}: {3}",
                                value.length > 0 ? "<br/>" : "",
                                key[0].toUpperCase(), key.substr(1),
                                calculation[key]);
                        }
                    }
                } else {
                    if (typeof column.footerTemplate === "string") {
                        value = column.footerTemplate;
                    }
                }

                var $th = $(this.html.calc.column({ field: column.field, styles: column.footerStyles || "", html: value }));
                $tr.append($th);
            }
			
            this.element.append(this.widgets.calc);
        },

        _renderPager: function (options) {
            /// <summary>Render the table pager.</summary>
            /// <version added="2016.1" updated="2016.1" />
    
            this.element.append(this.html.pager.html);
            
            this.widgets.pager = this.element.find("div.sr-table-pager").serenityPagerpanel(options).data("serenityPagerpanel");
        },

        _calculateColumnWidths: function () {
            /// <summary>Calculate all the column widths.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var defaultWidth = (100 / this.options.columns.length).toString() + "%";
            for (var cdx = 0; cdx < this.options.columns.length; cdx++) {
                var column = this.options.columns[cdx];
				var hasWidth = typeof column.width !== "undefined";
				this._widths.push({ width: String.format("width:{0}", hasWidth ? column.width : defaultWidth), hasWidth: hasWidth });
            }
			var found = false;
			for (var idx = (this._widths.length - 1); idx >= 0 && found === false; idx--) {
				if ((found = (this._widths[idx].hasWidth === false)) === true) {
					this._widths[idx].width = "";
				}
			}
        },
        
        _postRender: function () {
            /// <summary>Override to render after header, body, footer and pager.</summary>
            /// <version added="2016.1" updated="2016.1" />
        },
        
        _onDataSourceChange: function (e) {
            /// <summary>Handle the dataSource change event.</summary>
            /// <version added="2016.1" updated="2016.1" />
            
            this.render();
            // this.load();
        },

        load: function () {
            /// <summary>Load the data from the dataSource into the table.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;
            var $table = this.widgets.body.find("table");

            // Remove any data rows.
            $table.find("tr").remove();

            if (this._dataSourceValid()) {
				this._dataSource.page().ForEach(function (dataItem, index) {
					// Add rows.
					that._renderRow(dataItem, index, $table);
				});
			}
        },

        render: function () {
            /// <function>render</function>
            /// <typedef>render: () => void</typedef>
            /// <summary>Render the table.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            if (this._dataSource !== null && this._dataSource instanceof serenity.DataSource) {
                this.element.empty();

                this._calculateColumnWidths();
                this._renderHeader();
                this._renderBody();
                this.load();
                if (this.options.showCalculations && this._dataSource.calculations() !== null) {
                    this._renderAggregates();
                }
                if (this.options.pageable) {
                    var options = $.extend(true,
                        {},
                        { dataSource: this._dataSource },
                        typeof this.options.pageable === "object"
                            ? this.options.pageable
                            : {});
                    this._renderPager(options);
                }

                // If the body height is greater than the table height
                var $table = this.widgets.body.find("table");
                if (this.widgets.body.height() < $table.height()) {
                    // Add a "column" header table that is the same width as the scrollbar.
					var width = serenity.getScrollBarWidth();
                    var $col = $(serenity.format(this.html.header.colgroup.col, serenity.format("width:{0}px", width)));
                    this.widgets.header.find("table tr").append("<th class='ui-widget-header'></th>");
                    this.widgets.header.find("colgroup").append($col);
                    if (this.options.showCalculations) {
                        // Add a "column" to the calc table that is the same width as the scrollbar.
                        this.widgets.calc.find("table tr").append("<th class='ui-widget-header'></th>");
                        this.widgets.calc.find("colgroup").append($col[0].outerHTML);
                    }
                }
                
                this._postRender();

				that._trigger("dataBound");
            }
        },

        setDataSource: function (ds) {
            /// <function>setDataSource</function>
            /// <typedef>setDataSource: (ds: serenity.DataSource) => void</typedef>
            /// <summary>Set the data source.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this._super(ds);
            
            this.render();

            return this;
        },

        selectedRows: function () {
            /// <function>selectedRows</function>
            /// <summary>Get the selected rows.</summary>
            /// <version added="2016.1" updated="2016.1" />
            
            return this.widgets.body.find("tr.ui-state-active");
        },

        selectedRowItems: function () {
            /// <function>selectedRowItems</function>
            /// <summary>Get the items from the dataSource for the selected rows.</summary>
            /// <version added="2016.1" updated="2016.1" />
            
            var items = [];
            var page = this.dataSource().page();

            this.selectedRows().each(function (i, row) {
                var index = $(row).index();
                items.push(page.ElementAt(index));
            });

            return items;
        }
    });
})(window.jQuery, window.serenity);


/*
 * Columns Attributes
 */

/// <option>columns.field</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>The field in the model to be displayed for each row.</summary>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.footerStyles</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>Styles to apply to the span element rendered in the footer cell.</summary>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.footerTemplate</option>
/// <datatype>String | Function | HandleBars Template</datatype>
/// <default>null</default>
/// <summary>A template for rendering the footer for the column.</summary>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.styles</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>Styles to apply to the span element rendered in the row cell.</summary>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.template</option>
/// <datatype>String | Function | HandleBars Template</datatype>
/// <default>null</default>
/// <summary>A template for rendering a cell for the column.</summary>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.title</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>Title to be displayed for a column.</summary>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.width</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>The width for the column.</summary>
/// <version added="2016.1" updated="2016.1" />


/*
 * Events
 */

/// <event>dataBound</event>
/// <summary>Triggered when the data has been bound to the widget.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.table">Instance of the table.</param>
/// <version added="2016.1" updated="2016.1" />

/// <event>select</event>
/// <summary>Triggered when a row has been selected.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.table">Instance of the table.</param>
/// <version added="2016.1" updated="2016.1" />
