/**
 * Serenity UI v2017.1.170720 (https://www.serenityui.com)
 */
(function ($) {
    $.widget("serenity.pagerpanel", $.serenity.datawidget, {
        /// <core>serenity.pagerpanel</core>
        /// <inherits url="serenity.widget.html">ui.widget</inherits>
        /// <typedef>interface Pagerpanel extends Widget</typedef>
        /// <typedef for="JQuery">serenityPagerpanel(): JQuery</typedef>
        /// <typedef for="JQuery">serenityPagerpanel(options: any): JQuery</typedef>
        /// <summary>Display a panel for paging a data source.</summary>
        /// <element>div</element>
        /// <version added="2016.1" updated="2016.1" />

        options: {
            /// <option>dataSource</option>
            /// <datatype>serenity.DataSource</datatype>
            /// <default>[]</default>
            /// <typedef>dataSource: serenity.DataSource</typedef>
            /// <summary>Data to be paged.</summary>
            /// <version added="2016.1" updated="2016.1" />
            dataSource: [],

            /// <option>messages</option>
            /// <datatype>JSON Object</datatype>
            /// <typedef>messages: any</typedef>
            /// <summary>Messages used by the pager panel.</summary>
            /// <version added="2016.1" updated="2016.1" />
            messages: {
                goto: "Go to page:",
                pagesize: "Show rows",
                items: Handlebars.compile("{{start}}-{{end}} of {{size}}")
            },

            /// <option>pagesizes</option>
            /// <datatype>Array</datatype>
            /// <default>[10, 25, 50, 100]</default>
            /// <typedef>pagesizes: number[]</typedef>
            /// <summary>Page sizes to select.</summary>
            /// <version added="2016.1" updated="2016.1" />
            pagesizes: [10, 25, 50, 100]
        },

        html: {
            content: 
                "<div class='ui-widget-content'>" + 
                    "<div class='sr-pagerpanel-input'>" +
						"<div class='sr-pagerpanel-gotopage'>" +
							"<span class='sr-pagerpanel-pagemessage'>Go to page:</span>" +
							"<input class='ui-widget-input sr-pagerpanel-pagenum' />" +
						"</div>" + 
						"<div class='sr-pagerpanel-pagesize'>" +
							"<span class='sr-pagerpanel-sizemessage'>Show rows:</span>" +
							"<select class='sr-pagerpanel-sizeselect'></select>" +
						"</div>" + 
						"<div class='sr-pagerpanel-navigate'>" +
							"<span class='sr-pagerpanel-items'></span>" +
							"<button class='sr-pagerpanel-prev'></button>" +
							"<button class='sr-pagerpanel-next'></button>" +
						"</div>" + 
					"</div>" + 
                "</div>"
        },

        _create: function () {
            /// <summary>Constructor for the pagerpanel.</summary>

            // Call the base class.
            this._super();
            
            this.element.append(this.html.content);
            
            // Initialize the page number.
            this.widgets.pageNumber = this.element.find(".sr-pagerpanel-pagenum");
			this.widgets.pageNumber.on("blur", $.proxy(this._onPageNumberChange, this));

            // Initialize the page size dropdownlist.
            this.widgets.pageSize = this.element.find(".sr-pagerpanel-sizeselect").serenityDropdownlist({
                dataSource: new serenity.DataSource(),
                textField: "size",
                valueField: "size",
				width: 70,
                change: $.proxy(this._onPageSizeChange, this)
            }).data("serenityDropdownlist");

            // Initialize the "Previous" button.
            this.element.find("button.sr-pagerpanel-prev").button({ icons: { primary: "fa fa-caret-left" } })
                .click($.proxy(this._onPrev, this))
                .find(".ui-button-icon")
                    .removeClass("ui-button-icon")
                    .removeClass("ui-icon");

            // Initialize the "Next" button.
            this.element.find("button.sr-pagerpanel-next").button({ icons: { primary: "fa fa-caret-right" } })
                .click($.proxy(this._onNext, this))
                .find(".ui-button-icon")
                    .removeClass("ui-button-icon")
                    .removeClass("ui-icon");

            // Set the dataSource.
            this.setDataSource(this.options.dataSource);
        },

        _onDataSourceChange: function () {
            /// <summary>When a change occurs in the data source, load the widget.</summary>

            this.load();
        },

		_onPageNumberChange: function () {
            /// <summary>When when the page number changes, set the page in the datasource.</summary>
			
            var page = this.options.dataSource.options.page;

			// Get the page number.
			var pageNum = parseInt(this.widgets.pageNumber.val());
			
			// Is the page number valid?
			if (pageNum > 0 && pageNum <= page.count) {
				this.options.dataSource.changePage(pageNum);
			} else {
				this.widgets.pageNumber.val(page.current);
			}
		},

        _onPageSizeChange: function (event, ui) {
            /// <summary>When when the page size changes, set the page size in the datasource.</summary>

            this._dataSource.changePage(1, this.widgets.pageSize.dataItem().size);
        },
        
        _onPrev: function () {
            /// <summary>Move to the previous page.</summary>
            
            var page = this.options.dataSource.options.page;
            
            if (page.current > 1) {
                this.options.dataSource.changePage(page.current - 1);
                this.load();
            }
        },
        
        _onNext: function () {
            /// <summary>Move to the next page.</summary>
            
            var page = this.options.dataSource.options.page;
            
            if (page.current < page.count) {
                this.options.dataSource.changePage(page.current + 1);
                this.load();
            }
        },
        
        load: function () {
            /// <function>load</function>
            /// <typedef>load: () => void</typedef>
            /// <summary>Load information to be displayed about the current page.</summary>
            /// <version added="2016.1" updated="2016.1" />
            
            if (this._dataSourceValid) {
                var page = this._dataSource.options.page;

                // Load the page number.
                this.widgets.pageNumber.val(page.current);

                // Add the page size from the dataSource if not in the
                // options.pagesizes.
                var sizes = $.merge([], this.options.pagesizes);
                if (page.size !== null && sizes.indexOf(page.size) === -1) {
                    sizes.push(page.size);
                }

                // Load the page sizes.
                var pageSizes = Enumerable.From(sizes)
                    .Select(function (size) { return { size: size }; })
                    .OrderBy("$.size")
                    .ToArray();
                this.widgets.pageSize._dataSource.data(pageSizes);
                this.widgets.pageSize.value(page.size);
                
                // Load the navigation.
                var size = this._dataSource.view().Count();
                var start = ((page.current - 1) * page.size);
                var end = start + this._dataSource._current.page.Count();
                
                this.element.find(".sr-pagerpanel-items").text(this.options.messages.items({ start: start + 1, end: end, size: size }));
            }
        },
        
        setDataSource: function (ds) {
            /// <function>setDataSource</function>
            /// <typedef>setDataSource: (ds: serenity.DataSource) => void</typedef>
            /// <summary>Set the data source for the pagerpanel.</summary>
            /// <param name="ds" type="serenity.dataSource">Contains the data to be paged.</param>
            /// <version added="2016.1" updated="2016.1" />
            
            this._super(ds);

            this.load();
        },
    });
})(window.jQuery);
