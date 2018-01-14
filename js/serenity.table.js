/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
(function($, serenity) {
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
		///     ]
		///   });
		/// </script>
		/// ]]>
		/// </gettingstarted>
		/// <version added="2016.1" updated="2017.2" />

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

		_widths: null,
		
		// <summary>Information about the columns to render in the table.</summary>
		_columns: null,

		html: {
			header: {
				html: {
					standard: "<div class='sr-table-header ui-widget-content'><table class='ui-widget-content' style='width:100%;'><colgroup></colgroup><tr></tr></table></div>",
					bootstrap: "<div class='sr-table-header'><table class='table' style='width:100%;margin-bottom:0px;'><colgroup></colgroup><tr></tr></table></div>"
				},
				colgroup: {
					col: "<col style='{0};'/>"
				},
				column: {
					html: {
						standard: "<th data-field='{0}' class='ui-widget-header' style='position:relative;'><span class='sr-table-col-text'>{1}</span></th>",
						bootstrap: "<th data-field='{0}' style='position:relative;'><span class='sr-table-col-text'>{1}</span></th>"
					},
					scrollbar: {
						standard: "<th class='ui-widget-header'></th>",
						bootstrap: "<th></th>"
					},
					action: {
						html: "<div class='sr-table-col-actions'></div>",
						sort: "<span class='sr-table-col-sort fa fa-sort{0}' title='Sort column'></span>",
						filter: {
							icon: "<span class='fa fa-filter' title='Filter column'></span>",
							popup: "<div class='sr-table-col-filter-popup' style='position:absolute;right:0px;width:200px;display:none;'></div>"
						}
					}
				}
			},
			checkbox: {
				colgroup: {
					col: "<col style='width:75px;'/>"
				},
				header: "<th class='ui-widget-header sr-table-checkbox-select' style='position:relative;'><i class='{0} {1}' aria-hidden='true'></i></th>",
				column: "<td class='sr-table-checkbox-select' style='position:relative;text-align:center;'><i class='{0} {1}' aria-hidden='true'></i></td>"
			},
			body: {
				html: {
					standard: "<div class='sr-table-body ui-widget-content' style='{0}'><table style='width:100%;'><colgroup></colgroup></table></div>",
					bootstrap: "<div class='sr-table-body' style='{0}'><table class='table' style='width:100%;'><colgroup></colgroup></table></div>"
				}
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

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

		options: {
			/// <option>tableCss</option>
			/// <datatype>String</datatype>
			/// <default>null</default>
			/// <typedef>tableCss: string</typedef>
			/// <summary>CSS Class to be applied to table elements. Set to null to not apply any style.</summary>
			/// <example for="JavaScript" description="Initialize the table with the tableCss option specified">
			/// $(".selector").serenityTable({
			///   tableCss: "table-inverse",
			///   mode: "bootstrap"
			/// });
			/// </example>
			/// <version added="2017.3" updated="2017.3" />
			tableCss: null,
			
			/// <option>rowCss</option>
			/// <datatype>String</datatype>
			/// <default>null</default>
			/// <typedef>rowCss: string</typedef>
			/// <summary>CSS Class to be applied to odd numbered rows. Set to null to not apply any style.</summary>
			/// <example for="JavaScript" description="Initialize the table with the rowCss option specified">
			/// $(".selector").serenityTable({
			///   rowCss: "app-row-css"
			/// });
			/// </example>
			/// <version added="2016.1" updated="2016.1" />
			rowCss: null,

			/// <option>altRowCss</option>
			/// <datatype>String</datatype>
			/// <default>"sr-table-altrow"</default>
			/// <typedef>altRowCss: string</typedef>
			/// <summary>CSS Class to be applied to even numbered rows. Set to null to not apply any style.</summary>
			/// <version added="2016.1" updated="2016.1" />
			/// <example for="JavaScript" description="Initialize the table with the altRowCss option specified">
			/// $(".selector").serenityTable({
			///   altRowCss: "app-altrow-css"
			/// });
			/// </example>
			/// <version added="2017.1" updated="2017.1" />
			altRowCss: "sr-table-altrow",

			/// <option>columns</option>
			/// <datatype>Array</datatype>
			/// <default>null</default>
			/// <typedef>columns: any[]</typedef>
			/// <summary>Columns to be displayed in the table.</summary>
			/// <example for="JavaScript" description="Initialize the table with Name and Title columns.">
			///   $("#table").serenityTable({
			///     dataSource: employees,
			///     columns: [
			///       { title: "Name", field: "fullName" },
			///       { title: "Title", field: "title" }
			///     ]
			///   });
			/// </example>
			/// <version added="2016.1" updated="2016.1" />
			columns: null,

			// See bottom for columns options.

			/// <option>dataSource</option>
			/// <datatype>serenity.DataSource</datatype>
			/// <default>[]</default>
			/// <summary>
			/// Data to be displayed in the table. If the data is set to an array of objects, 
			/// then the instance of the serenity.DataSource that is instantiated will have the 
			/// serenity.DataSource.trackChanges option set to false.
			/// </summary>
			/// <example for="JavaScript" description="Initialize the table with employees data.">
			///   $("#table").serenityTable({
			///     dataSource: employees
			///   });
			/// </example>
			/// <version added="2016.1" updated="2016.1" />
			dataSource: [],
			
			/// <option>height</option>
			/// <datatype>String</datatype>
			/// <default>"200px"</default>
			/// <typedef>height: string</typedef>
			/// <summary>Height of the table.</summary>
			/// <example for="JavaScript" description="Initialize the table with the height option specified">
			/// $(".selector").serenityTable({
			///   height: "500px"
			/// });
			/// </example>
			/// <example for="JavaScript" description="Get or set the height option, after initialization">
			/// // Getter
			/// var height = $(".selector").serenityTable("option", "height");
 			///
			/// // Setter
			/// $(".selector").serenityTable("option", "height", "500px");
			/// </example>
			/// <version added="2016.1" updated="2016.1" />
			height: "200px",

			/// <option>pageable</option>
			/// <datatype>Boolean | Object</datatype>
			/// <default>false</default>
			/// <summary>Display table as pageable.</summary>
			/// <example for="JavaScript" description="Initialize the table with the pageable option specified">
			/// $(".selector").serenityTable({
			///   pageable: true
			/// });
			/// </example>
			/// <example for="JavaScript" description="Get or set the pageable option, after initialization">
			/// // Getter
			/// var pageable = $(".selector").serenityTable("option", "pageable");
 			///
			/// // Setter
			/// $(".selector").serenityTable("option", "pageable", true);
			/// </example>
			/// <version added="2016.1" updated="2016.1" />
			pageable: false,

			// See bottom for pageable options.

			/// <option>selectionmode</option>
			/// <datatype>String</datatype>
			/// <default>"none"</default>
			/// <summary>
			/// <![CDATA[
			/// Selection mode.
			/// <p>Options are:
			/// <ul>
			/// <li>none</li>
			/// <li>singlerow</li>
			/// <li>multiplerows</li>
			/// <li>checkbox</li>
			/// </ul>
			/// </p>
			/// ]]>
			/// </summary>
			/// <example for="JavaScript" description="Initialize the table with the selectionmode option specified">
			/// $(".selector").serenityTable({
			///   selectionmode: "singlerow"
			/// });
			/// </example>
			/// <example for="JavaScript" description="Get or set the selectionmode option, after initialization">
			/// // Getter
			/// var appendTo = $(".selector").serenityTable("option", "selectionmode");
 			///
			/// // Setter
			/// $(".selector").serenityTable("option", "selectionmode", "multiplerows");
			/// </example>
			/// <version added="2016.1" updated="2017.3" />
			selectionmode: "none",
			
			/// <option>mode</option>
			/// <datatype>String</datatype>
			/// <default>"standard"</default>
			/// <summary>
			/// <![CDATA[
			/// The mode that the table is rendered.
			/// <p>Options are:
			/// <ul>
			/// <li>standard</li>
			/// <li>bootstrap</li>
			/// </ul>
			/// </p>
			/// ]]>
			/// </summary>
			/// <example for="JavaScript" description="Initialize the table with the mode option specified to render the table with bootstrap classes.">
			/// $(".selector").serenityTable({
			///   mode: "bootstrap"
			/// });
			/// </example>
			/// <version added="2017.3" updated="2017.3" />
			mode: "standard",

			/// <option>showCalculations</option>
			/// <datatype>Boolean</datatype>
			/// <default>false</default>
			/// <summary>Show field calculations.</summary>
			/// <example for="JavaScript" description="Show the average years of service.">
			/// var employees = new serenity.DataSource({ 
			///	  data: [
			/// 		{ "id": 1, "fullName": "Anthony Nelson", "title": "Junior Quality Assurance Engineer", "age": 36, service: 4 },
			/// 		{ "id": 2, "fullName": "Helen Garcia", "title": "Principal Systems Engineer", "age": 43, service: 2 },
			/// 		{ "id": 3, "fullName": "John Williams", "title": "Senior Software Engineer", "age": 38, service: 5 },
			/// 		{ "id": 4, "fullName": "Karen Robinson", "title": "Quality Assurance Engineer", "age": 34, service: 4.5 },
			/// 		{ "id": 5, "fullName": "Brian Adams", "title": "Deputy Director", "age": 36, service: 0.5 }
			/// 	],
			///		aggregates: [
			///			{ field: "service", calc: "average" }
			///		]
			///	});
			/// $("#table").serenityTable({
			///   dataSource: employees,
			///   columns: [
			///     { title: "Name", field: "fullName" },
			///     { title: "Title", field: "title" },
			///     { title: "Years of Service", field: "service" }
			///   ],
			///   showCalculations: true
			/// });
			/// </example>
			/// <version added="2016.1" updated="2016.1" />
			showCalculations: false,

			/// <option>rowTemplate</option>
			/// <datatype>String | Function | HandleBars Template</datatype>
			/// <default><![CDATA["<tr></tr>"]]></default>
			/// <summary>A template for rendering the row.</summary>
			/// <example for="JavaScript" description="Define a function for the row template to display the row text as italic when the character name is Neo.">
			/// <![CDATA[
			/// $("#table").serenityTable({
			///   dataSource: [
			///     { id: 1, givenname: "Keanu", surname: "Reeves", character: "Neo" },
			///     { id: 2, givenname: "Laurence", surname: "Fishburne", character: "Morpheus" },
			///     { id: 3, givenname: "Carrie-Anne", surname: "Moss", character: "Trinity" }
			///   ],
			///   columns: [{
			///			title: "Given Name",
			///			field: "givenname"
			///		},{
			///			title: "Surname",
			///			field: "surname"
			///		},{
			///			title: "Character",
			///			field: "character"
			///		}],
			///		rowTemplate: function (item) {
			///			return item.character === "Neo"
			///				? "<tr style='font-style:italic;'></tr>"
			///				: "<tr></tr>";
			///		}
			/// })
			/// ]]>
			/// </example>
			/// <version added="2017.1" updated="2017.1" />
			rowTemplate: "<tr></tr>",
			
			renderAfterOptionChange: true
		},

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

		_create: function() {
			/// <summary>Constructor for the table.</summary>

			this._widths = [];

			// Call the base class.
			this._super();

			// Set the dataSource.
			this.setDataSource(this.options.dataSource);


			//
			// Column header events.
			//
			
			// Click event on the sort icon in the table header.
			this.element.on("click.serenityTable", "th.sr-table-col-sortable", $.proxy(this._onColumnSort, this));
			// Click event on the filter icon in the table header.
			this.element.on("click.serenityTable", "th div.sr-table-col-actions span.fa-filter", $.proxy(this._onColumnFilter, this));


			//
			// Selection events.
			//
			
			// Click event on the selection checkbox in the table header.
			this.element.on("click.serenityTable", "div.sr-table-header th.sr-table-checkbox-select i", $.proxy(this._onSelectAllCheckboxClick, this));
			// Click event on the selection checkbox in a table row.
			this.element.on("click.serenityTable", "div.sr-table-body td.sr-table-checkbox-select i", $.proxy(this._onSelectRowCheckboxClick, this));
			// Click event on a table row.
			this.element.on("click.serenityTable", "div.sr-table-body tr", $.proxy(this._onRowSelect, this));
		},
		
		_initSelection: function (options) {
			/// <summary>Initialize selection configuration for the table.</summary>

			if (typeof options.selectionmode === "string" && options.selectionmode.indexOf("row") > 0) {
				this.element.addClass("sr-selectable");
			} else {
				this.element.removeClass("sr-selectable");
			}

			if (options.selectionmode === "checkbox") {
				// Set the selectionmode to the checkbox images.
				this.options.selectionmode = {
					classes: "fa",
					checked: "fa-check-square-o",
					unchecked: "fa-square-o",
					indeterminate: "fa-square"
				};
			}
		},

    /***************************************************************************
     *
     * EVENT HANDLERS
     *
     **************************************************************************/
		
		_onColumnSort: function(event) {
			/// <summary>The user clicked on the column heading for a sortable column.</summary>

			// Ignore the click event if it is from any icon in the actions div except the sort icon.
			if ($(event.target).closest("div.sr-table-col-actions").length > 0 &&
				$(event.target).hasClass("sr-table-col-sort") === false) return;

			var $th = $(event.currentTarget);
			var field = $th.attr("data-field");
			var dir = $th.attr("data-sort-dir");

			// determine the new direction for the sort.
			switch (dir) {
				case "asc":
					dir = "desc";
					break;
				case "desc":
					dir = "";
					break;
				default:
					dir = "asc";
			}

			// If there is a sort for the field already then remove it.
			var sort = Enumerable.From(this._dataSource.sort())
				.Where(function(e) {
					return e.field !== field;
				})
				.ToArray();

			// Add the sort for the field.
			sort.push({
				field: field,
				dir: dir
			});

			// Apply the sort.
			this._dataSource.sort(sort);
		},

		_onColumnFilter: function(event) {
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

		_onColumnDrop: function (event, ui) {
			/// <summary>Column is dropped on a group droppable div.</summary>

			var $droppable = $(event.target);
			var after = $droppable.attr("data-after");
			var field = ui.draggable.attr("data-field");
			var by = this._dataSource.options.group.by.slice();
			
			if (after.length === 0) {
				by.push(field);
			} else {
				by.splice(by.indexOf(after) + 1, 0, field);
			}
			this._dataSource.group({ by: by });
		},
		
		_onColumnDragStart: function (event, ui) {
			/// <summary>Column has started dragging.</summary>

			// Center the helper over the cursor.
			//$(this).draggable('instance').offset.click = {
			$(event.target).draggable("instance").offset.click = {
				left: Math.floor(ui.helper.width() / 2),
				top: Math.floor(ui.helper.height() / 2)
			};
		},
		
		_onBodyClick: function(event) {
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

		_onSelectAllCheckboxClick: function (event) {
			/// <summary>Handle the select all checkbox (the checkbox in the column heading) click event.</summary>
			/// <version added="2017.3" updated="2017.3" />

			// Get the checkbox.
			var $checkbox = $(event.target);
			
			// Determine the current state of the checkbox and then check or uncheck all checkboxes in the table.
			
			if ($checkbox.hasClass(this.options.selectionmode.unchecked)) {
				// The checkbox is currently unchecked. Change all checkboxes to checked.
				this.element.find(".sr-table-checkbox-select i")
					.removeClass(this.options.selectionmode.unchecked)
					.addClass(this.options.selectionmode.checked);
			} else if ($checkbox.hasClass(this.options.selectionmode.indeterminate)) {
				// The checkbox is currently indeterminate. Change all checkboxes to checked.
				this.element.find(".sr-table-checkbox-select i")
					.removeClass(this.options.selectionmode.unchecked)
					.removeClass(this.options.selectionmode.indeterminate)
					.addClass(this.options.selectionmode.checked);
			} else if ($checkbox.hasClass(this.options.selectionmode.checked)) {
				// The checkbox is currently checked. Change all checkboxes to unchecked.
				this.element.find(".sr-table-checkbox-select i")
					.removeClass(this.options.selectionmode.checked)
					.removeClass(this.options.selectionmode.indeterminate)
					.addClass(this.options.selectionmode.unchecked);
			}
			
			this._trigger("select", event);
		},
		
		_onSelectRowCheckboxClick: function (event) {
			/// <summary>Handle the select row checkbox click event.</summary>
			/// <version added="2017.3" updated="2017.3" />
			
			// Get the checkbox.
			var $checkbox = $(event.target);
			
			if ($checkbox.hasClass(this.options.selectionmode.checked)) {
				// The checkbox was checked. Uncheck the checkbox.
				$checkbox
					.removeClass(this.options.selectionmode.checked)
					.addClass(this.options.selectionmode.unchecked);

				var $checkboxes = this.widgets.body.find(".sr-table-checkbox-select i");
				
				// Are there other checkboxes that are checked?
				if ($checkboxes.hasClass(this.options.selectionmode.checked)) {
					// The checkbox column header is indeterminate.
					this.widgets.header.find(".sr-table-checkbox-select i")
						.removeClass(this.options.selectionmode.checked)
						.removeClass(this.options.selectionmode.unchecked)
						.addClass(this.options.selectionmode.indeterminate);
				} else {
					// The checkbox column header is unchecked.
					this.widgets.header.find(".sr-table-checkbox-select i")
						.removeClass(this.options.selectionmode.checked)
						.removeClass(this.options.selectionmode.indeterminate)
						.addClass(this.options.selectionmode.unchecked);
				}
			} else {
				// The checkbox was unchecked. Check the checkbox.
				$checkbox
					.removeClass(this.options.selectionmode.unchecked)
					.addClass(this.options.selectionmode.checked);

				var $checkboxes = this.widgets.body.find(".sr-table-checkbox-select i");
				
				// Are there other checkboxes that are unchecked?
				if ($checkboxes.hasClass(this.options.selectionmode.unchecked)) {
					// The checkbox column header is indeterminate.
					this.widgets.header.find(".sr-table-checkbox-select i")
						.removeClass(this.options.selectionmode.checked)
						.removeClass(this.options.selectionmode.unchecked)
						.addClass(this.options.selectionmode.indeterminate);
				} else {
					// The checkbox column header is checked.
					this.widgets.header.find(".sr-table-checkbox-select i")
						.removeClass(this.options.selectionmode.unchecked)
						.removeClass(this.options.selectionmode.indeterminate)
						.addClass(this.options.selectionmode.checked);
				}
			}
			
			this._trigger("select", event);
		},
		
		_onRowSelect: function(event) {
			/// <summary>Handle the row click event.</summary>
			/// <version added="2016.1" updated="2016.1" />

			if (this.element.hasClass("sr-selectable")) {
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
			}
		},

		_onDataSourceChange: function(e) {
			/// <summary>Handle the dataSource change event.</summary>
			/// <version added="2016.1" updated="2016.1" />

			this.render();
		},

		/***************************************************************************
     *
     * PROTECTED OVERRIDE METHODS
     *
     **************************************************************************/
		
		_optionsSet: function (options) {
			
			if (typeof options.selectionmode === "string") {
				this._initSelection(options);
			} else if (typeof options.pageable === "boolean" && this._dataSourceValid() === true) {
				var dataSource = this.dataSource();

				// If pageable is being enabled...
				if (options.pageable === true) {
					if (dataSource.options.page.current === null) {
						dataSource.changePage(1, 10);
					}
				} else {
					dataSource.removePage();
					dataSource.refresh();
				}
			}
		},

		/***************************************************************************
     *
     * PROTECTED METHODS
     *
     **************************************************************************/
		
		_renderColumnHeader: function(column, colIndex, $tr) {
			/// <summary>Render the table column header.</summary>
			/// <version added="2016.1" updated="2016.1" />

			var title = typeof column.title !== "undefined" ? column.title : "";
			var $th = $(serenity.format(this.html.header.column.html[this.options.mode], column.field, title));
			var $actions = $(this.html.header.column.action.html);

			if (column.hidden === true) {
				$th.css("display", "none");
			}
			
			if (column.sortable === true) {
				$th.addClass("sr-table-col-sortable");

				var sort = Enumerable.From(this._dataSource.options.sort)
					.Where(function(e) {
						return e.field === column.field;
					})
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
/*
			// The groupable option is true or an Object where the selection mode is not "drag" or "none" and the column is not a "group" column.
			if (
					(
						(typeof this.options.groupable === "object" && this.options.groupable.selection !== "drag" && this.options.groupable.selection !== "none") || 
						this.options.groupable === true
					) && 
				column.group !== true
			) {
				var $group = $(this.html.header.column.action.group);
				if (this._dataSource.options.group.by.indexOf(column.field) >= 0) {
					$group.addClass("sr-selected").attr("title", "Remove group by column");
				}
				$actions.append($group);
			}
			
			// The groupable option is true or an Object where the selection mode is "drag" or "all" and the column is not a "group" column.
			if (
					(
						(typeof this.options.groupable === "object" && this.options.groupable.selection === "drag" || this.options.groupable.selection === "all") || 
						this.options.groupable === true
					) && 
				column.group !== true
			) {
				$th.addClass("sr-column-draggable");
			}
*/
			$th.append($actions);

			$tr.append($th);

			return $th;
		},

		_renderHeader: function() {
			/// <summary>Render the table header.</summary>
			/// <version added="2016.1" updated="2016.1" />

			var that = this;
			this.widgets.header = $(this.html.header.html[this.options.mode]);
			var $table = this.widgets.header.find("table");
			if (this.options.tableCss !== null) {
				if (typeof this.options.tableCss === "string") {
					$table.addClass(this.options.tableCss);
				} else if (typeof this.options.tableCss.header === "string") {
					$table.addClass(this.options.tableCss.header);
				}
			}
			var $tr = $table.find("tr");

			// If checkbox seletion is enabled.
			if (typeof this.options.selectionmode === "object") {
				$table.find("colgroup").append(this.html.checkbox.colgroup.col);
				$tr.append(serenity.format(this.html.checkbox.header, this.options.selectionmode.classes, this.options.selectionmode.unchecked));
			}
			
			// Add column headings.
			for (var cdx = 0; cdx < this._columns.length; cdx++) {
				var $col = $(serenity.format(this.html.header.colgroup.col, this._widths[cdx].width));
				$table.find("colgroup").append($col);
				var column = this._columns[cdx];
				this._renderColumnHeader(column, cdx, $tr);
			}

			this.element.append(this.widgets.header);

			// If any of the columns are filterable, then initialize a filter input.
			if (Enumerable.From(this._columns).Where(function(e) {
					return e.filterable === true;
				}).Count() > 0) {
				this.element.append(this.html.header.column.action.filter.popup);
				this.widgets.filtermenu = this.element.find("div.sr-table-col-filter-popup").serenityFiltermenu({
					dataSource: this._dataSource,
					clear: function() {
						that.widgets.filtermenu.element.hide("up");
					},
					filter: function() {
						that.widgets.filtermenu.element.hide("up");
					}
				}).data("serenityFiltermenu");
			}
			
			// Return the table header.
			return $table;
		},
		
		_renderRow: function(dataItem, rowIndex, $table, isModel) {
			/// <summary>Render a table row.</summary>
			/// <return type="jQuery">Table row that was added to the table.</return>
			/// <version added="2016.1" updated="2017.3" />

			var html = typeof this.options.rowTemplate === "string" ? this.options.rowTemplate : this.options.rowTemplate(dataItem);
			var $tr = $(html);

			$table.append($tr);

			if (this.options.rowCss !== null) {
				if (rowIndex % 2 === 0) {
					$tr.addClass(this.options.rowCss);
				}
			}

			if (this.options.altRowCss !== null) {
				if (rowIndex % 2 !== 0) {
					$tr.addClass(this.options.altRowCss);
				}
			}
			
			if (isModel) {
				$tr.attr("data-uid", dataItem.UUID);
			}
			
			$tr.attr("data-idx", rowIndex);

			// If checkbox seletion is enabled.
			if (typeof this.options.selectionmode === "object") {
				$tr.append(serenity.format(this.html.checkbox.column, this.options.selectionmode.classes, this.options.selectionmode.unchecked));
			}
			
			for (var cdx = 0; cdx < this._columns.length; cdx++) {
				var column = this._columns[cdx];
				var value = dataItem[column.field];
				
				if (column.group === true) {
					$tr.append("<td class='ui-widget-header'></td>");
					
				} else {
					if (typeof value === "undefined" || value === null) {
						value = "";
					}

					// Apply column styles to the table cell.
					var cellStyles = column.styles 
						? (serenity.format(" style='{0}'", typeof column.styles === "function" ? column.styles(dataItem) : column.styles))
						: "";

					// If a temlateSelector is defined, then define the template as
					// Handlebars template.
					if (typeof column.template === "undefined" && typeof column.templateSelector === "string") {
						var template = $(column.templateSelector).html();
						if (template.length > 0) {
							column.template = template;
						}
					}
					
					// Evaluate and display the table cell content.
					var cellContent = 
						typeof column.template === "function" 
							? column.template(dataItem) 
							: (typeof column.template === "string" 
								? (Handlebars.compile(column.template))(dataItem) 
								: value.toString());

					var $td = $(serenity.format("<td{0}>{1}</td>", cellStyles, cellContent));

					// The column is hidden.
					if (column.hidden === true) {
						$td.css("display", "none");
					}

					$tr.append($td);
				}
			}
			
			return $tr;
		},

		_renderBody: function() {
			/// <summary>Render the table body.</summary>
			/// <version added="2016.1" updated="2016.1" />

			var that = this;

			this.widgets.body = $(serenity.format(this.html.body.html[this.options.mode],
				typeof this.options.height !== "undfined" ? serenity.format("height:{0}", this.options.height) : ""));
			var $table = this.widgets.body.find("table");
			if (this.options.tableCss !== null) {
				if (typeof this.options.tableCss === "string") {
					$table.addClass(this.options.tableCss);
				} else if (typeof this.options.tableCss.body === "string") {
					$table.addClass(this.options.tableCss.body);
				}
			}

			// If checkbox seletion is enabled.
			if (typeof this.options.selectionmode === "object") {
				$table.find("colgroup").append(this.html.checkbox.colgroup.col);
			}
			
			// Add column headings.
			for (var cdx = 0; cdx < this._columns.length; cdx++) {
				var $col = $(serenity.format(this.html.header.colgroup.col, this._widths[cdx].width))
				$table.find("colgroup").append($col);
			}

			this.element.append(this.widgets.body);
		},

		_renderAggregates: function() {
			/// <summary>Render the calculations based on the table aggregates.</summary>
			/// <version added="2016.1" updated="2016.1" />

			var that = this;
			this.widgets.calc = $(this.html.calc.html);
			var $tr = this.widgets.calc.find("tr");
			var calculations = this._dataSource.calculations();

			// If checkbox seletion is enabled.
			if (typeof this.options.selectionmode === "object") {
				var $col = $(serenity.format(this.html.header.colgroup.col, "width:100px;"));
				this.widgets.calc.find("colgroup").append($col);
			}

			// Add columns.
			for (var cdx = 0; cdx < this._columns.length; cdx++) {
				var $col = $(serenity.format(this.html.header.colgroup.col, this._widths[cdx].width))
				this.widgets.calc.find("colgroup").append($col);
				var column = this._columns[cdx];
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

				var $th = $(this.html.calc.column({
					field: column.field,
					styles: column.footerStyles || "",
					html: value
				}));
				$tr.append($th);
			}

			this.element.append(this.widgets.calc);
		},

		_renderPager: function(options) {
			/// <summary>Render the table pager.</summary>
			/// <version added="2016.1" updated="2016.1" />

			this.element.append(this.html.pager.html);

			this.widgets.pager = this.element.find("div.sr-table-pager").serenityPagerpanel(options).data("serenityPagerpanel");
		},
		
		_calculateColumns: function () {
			/// <summary>Copy the options.columns and modify as needed for rendering.</summary>
			/// <version added="2017.3" updated="2017.3" />
			
			// Copy the column options array.
			this._columns = this.options.columns.slice();
				
			// If the data is grouped by fields, then for each field, define a column.
			if ($.isArray(this.dataSource().options.group.by) === true) {
				for (var idx = (this.dataSource().options.group.by.length - 1); idx >= 0; idx--) {
					this._columns.unshift({
						title: "",
						width: "25px",
						group: true
					});
				}
			}	 
		},

		_calculateColumnWidths: function() {
			/// <summary>Calculate all the column widths.</summary>
			/// <version added="2016.1" updated="2016.1" />
			
			this._widths = [];
			// var defaultWidth = (100 / this._columns.length).toString() + "%";
			
			var defaultWidth = "100%";
			
			for (var cdx = 0; cdx < this._columns.length; cdx++) {
				var column = this._columns[cdx];
				var hasWidth = typeof column.width !== "undefined";
				this._widths.push({
					width: column.hidden === true ? "display:none" : (serenity.format("width:{0}", hasWidth ? column.width : defaultWidth)),
					hasWidth: hasWidth
				});
			}
			/*
			var found = false;
			for (var idx = (this._widths.length - 1); idx >= 0 && found === false; idx--) {
				if ((found = (this._widths[idx].hasWidth === false)) === true) {
					this._widths[idx].width = "";
				}
			}
			*/
		},

		_preLoad: function() {
			/// <summary>Override to perform any actions after the heading and body are rendered and before the data is loaded.</summary>
			/// <version added="2017.3" updated="2017.3" />
		},

		_postRender: function() {
			/// <summary>Override to render after header, body, footer and pager.</summary>
			/// <version added="2016.1" updated="2016.1" />
		},
		
    /***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/

		load: function() {
			/// <summary>Load the data from the dataSource into the table.</summary>
			/// <version added="2016.1" updated="2016.1" />

			var that = this;
			var $table = this.widgets.body.find("table");

			// Remove any data rows.
			$table.find("tr").remove();

			if (this._dataSourceValid()) {
				var page = this._dataSource.page();
				if (page.Count() > 0) {
					var isModel = page.First() instanceof serenity.Model;
					page.ForEach(function(dataItem, index) {
						// Is this a group?
//						if ($.isArray(that._dataSource.options.group.by) === true && that._dataSource.options.group.by.length > 0) {
//							that._renderGroup(dataItem, 0, $table, isModel);
//						} else {
							// Add rows.
							that._renderRow(dataItem, index, $table, isModel);
//						}
					});
				}
			}
		},

		render: function() {
			/// <function>render</function>
			/// <summary>
			/// Render the table. The table widget responds to changes in options or DataSource items and calls the render function internally to render the table. 
			/// Thier should not be a need to call the render function explicitly.
			/// </summary>
			/// <example for="JavaScript">
			/// $("#table").data("serenityTable").render();
			/// </example>
			/// <version added="2016.1" updated="2016.1" />

			var that = this;

			if (this._dataSource !== null && this._dataSource instanceof serenity.DataSource) {
				this.element.empty();
				
				// Initialize selection.
				this._initSelection(this.options);
				
				this._calculateColumns();
				
				this._calculateColumnWidths();
/*				
				// The groupable option is true or an Object and the groupable.header option is not false.
				if (this.options.groupable === true || (typeof this.options.groupable === "object" && this.options.groupable.header !== false)) {
					// If the DataSource.options.group.by is null, then set to an empty array.
					if (this._dataSource.options.group.by === null) {
						this._dataSource.options.group.by = [];
					}
					this._renderGroupHeader();
				}
*/
				this._renderHeader();
				this._renderBody();
				
				this._preLoad();
				
				this.load();
				if (this.options.showCalculations && this._dataSource.calculations() !== null) {
					this._renderAggregates();
				}
				
        if (this.options.pageable !== false) {
					var options = $.extend(true, {}, {
							dataSource: this._dataSource
						},
						typeof this.options.pageable === "object" ?
						this.options.pageable :
						{});
					this._renderPager(options);
				}

				// If the body height is greater than the table height
				var $table = this.widgets.body.find("table");
				if (this.widgets.body.height() < $table.height()) {
					// Add a "column" header table that is the same width as the scrollbar.
					var width = serenity.getScrollBarWidth();
					var $col = $(serenity.format(this.html.header.colgroup.col, serenity.format("width:{0}px", width)));
					this.widgets.header.find("table tr").append(that.html.header.column.scrollbar[this.options.mode]);
					this.widgets.header.find("colgroup").append($col);
					if (this.options.showCalculations) {
						// Add a "column" to the calc table that is the same width as the scrollbar.
						this.widgets.calc.find("table tr").append(that.html.header.column.scrollbar[this.options.mode]);
						this.widgets.calc.find("colgroup").append($col[0].outerHTML);
					}
				}

				this._postRender();

				this._trigger("dataBound");
			}
		},

		setDataSource: function(ds) {
			/// <function>setDataSource</function>
			/// <summary>Set the data source.</summary>
      /// <param name="ds" type="serenity.DataSource|Array">
			/// Contains the data to be displayed in the table. If the data is set to an array of objects, 
			/// then the instance of the serenity.DataSource that is instantiated will have the 
			/// serenity.DataSource.trackChanges option set to false.
			/// </param>
			/// <example for="JavaScript" description="Set the DataSource for the table.">
			/// $("#table").data("serenityTable").setDataSource(new serenity.DataSource({ data: employees }));
			/// </example>
			/// <version added="2016.1" updated="2016.1" />
			
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

			return this;
		},
		
		select: function(rows, replace) {
			/// <function>select</function>
			/// <summary>
			/// Select rows. Requires the options.selectionmode !== 'none'. To clear the selected rows, pass in: rows = null, replace = true.
			/// </summary>
      /// <param name="rows" type="String | jQuery">
			/// A string or jQuery object which represents the table row(s). A string is treated as a jQuery selector.
			/// </param>
			/// <param name="replace" type="Boolean" optional="true">
			/// Flag indicating whether the rows passed in will replace what is currently selected or is in addition to what is already selected. Default is true.
			/// </param>
			/// <example for="JavaScript" description="Select all the rows that have the sr-table-altrow CSS class.">
			/// $("#table").data("serenityTable").select("tr.sr-table-altrow");
			/// </example>
			/// <example for="JavaScript" description="Remove selection from all rows.">
			/// $("#table").data("serenityTable").select(null);
			/// </example>
			/// <version added="2017.3" updated="2017.3" />
			
			// Get the rows.
			var $rows = typeof rows === "string" ? this.widgets.body.find(rows) : rows;
			
			if (typeof replace === "undefined" || replace === true) {
				if (typeof this.options.selectionmode === "object") {
					// Uncheck all checkboxes.
					this.element.find(".sr-table-checkbox-select i")
						.removeClass(this.options.selectionmode.checked)
						.addClass(this.options.selectionmode.unchecked);
				} else {
					// Remove selection from rows.
					this.element.find("tr.ui-state-active").removeClass("ui-state-active");
				}
			}
			
			if (rows !== null && $rows.length > 0) {
				// Based on the selectionmode, determine how to select the rows.
				
				if (typeof this.options.selectionmode === "object") {
					$rows.find(".sr-table-checkbox-select i")
						.removeClass(this.options.selectionmode.unchecked)
						.addClass(this.options.selectionmode.checked);
					
					// Are there rows that are unchecked?
					var indeterminate = this.widgets.body.find(serenity.format(".sr-table-checkbox-select i.{0}", this.options.selectionmode.unchecked)).length > 0;
					
					//
					// Set the checkbox in the heading.
					//
					
					// Get the checkbox in the heading.
					var $checkbox = this.widgets.header.find(".sr-table-checkbox-select i");
					
					// Remove the checkbox.
					$checkbox
						.removeClass(this.options.selectionmode.checked)
						.removeClass(this.options.selectionmode.unchecked)
						.removeClass(this.options.selectionmode.indeterminate)

					// Set the checkbox to the appropriate state.
					$checkbox.addClass(indeterminate === true ? this.options.selectionmode.indeterminate : this.options.selectionmode.checked);
					
				} else if (this.options.selectionmode === "singlerow") {
					$($rows[0]).addClass("ui-state-active");
				} else if (this.options.selectionmode === "multiplerows") {
					$rows.addClass("ui-state-active");
				}
			}
		},

		selectedRows: function() {
			/// <function>selectedRows</function>
			/// <summary>Get the selected rows.</summary>
			/// <return type="jQuery">A jQuery object containing the selected table rows.</return>
			/// <example for="JavaScript" description="Get the selected table rows.">
			/// var selectedRows = $("#table").data("serenityTable").selectedRows();
			/// </example>
			/// <version added="2016.1" updated="2016.1" />

			if (typeof this.options.selectionmode === "object") {
				return this.widgets.body.find("tr").has(serenity.format("td i.{0}", this.options.selectionmode.checked));
			} else {
				return this.widgets.body.find("tr.ui-state-active");
			}
		},

		selectedRowItems: function() {
			/// <function>selectedRowItems</function>
			/// <summary>Get the items from the dataSource for the selected rows.</summary>
			/// <return type="Array">Array containing the items from the DataSource that correspond to the selected table rows.</return>
			/// <example for="JavaScript">
			/// var selectedRowItems = $("#table").data("serenityTable").selectedRowItems();
			/// </example>
			/// <version added="2016.1" updated="2016.1" />

			var items = [];
			var page = this.dataSource().page();
			
			this.selectedRows().each(function(i, row) {
				var index = parseInt($(row).attr("data-idx"));
				items.push(page.ElementAt(index));
			});

			return items;
		},
		
		hideColumn: function (column) {
			/// <function>hideColumn</function>
			/// <summary>Hide a column.</summary>
			/// <param name="column" type="Integer|String">The index or field name of the column to hide.</param>
			/// <example for="JavaScript" description="Hide the column at index 1 and the column with the 'character' field.">
			/// <![CDATA[
			/// var table = $("#table").serenityTable({
			///   dataSource: [
			///     { id: 1, givenname: "Keanu", surname: "Reeves", character: "Neo" },
			///     { id: 2, givenname: "Laurence", surname: "Fishburne", character: "Morpheus" },
			///     { id: 3, givenname: "Carrie-Anne", surname: "Moss", character: "Trinity" }
			///   ],
			///   columns: [{
			///			title: "Given Name",
			///			field: "givenname"
			///		},{
			///			title: "Surname",
			///			field: "surname"
			///		},{
			///			title: "Character",
			///			field: "character",
			///			styles: function (item) {
			///				return item.character === "Neo" ? "color:blue;" : "";
			///			}
			///		}]
			/// }).data("serenityTable");
			///
			/// // Hide the column at index 1 (surname)
			/// table.hideColumn(1);
			///
			/// // Hide the column for the character field.
			/// table.hideColumn("character");
			/// ]]>
			/// </example>
			/// <version added="2017.3" updated="2017.3" />
			
			var that = this;
			var columns = Enumerable.From(this._columns)
				.Where(function (item, idx) {
					var found = false;
					if (typeof column === "string") {
						if ((found = item.field === column) === true) {
							item.hidden = true;
						}
					} else if (typeof column === "number") {
						if ((found = idx === column) === true) {
							item.hidden = true;
						}
					}
					
					return found;
				})
				.ToArray();
			
			// Columns were hidden.
			if (columns.length > 0) {
				// Render the current view.
				this.render();
			
				// Trigger the columnHide event.
				Enumerable.From(columns)
					.ForEach(function (item) {
					that._trigger("columnHide", null, { column: item  });
				});
			}
			
			return this;
		},
		
		showColumn: function (column) {
			/// <function>showColumn</function>
			/// <summary>Show a column.</summary>
			/// <param name="column" type="Integer|String">The index or field name of the column to show.</param>
			/// <example for="JavaScript" description="Show the column at index 1 and the column with the 'character' field.">
			/// <![CDATA[
			/// var table = $("#table").serenityTable({
			///   dataSource: [
			///     { id: 1, givenname: "Keanu", surname: "Reeves", character: "Neo" },
			///     { id: 2, givenname: "Laurence", surname: "Fishburne", character: "Morpheus" },
			///     { id: 3, givenname: "Carrie-Anne", surname: "Moss", character: "Trinity" }
			///   ],
			///   columns: [{
			///			title: "Given Name",
			///			field: "givenname"
			///		},{
			///			title: "Surname",
			///			field: "surname",
			///			hidden: true
			///		},{
			///			title: "Character",
			///			field: "character",
			///			styles: function (item) {
			///				return item.character === "Neo" ? "color:blue;" : "";
			///			},
			///			hidden: true
			///		}]
			/// }).data("serenityTable");
			///
			/// // Show the column at index 1 (surname)
			/// table.showColumn(1);
			///
			/// // Show the column for the character field.
			/// table.showColumn("character");
			/// ]]>
			/// </example>
			/// <version added="2017.3" updated="2017.3" />
			
			Enumerable.From(this._columns)
				.ForEach(function (item, idx) {
					if (typeof column === "string") {
						if (item.field === column) {
							item.hidden = false;
						}
					} else if (typeof column === "number") {
						if (idx === column) {
							item.hidden = false;
						}
					}
				});
			
			this.render();
			
			return this;
		}
	});
})(window.jQuery, window.serenity);


/*
 * Columns Options
 */

/// <option>columns.field</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>The field in the model to be displayed for each row.</summary>
/// <example for="JavaScript" description="Initialize the table with field in the model to be displayed.">
///   $("#table").serenityTable({
///     dataSource: employees,
///     columns: [
///       { title: "Name", field: "fullName" },
///       { title: "Title", field: "title" }
///     ]
///   });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.filterable</option>
/// <datatype>Boolean</datatype>
/// <default>false</default>
/// <summary>Flag indicating whether the column can be filtered.</summary>
/// <example for="JavaScript" description="Initialize the table with the columns.filterable option specified">
///   $("#table").serenityTable({
///     dataSource: employees,
///     columns: [
///       { title: "Name", field: "fullName", filterable: true },
///       { title: "Title", field: "title", filterable: true }
///     ]
///   });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.footerStyles</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>Styles to apply to the span element rendered in the footer cell.</summary>
/// <example for="JavaScript" description="Initialize the table with the columns.footerStyles option specified">
/// $("#table").serenityTable({
///   dataSource: new serenity.DataSource({
///     data: employees,
///     aggregates: [
///       { field: "age", calc: "average" }
///     ]
///   }),
///   columns: [{
///     title: "Name",
///     field: "fullName"
///   }, {
///     title: "Title",
///     field: "title"
///   }, {
///     title: "Age",
///     field: "age",
///     footerStyles: "color:green;"
///   }]
///   showCalculations: true
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.footerTemplate</option>
/// <datatype>String | Function | HandleBars Template</datatype>
/// <default>null</default>
/// <summary>A template for rendering the footer for the column.</summary>
/// <example for="JavaScript" description="Initialize the table with the columns.footerTemplate option specified">
/// <![CDATA[
/// $("#table").serenityTable({
///   dataSource: new serenity.DataSource({
///     data: employees,
///     aggregates: [
///       { field: "age", calc: "average" }
///     ]
///   }),
///   columns: [{
///     title: "Name",
///     field: "fullName"
///   }, {
///     title: "Title",
///     field: "title"
///   }, {
///     title: "Age",
///     field: "age",
///     footerTemplate: "<span style='color:blue;'>Average: {{average}}</span>"
///   }],
///   showCalculations: true
/// });
/// ]]>
/// </example>
/// <version added="2016.1" updated="2016.1" />

// <option>columns.hidden</option>
/// <datatype>Boolean</datatype>
/// <default>false</default>
/// <summary>Flag indicating whether the column should be hidden.</summary>
/// <example for="JavaScript" description="Initialize the table with the columns.hidden option specified">
/// $("#table").serenityTable({
///   dataSource: new serenity.DataSource({
///     data: employees
///   }),
///   columns: [{
///     title: "Name",
///     field: "fullName"
///   }, {
///     title: "Title",
///     field: "title"
///   }, {
///     title: "Age",
///     field: "age",
///     hidden: true
///   }]
/// });
/// </example>
/// <version added="2017.3" updated="2017.3" />

/// <option>columns.sortable</option>
/// <datatype>Boolean</datatype>
/// <default>false</default>
/// <summary>Flag indicating whether the column can be sorted.</summary>
/// <example for="JavaScript" description="Initialize the table with the columns.sortable option specified">
/// $("#table").serenityTable({
///   dataSource: new serenity.DataSource({
///     data: employees
///   }),
///   columns: [{
///     title: "Name",
///     field: "fullName",
///     sortable: true
///   }, {
///     title: "Title",
///     field: "title",
///     sortable: true
///   }, {
///     title: "Age",
///     field: "age",
///     sortable: true
///   }]
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.styles</option>
/// <datatype>String | Function | HandleBars Template</datatype>
/// <default>null</default>
/// <summary>Styles to apply to the span element rendered in the row cell.</summary>
/// <example for="JavaScript" description="Define a string for the column styles to display the givenname as italic.">
/// $("#table").serenityTable({
///   dataSource: [
///     { id: 1, givenname: "Keanu", surname: "Reeves", character: "Neo" },
///     { id: 2, givenname: "Laurence", surname: "Fishburne", character: "Morpheus" },
///     { id: 3, givenname: "Carrie-Anne", surname: "Moss", character: "Trinity" }
///   ],
///   columns: [{
///			title: "Given Name",
///			field: "givenname",
///     styles: "font-style:italic;"
///		},{
///			title: "Surname",
///			field: "surname"
///		},{
///			title: "Character",
///			field: "character"
///		}]
/// })
/// </example>
/// <example for="JavaScript" description="Define a function for the column styles to display the character text as blue if the character is Neo.">
/// $("#table").serenityTable({
///   dataSource: [
///     { id: 1, givenname: "Keanu", surname: "Reeves", character: "Neo" },
///     { id: 2, givenname: "Laurence", surname: "Fishburne", character: "Morpheus" },
///     { id: 3, givenname: "Carrie-Anne", surname: "Moss", character: "Trinity" }
///   ],
///   columns: [{
///			title: "Given Name",
///			field: "givenname"
///		},{
///			title: "Surname",
///			field: "surname"
///		},{
///			title: "Character",
///			field: "character",
///			styles: function (item) {
///				return item.character === "Neo" ? "color:blue;" : "";
///			}
///		}]
/// })
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.template</option>
/// <datatype>String | Function | HandleBars Template</datatype>
/// <default>null</default>
/// <summary>A template for rendering a cell for the column.</summary>
/// <example for="JavaScript" description="Define a function for the column template to display the givenname and surname in the Name column.">
/// $("#table").serenityTable({
///   dataSource: [
///     { id: 1, givenname: "Keanu", surname: "Reeves", character: "Neo" },
///     { id: 2, givenname: "Laurence", surname: "Fishburne", character: "Morpheus" },
///     { id: 3, givenname: "Carrie-Anne", surname: "Moss", character: "Trinity" }
///   ],
///   columns: [{
///			title: "Name",
///			template: function (item) {
///				return serenity.format("{0} {1}", item.givenname, item.surname);
///			}
///		},{
///			title: "Character",
///			field: "character"
///		}]
/// })
/// </example>
/// <example for="JavaScript" description="Define a Handlebars template for the column template to display the givenname and surname in the Name column.">
/// $("#table").serenityTable({
///   dataSource: [
///     { id: 1, givenname: "Keanu", surname: "Reeves", character: "Neo" },
///     { id: 2, givenname: "Laurence", surname: "Fishburne", character: "Morpheus" },
///     { id: 3, givenname: "Carrie-Anne", surname: "Moss", character: "Trinity" }
///   ],
///   columns: [{
///			title: "Name",
///			template: Handlebars.compile("{{givenname}} {{surname}}"),
///		},{
///			title: "Character",
///			field: "character"
///		}]
/// })
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <options>columns.templateSelector</options>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>CSS Selector for the HTML element that contains the template used to render a cell for the column.</summary>
/// <version added="2017.4" updated="2017.4" />

/// <option>columns.title</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>Title to be displayed for a column.</summary>
/// <example for="JavaScript" description="Initialize the table with the columns.title option specified">
///   $("#table").serenityTable({
///     dataSource: employees,
///     columns: [
///       { title: "Name", field: "fullName" },
///       { title: "Title", field: "title" }
///     ]
///   });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <option>columns.width</option>
/// <datatype>String</datatype>
/// <default>null</default>
/// <summary>The width for the column.</summary>
/// <example for="JavaScript" description="Initialize the table with the columns.title option specified">
///   $("#table").serenityTable({
///     dataSource: employees,
///     columns: [
///       { title: "Name", field: "fullName", width: "200px" },
///       { title: "Title", field: "title" }
///     ]
///   });
/// </example>
/// <version added="2016.1" updated="2016.1" />


/*
 * Pageable Options
 */

/// <option>pageable.messages.goto</option>
/// <datatype>String</datatype>
/// <default>"Go to page:"</default>
/// <summary>
/// The message to be displayed on the pager panel for the input field to go to a page.
/// </summary>
/// <example for="JavaScript" description="Initialize the table with the pageable.messages.goto option specified">
/// $(".selector").serenityTable({
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
/// <example for="JavaScript" description="Initialize the table with the pageable.messages.pagesize option specified">
/// $(".selector").serenityTable({
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
/// <example for="JavaScript" description="Initialize the table with the pageable.messages.items option specified">
/// $(".selector").serenityTable({
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
/// <example for="JavaScript" description="Initialize the table with the pageable.pagesizes option specified">
/// $(".selector").serenityTable({
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
/// <param name="ui.sender" type="serenity.table">Instance of the table.</param>
/// <example for="JavaScript" description="Initialize the table with the dataBound callback specified">
/// $("#table").serenityTable({
///   dataSource: new serenity.DataSource({
///     data: employees
///   }),
///   columns: [{
///     title: "Name",
///     field: "fullName",
///     sortable: true
///   }, {
///     title: "Title",
///     field: "title",
///     sortable: true
///   }, {
///     title: "Age",
///     field: "age",
///     sortable: true
///   }],
///   dataBound: function (event, ui) {
///     console.log("dataBound event raised");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>select</event>
/// <summary>Triggered when a row has been selected.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.table">Instance of the table.</param>
/// <example for="JavaScript" description="Initialize the table with the select callback specified">
/// $("#table").serenityTable({
///   dataSource: new serenity.DataSource({
///     data: employees
///   }),
///   columns: [{
///     title: "Name",
///     field: "fullName",
///     sortable: true
///   }, {
///     title: "Title",
///     field: "title",
///     sortable: true
///   }, {
///     title: "Age",
///     field: "age",
///     sortable: true
///   }],
///   select: function (event, ui) {
///     console.log(ui.sender.selectedRowItems());
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />
