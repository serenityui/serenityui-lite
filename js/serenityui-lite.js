/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
(function ($, serenity) {
    serenity.Model = serenity.Observable.extend({
        /// <class>serenity.Model</class>
        /// <inherits url="serenity.Observable.html">serenity.Observable</inherits>
        /// <typedef>export class Model</typedef>
        /// <summary>Model tracks changes to data and raises an event when data is changed.</summary>
        /// <version added="2016.1" updated="2017.1" />

        /// <summary>Values passed into the constructor when initialized.</summary>
        /// <datatype>JSON Object</datatype>
        /// <default>null</default>
        /// <version added="2016.1" updated="2016.1" />
        _pristine: null,

        /// <property>dirty</property>
        /// <datatype>Boolean</datatype>
        /// <typedef>dirty: boolean</typedef>
        /// <summary>Flag indicating whether data has changed.</summary>
        /// <version added="2016.1" updated="2016.1" />
        dirty: null,

        /// <property>UUID</property>
        /// <datatype>String</datatype>
        /// <summary>Universal unique identifier used to uniquely identify the instance of the model.</summary>
        /// <version added="2016.1" updated="2016.1" />
        UUID: null,

        /// <inheritedFrom>serenity.Observable</inheritedFrom>
        /// <datatype>Array</datatype>
        /// <typedef>events: string[]</typedef>
        /// <summary>Array of events.</summary>
        /// <version added="2016.1" updated="2016.1" />
        events: [
            /// <event>change</event>
            /// <summary>Fired when a change occurs in the data.</summary>
            /// <param name="e.model" type="serenity.Model">Model that triggered the change event.</param>
            /// <param name="e.attribute" type="String">The attribute that changed.</param>
            /// <param name="e.value" type="Object">The value assigned to the attribute.</param>
            /// <param name="e.before" type="Object">The value of the attribute before the new value was assigned.</param>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person({ firstName: "John", lastName: "Doe" });
            /// person.bind("change", function (e) {
            ///   console.log(e);
            /// });
            /// person.set("lastName", "Smith");
            /// </example>
            /// <version added="2016.1" updated="2016.1" />
            "change"
        ],

        options: {
            // <option>id</option>
            /// <datatype>String</datatype>
            /// <summary>Attribute that contains a unique value for the instance of the model.</summary>
            /// <version added="2016.1" updated="2016.1" />
            id: null
        },

        constructor: function (values, options) {
            /// <function>constructor</function>
            /// <typedef>constructor()</typedef>
            /// <typedef>constructor(values: any)</typedef>
            /// <typedef>constructor(values: any, options: any)</typedef>
            /// <summary>Constructor for the model.</summary>
            /// <version added="2016.1" updated="2016.1" />

            serenity.Observable.call(this, options);

            this.dirty = false;
            this.UUID = serenity.guid();

            // Initialize the model with the values passed in.
            if (arguments.length > 0) {
                this.initializeValues(values);
            }
        },

        set: function (property, value) {
            /// <function>set</function>
            /// <typedef>set(property: string, value: any)</typedef>
            /// <summary>Set the value of a property in the model.</summary>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person();
            /// person.set("firstName", "John");
            /// person.set("lastName", "Doe");
            /// </example>
            /// <version added="2016.1" updated="2016.1" />

            var different = this[property] != value;
            if (different) {
                var before = typeof this[property] !== "undefined" ? this._cloneProperty(property) : undefined;
                this._setProperty(property, value);
                this.dirty = true;
                this.trigger("change", { model: this, property: property, value: this[property], before: before });
            }
            return different;
        },

        toJSON: function () {
            /// <function>toJSON</function>
            /// <typedef>toJSON()</typedef>
            /// <summary>Convert the model to a JSON object.</summary>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person({ firstName: "John", lastName: "Doe" });
            /// console.log(person.toJSON());
            /// </example>
            /// <version added="2016.1" updated="2016.1" />

            var json = {};
            var modelAttributes = ",";

            for (var key in serenity.Model.prototype) {
                modelAttributes += key + ",";
            }

            for (var key in this) {
                if (modelAttributes.indexOf("," + key + ",") === -1) {
                    json[key] = this[key];
                }
            }
            return json;
        },
        
        initializeValues: function (values) {
          /// <function>initializeValues</function>
          /// <summary>
          /// Initialize the values in the model and track the changes that are applied to the model.
          /// The initializeValues function is called in the serenity.Model constructor when a JSON 
          /// object with the property values is passed into the model constructor. If a JSON object 
          /// is not passed into the model constructor, then the initializeValues function can be
          /// called after the model is instantiated to initialize the values in the model.
          /// </summary>
          /// <example for="JavaScript">
          /// var Person = serenity.Model.extend({
          ///   firstName: null,
          ///   lastName: null
          /// });
          /// var person = new Person();
          /// person.initializeValues({
          ///   firstName: "John",
          ///   lastName: "Doe"
          /// });
          /// person.set("lastName", "Smith");
          /// console.log(person.toJSON());
          /// person.rollback();
          /// console.log(person.toJSON());
          /// </example>
          /// <version added="2017.3" updated="2017.3" />
          
          this._pristine = values;
          this._initProperties(values);
          this.dirty = false;
        },
        
        rollback: function () {
            /// <function>rollback</function>
            /// <summary>Rollback the values in the model to the values that were set when the model was instantiated.</summary>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person({ firstName: "John", lastName: "Doe" });
            /// person.set("lastName", "Smith");
            /// console.log(person.toJSON());
            /// person.rollback();
            /// console.log(person.toJSON());
            /// </example>
            /// <version added="2017.1" updated="2017.1" />
            
            try {
                if (typeof this._pristine === "object") {
                    for (var key in this._pristine) {
                        this[key] = this._pristine[key];
                    }
                    this.dirty = false;
                }
            } catch (err) {
            }
            
            return this;
        },

        commit: function () {
            /// <function>commit</function>
            /// <typedef>commit()</typedef>
            /// <summary>Commit the values in the model to the values that have been set since the model was instantiated.</summary>
            /// <example for="JavaScript">
            /// var Person = serenity.Model.extend({
            ///   firstName: null,
            ///   lastName: null
            /// });
            /// var person = new Person({ firstName: "John", lastName: "Doe" });
            /// person.set("lastName", "Smith");
            /// console.log(person.toJSON());
            /// person.commit();
            /// console.log(person.toJSON());
            /// </example>
            /// <version added="2017.1" updated="2017.1" />
            
            try {
                if (typeof this._pristine === "object") {
                    for (var key in this._pristine) {
                        this._pristine[key] = this[key];
                    }
                    this.dirty = false;
                }
            } catch (err) {
            }
            
            return this;
        }
    });
})(window.jQuery, window.serenity);

(function ($, serenity) {
    serenity.overlay = {
        /// <module>serenity.overlay</module>
        /// <summary>Module to show or hide an overlay to notify the end user to wait for an action to complete.</summary>
        /// <version added="2016.1" updated="2016.1" />

        show: function (e) {
            /// <function>show</function>
            /// <summary>Show an overlay.</summary>
            /// <param name="e.element" type="jQuery Object" optional="true" default="$('body')">The element where the overlay will be displayed.</param>
            /// <param name="e.text" type="String" optional="true">Text to display in the overlay.</param>
            /// <param name="e.cssClass" type="String" optional="true">A CSS class to add to the overlay text element.</param>
            /// <example for="JavaScript" description="Display an overlay over the entire page.">
            /// serenity.overlay.show({ text: "Loading..." });
            /// </example>
            /// <example for="JavaScript" description="Display an overlay over a specific element.">
            /// serenity.overlay.show({ element: $("#table"), text: "Loading..." });
            /// </example>
            /// <version added="2016.1" updated="2016.1" />

            var e = $.extend({ element: $("body"), text: "", cssClass: "" }, e);

            return $.Deferred(function (deferred) {
                var overlay = e.element.find(".jx-overlay");
                if (overlay.length === 0) {
                    overlay = $(serenity.format("<div class='jx-overlay'><div class='ui-widget-overlay ui-front'></div><div class='jx-overlay-text'>{0}</div></div>", e.text));
                    e.element.append(overlay);
                } else {
                    overlay.find(".jx-overlay-text").attr("class", "jx-overlay-text");
                    overlay.find(".jx-overlay-text").text(e.text);
                }
                if (e.cssClass.length > 0) {
                    overlay.find(".jx-overlay-text").addClass(e.cssClass);
                }
                overlay.show();

                setTimeout(function () {
                    deferred.resolve();
                }, 10);
            }).promise();
        },

        hide: function (e) {
            /// <function>hide</function>
            /// <summary>Hide an overlay.</summary>
            /// <param name="e.element" type="jQuery Object" optional="true" default="$('body')">The element where the overlay is located.</param>
            /// <example for="JavaScript" description="Hide an overlay that has been displayed over the entire page.">
            /// serenity.overlay.hide();
            /// </example>
            /// <example for="JavaScript" description="Hide an overlay that has been displayed over a specific element.">
            /// serenity.overlay.hide({ element: $("#table") });
            /// </example>
            /// <version added="2016.1" updated="2016.1" />

            var e = $.extend({ element: $("body") }, e);
            var overlay = e.element.find(".jx-overlay");
            if (overlay.length > 0) {
                overlay.remove();
            }
        }
    };
})(window.jQuery, window.serenity);

(function ($) {
    $.widget("serenity.filtermenu", $.serenity.datawidget, {
        /// <core>serenity.filtermenu</core>
        /// <inherits url="serenity.widget.html">ui.widget</inherits>
        /// <typedef>interface Filtermenu extends Widget</typedef>
        /// <typedef for="JQuery">serenityFiltermenu(): JQuery</typedef>
        /// <typedef for="JQuery">serenityFiltermenu(options: any): JQuery</typedef>
        /// <summary>Display a menu for filtering on a field in a data source.</summary>
        /// <version added="2016.1" updated="2016.1" />

        options: {
            /// <option>dataSource</option>
            /// <datatype>serenity.DataSource</datatype>
            /// <default>[]</default>
            /// <typedef>dataSource: serenity.DataSource</typedef>
            /// <summary>Data to be filtered.</summary>
            /// <version added="2016.1" updated="2016.1" />
            dataSource: [],

            /// <option>field</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>field: string</typedef>
            /// <summary>Field to be filtered.</summary>
            /// <version added="2016.1" updated="2016.1" />
            field: null
        },

        events: ["clear", "filter"],

        html: {
            content: "<div class='ui-widget-content sr-filter-input' style='width:200px;height:200px;'>" +
                "<span style='display: block; margin-bottom: 1em;'>Show items where:</span>" +
                "<select class='sr-filter-operator' style='width:175px;'>" +
                    "<option value='eq'>equals</option>" +
                    "<option value='neq'>not equals</option>" +
                    "<option value='contains'>contains</option>" +
                    "<option value='doesnotcontain'>does not contain</option>" +
                    "<option value='startswith'>starts with</option>" +
                    "<option value='endswith'>ends with</option>" +
                    "<option value='empty' data-value='false'>empty</option>" +
                    "<option value='notempty' data-value='false'>not empty</option>" +
                    "<option value='gt'>greater than</option>" +
                    "<option value='lt'>less than</option>" +
                "</select>" +
                "<input class='sr-input sr-filter-value' style='width:165px;margin-top:1.1em;'/>" +
                "<button class='sr-clear-button' style='position:absolute;bottom:10px;left:10px;'>Clear</button>" +
                "<button class='sr-filter-button' style='position:absolute;bottom:10px;right:10px;'>Filter</button>" +
            "</div>"
        },

        _create: function () {
            /// <summary>Constructor for the filtermenu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this._super();

            this.setDataSource(this.options.dataSource);

            this._render();
        },

        _createWidgets: function () {
            /// <summary>Create the widgets on the filtermenu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            this.element.find("button.sr-clear-button").button().data("uiButton").element.on("click", $.proxy(this._onClear, this));

            this.element.find("button.sr-filter-button").button().data("uiButton").element.on("click", $.proxy(this._onFilter, this));

            this.widgets.value = this.element.find("input.sr-filter-value");

            this.widgets.operator = this.element.find("select.sr-filter-operator").selectmenu({
                width: 175
            }).data("uiSelectmenu");
        },

        _onClear: function (event) {
            /// <summary>Validate and apply the filter on the filtermenu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            event.stopPropagation();

            this._dataSource.filter([]);

            this._trigger("clear");
        },

        _onFilter: function (event) {
            /// <summary>Validate and apply the filter on the filtermenu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            event.stopPropagation();

            var field = this.options.field;
            var $option = this.widgets.operator.element.select().find("option:selected");
            var operator = $option.val();
            var valueRequired = $option.attr("data-value") !== "false";
            var value = this.widgets.value.val();

            if (field.length > 0 && operator.length > 0 && (value.length > 0 || valueRequired === false)) {
                this._dataSource.filter({ field: field, operator: operator, value: value });
                this._trigger("filter");
            }
        },

        _render: function () {
            /// <summary>Render the filtermenu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.element.append(this.html.content);

            this._createWidgets();
        },

        load: function (field) {
            /// <function>load</function>
            /// <typedef>load: (field: string) => void</typedef>
            /// <summary>Load information to be displayed about the filter on the field.</summary>
            /// <param name="field" type="String">Field to be filtered.</param>
            /// <version added="2016.1" updated="2016.1" />

            this.options.field = field;

            var filter = Enumerable.From(this._dataSource.options.filter)
                .Where(function (e) { return e.field === field; })
                .FirstOrDefault();

            if (typeof filter !== "undefined") {
                this.widgets.operator.element.val(filter.operator);
                this.widgets.operator.refresh();
                this.widgets.value.val(filter.value);
            }
        }
    });
})(window.jQuery);

(function($) {
	$.widget("serenity.pagerpanel", $.serenity.datawidget, {
		/// <core>serenity.pagerpanel</core>
		/// <inherits url="serenity.widget.html">ui.widget</inherits>
		/// <typedef>interface Pagerpanel extends Widget</typedef>
		/// <typedef for="JQuery">serenityPagerpanel(): JQuery</typedef>
		/// <typedef for="JQuery">serenityPagerpanel(options: any): JQuery</typedef>
		/// <summary>Display a panel for paging a data source.</summary>
		/// <element>div</element>
		/// <version added="2016.1" updated="2016.1" />

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

		html: {
			content: "<div class='ui-widget-content'>" +
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

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/
		
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

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

		_create: function() {
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
			this.element.find("button.sr-pagerpanel-prev").button({
					icons: {
						primary: "fa fa-caret-left"
					}
				})
				.click($.proxy(this._onPrev, this))
				.find(".ui-button-icon")
				.removeClass("ui-button-icon")
				.removeClass("ui-icon");

			// Initialize the "Next" button.
			this.element.find("button.sr-pagerpanel-next").button({
					icons: {
						primary: "fa fa-caret-right"
					}
				})
				.click($.proxy(this._onNext, this))
				.find(".ui-button-icon")
				.removeClass("ui-button-icon")
				.removeClass("ui-icon");

			// Set the dataSource.
			this.setDataSource(this.options.dataSource);
		},

    /***************************************************************************
     *
     * EVENT HANDLERS
     *
     **************************************************************************/

		_onDataSourceChange: function() {
			/// <summary>When a change occurs in the data source, load the widget.</summary>

			this.load();
		},

		_onPageNumberChange: function() {
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

		_onPageSizeChange: function(event, ui) {
			/// <summary>When when the page size changes, set the page size in the datasource.</summary>

			this._dataSource.changePage(1, this.widgets.pageSize.dataItem().size);
		},

		_onPrev: function() {
			/// <summary>Move to the previous page.</summary>

			var page = this.options.dataSource.options.page;

			if (page.current > 1) {
				this.options.dataSource.changePage(page.current - 1);
				this.load();
			}
		},

		_onNext: function() {
			/// <summary>Move to the next page.</summary>

			var page = this.options.dataSource.options.page;

			if (page.current < page.count) {
				this.options.dataSource.changePage(page.current + 1);
				this.load();
			}
		},

		/***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/

		load: function() {
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
					.Select(function(size) {
						return {
							size: size
						};
					})
					.OrderBy("$.size")
					.ToArray();
				this.widgets.pageSize._dataSource.data(pageSizes);
				this.widgets.pageSize.value(page.size);

				// Load the navigation.
				var size = this._dataSource._current.viewCount;
				var start = ((page.current - 1) * page.size);
				var end = start + this._dataSource._current.pageCount;

				this.element.find(".sr-pagerpanel-items").text(this.options.messages.items({
					start: start + 1,
					end: end,
					size: size
				}));
			}
		},

		setDataSource: function(ds) {
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
(function($) {
  "use strict";

  $.widget("serenity.notificationpanel", $.serenity.widget, {
    /// <core>serenity.notificationpanel</core>
    /// <inherits url="serenity.widget.html">serenity.widget</inherits>
    /// <typedef>interface Notificationpanel extends Widget</typedef>
    /// <typedef for="JQuery">serenityNotificationpanel(): JQuery</typedef>
    /// <typedef for="JQuery">serenityNotificationpanel(options: any): JQuery</typedef>
    /// <summary>The notification panel displayed to the user.</summary>
    /// <version added="2016.1" updated="2017.1" />

    _timeout: null,
    _notification: null,
    _direction: null,

    show: function(notification) {
      /// <summary>Show the notification panel.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      this._notification = notification;

      // Determine the direction to use when displaying the notification.
      var direction = notification.options.animation.show === "bottom" ?
        "down" :
        notification.options.animation.show === "top" ?
        "up" :
        notification.options.animation.show;

      // Show the notification.
      that.element.show("slide", {
        direction: direction
      }, function() {
        // When the show is complete, if the hide action is "click", then
        // add a click event handler on the element to hide the notification.

        that._trigger.call(that, "show");

        if (notification.options.hideOnClick) {
          that.element.addClass("sr-hide-on-click");

          that.element.on("click.notificationpanel", function(event) {
            that._trigger.call(that, "click", event);
            clearTimeout(that._timeout);
            that.hide.call(that);
          });
        }
      });

      if (notification.options.duration > 0) {
        this._timeout = setTimeout(function() {
          that.hide.call(that);
        }, notification.options.duration);
      }
    },

    hide: function() {
      /// <summary>Hide the notification panel.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      // If there is a click event for the notification, then remove it.
      that.element.off("click.notificationpanel");

      if (this.element.is(":visible")) {
        var direction = this._notification.options.animation.hide === "bottom" ?
          "down" :
          this._notification.options.animation.hide === "top" ?
          "up" :
          this._notification.options.animation.hide;

        // Hide the element.
        this.element.hide("slide", {
          direction: direction
        }, function() {
          that._trigger.call(that, "hide");

          that.destroy();
        });
      }
    },

    remove: function() {
      /// <summary>Remove the notification panel.</summary>
      /// <version added="2017.1" updated="2017.1" />
      
      // If there as a click event for the notification, then remove it.
      this.element.off("click.notificationpanel");
      
      this._trigger.call(this, "hide");
      
      this.destroy();
    }
  });
})(window.jQuery);
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
(function($, serenity) {
  $.widget("serenity.contextmenu", $.ui.menu, serenity._dataWidgetDef);

  $.widget("serenity.contextmenu", $.serenity.contextmenu, {
    /// <widget>serenity.contextmenu</widget>
    /// <inherits url="https://api.jqueryui.com/menu/">ui.menu</inherits>
    /// <typedef>interface ContextMenu extends JQueryUI.Menu</typedef>
    /// <typedef for="JQuery">serenityContextmenu(): JQuery</typedef>
    /// <typedef for="JQuery">contextmenu(options: any): JQuery</typedef>
    /// <summary>A menu that appears when the right-click mouse operation is performed on a target element.</summary>
    /// <element>ul</element>
    /// <gettingstarted>
    /// <![CDATA[
    /// <div id="target" class="ui-widget-content">
    ///     Right click on me
    /// </div>
    /// <ul id="contextmenu">
    ///     <li><div><span class="ui-icon ui-icon-document"></span>New</div></li>
    ///     <div class="ui-menu-divider ui-widget-content"></div>
    ///     <li><div><span class="ui-icon ui-icon-folder-open"></span>Open</div></li>
    ///     <div class="ui-menu-divider ui-widget-content"></div>
    ///     <li><div>Preview</div></li>
    ///     <li><div><span class="ui-icon ui-icon-disk"></span>Save</div></li>
    ///     <li class="ui-state-disabled"><div><span class="ui-icon ui-icon-trash"></span>Delete</div></li>
    ///     <li><div><span class="ui-icon ui-icon-close"></span>Close</div></li>
    ///     <div class="ui-menu-divider ui-widget-content"></div>
    ///     <li><div><span class="fa fa-info"></span>Properties</div></li>
    /// </ul>
    ///
    /// <script>
    /// $("#contextmenu").serenityContextmenu({
    ///     target: "#target"
    /// });
    /// </script>
    /// ]]>
    /// </gettingstarted>
    /// <version added="2016.1" updated="2016.1" />

    _target: null,
    _current: null,

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      /// <option>dataSource</option>
      /// <datatype>serenity.DataSource</datatype>
      /// <default>null</default>
      /// <typedef>dataSource: serenity.DataSource</typedef>
      /// <summary>Items to be displayed in the contextmenu.</summary>
			/// <example for="JavaScript" description="Initialize the table with employees data.">
			///   $("#table").serenityContextmenu({
			///     dataSource: new serenity.DataSource({
      ///       data: [
			///         { text: "New", icon: "ui-icon-document" },
			///         { divider: true },
			///         { text: "Open", icon: "ui-icon-folder-open" },
			///         { divider: true },
			///         { text: "Preview" },
			///         { text: "Save", icon: "ui-icon-disk" },
			///         { text: "Delete", icon: "ui-icon-trash", disabled: true },
			///         { text: "Close", icon: "ui-icon-close" },
			///         { divider: true }
      ///       ]
			///     })
			///   });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      dataSource: null,

      /// <option>target</option>
      /// <datatype>String</datatype>
      /// <default>null</default>
      /// <typedef>target: string</typedef>
      /// <summary>CSS Selector for the target elements.</summary>
			/// <example for="JavaScript" description="Initialize the contextmenu with the height option specified.">
			///   $("#table").serenityContextmenu({
			///     target: "#target"
			///   });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      target: null,

      /// <option>child</option>
      /// <datatype>String</datatype>
      /// <default>null</default>
      /// <typedef>child: string</typedef>
      /// <summary>CSS Selector to filter the children of the target elements.</summary>
			/// <example for="JavaScript" description="Initialize the contextmenu with the height option specified.">
			///   $("#table").serenityContextmenu({
			///     child: ".children"
			///   });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      child: null
      
      /// <option>show</option>
      /// <ignore>true</ignore>
      
      /// <option>hide</option>
      /// <ignore>true</ignore>
    },

    html: {
      item: Handlebars.compile("<li {{cssClass}}><div>{{text}}</div></li>", {
        noEscape: true
      }),
      itemIcon: Handlebars.compile("<li {{cssClass}}><div><span class='{{icon}}'></span>{{text}}</div></li>", {
        noEscape: true
      }),
      divider: "<div class='ui-menu-divider ui-widget-content'></div>"
    },

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

    _create: function() {
      /// <summary>Constructor for the contextmenu.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      this._super();

      this.element.attr("style", "display:inline-block;position:absolute;");
      this.element.hide();
      this.element.appendTo("body");

      this.target(this.options.target, this.options.child);

      $("body").on("click.contextmenu", function() {
        that.element.hide("blind", null, 200);
      });

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

    _onContextMenu: function(e) {
      /// <summary>Handle the contextmenu event on the target elements.</summary>
      /// <version added="2016.1" updated="2016.1" />

      // this._current = $(e.currentTarget);

      e.preventDefault();
      // this.element.css({ top: e.pageY, left: e.pageX });
      // this.element.show("blind", null, 200);

      this.open($(e.currentTarget), e.pageY, e.pageX);
    },

		/***************************************************************************
     *
     * PUBLIC OVERRIDE METHODS
     *
     **************************************************************************/

    setDataSource: function(ds) {
      /// <function>setDataSource</function>
      /// <summary>Set the data source.</summary>
      /// <param name="ds" type="serenity.DataSource">Contains the items to be displayed in the contextmenu.</param>
			/// <example for="JavaScript" description="Set the DataSource for the table.">
			/// var menuItems = [
			///   { text: "New", icon: "ui-icon-document" },
			///   { divider: true },
			///   { text: "Open", icon: "ui-icon-folder-open" },
			///   { divider: true },
			///   { text: "Preview" },
			///   { text: "Save", icon: "ui-icon-disk" },
			///   { text: "Delete", icon: "ui-icon-trash", disabled: true },
			///   { text: "Close", icon: "ui-icon-close" },
			///   { divider: true }
      /// ];
			/// $(".selector").data("serenityContextmenu").setDataSource(new serenity.DataSource({ data: menuItems }));
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this._super(ds);

      this.refresh();
    },

    open: function(target, top, left) {
      /// <function>open</function>
      /// <summary>Open the context menu.</summary>
			/// <example for="JavaScript" description="Open the context menu.">
			/// $(".selector").data("serenityContextmenu").open();
			/// </example>
      /// <version added="2017.1" updated="2017.1" />

      this._current = target;

      // Trigger the beforeOpen event.
      this._trigger("beforeOpen", null, {
        target: target
      });

      this.element.css({
        top: top,
        left: left
      });
      this.element.show("blind", null, 200);

      return this;
    },

    refresh: function() {
      /// <function>refresh</function>
      /// <summary>Parses the original element and re-renders the menu.</summary>
			/// <example for="JavaScript" description="Re-render the context menu.">
			/// $(".selector").data("serenityContextmenu").refresh();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      if (this._dataSourceValid()) {
        var view = this._dataSource.view();
        var that = this;
        var item = null;

        this.element.empty();

        view.ForEach(function(dataItem, index) {
          if (dataItem.divider === true) {
            item = that.html.divider;
          } else {
            var template = dataItem.icon ? that.html.itemIcon : that.html.item;

            item = $(template({
              text: dataItem.text,
              cssClass: dataItem.disabled ? "class='ui-state-disabled'" : "",
              icon: dataItem.icon
            }));
            if (dataItem.icon && dataItem.icon.substr(0, 8) === "ui-icon-") {
              item.find("span").addClass("ui-icon");
            }
          }

          that.element.append(item);
        });

        try {
          this._super();
        } catch (err) {
          // console.log(err);
        }

        this._trigger("dataBound");
      } else {
        this._super();
      }
    },

    select: function(event) {
      /// <summary>Override the select function to add the "target" to the ui object.</summary>
      /// <version added="2016.1" updated="2016.1" />

      // BEGIN: Copied from menu.js source code.
      this.active = this.active || $(event.target).closest(".ui-menu-item");
      var ui = {
        item: this.active
      };
      if (!this.active.has(".ui-menu").length) {
        this.collapseAll(event, true);
      }
      // END: Copied from menu.js source code.

      // Add the "current" target to the ui object.
      ui.target = this._current;

      // BEGIN: Copied from menu.js source code.
      this._trigger("select", event, ui);
      // END: Copied from menu.js source code.
    },

		/***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/

    target: function(targetSelector, childSelector) {
      /// <function>target</function>
      /// <param name="targetSelector" type="String">CSS Selector for the target elements.</param>
      /// <param name="childSelector" type="String" optional="true">CSS Selector to filter the children of the target elements.</param>
      /// <summary>Set the target for the context menu.</summary>
			/// <example for="JavaScript" description="Select a menu item the context menu.">
			/// $(".selector").data("serenityContextmenu").target("#target", ".children");
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      if (targetSelector) {
        if (this._target != null) {
          this._target.off(".contextmenu");
        }

        this._target = $(targetSelector);

        if (childSelector) {
          this._target.on("contextmenu.contextmenu", childSelector, $.proxy(this._onContextMenu, this));
        } else {
          this._target.on("contextmenu.contextmenu", $.proxy(this._onContextMenu, this));
        }
      }

      return this;
    }
  });
})(window.jQuery, window.serenity);

/// <event>dataBound</event>
/// <summary>Triggered when the menu has been populated from the DataSource.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.contextmenu">Instance of the contextmenu.</param>
/// <example for="JavaScript" description="Initialize the contextmenu with the dataBound callback specified">
/// $(".selector").serenityContextmenu({
///   dataBound: function (event, ui) {
///     console.log("dataBound event raised");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>beforeOpen</event>
/// <summary>Triggered before the context menu is opened.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.contextmenu">Instance of the contextmenu.</param>
/// <param name="ui.target" type="JQuery">The DOM element that the user right-clicked on to open the context menu.</param>
/// <example for="JavaScript" description="Initialize the contextmenu with the beforeOpen callback specified">
/// $(".selector").serenityContextmenu({
///   beforeOpen: function (event, ui) {
///     console.log("beforeOpen event raised");
///   }
/// });
/// </example>
/// <version added="2017.1" updated="2017.1" />

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
(function($, serenity) {
  "use strict";

  $.widget("serenity.timepicker", $.serenity.dropdownlist, {
    /// <widget>serenity.timepicker</widget>
    /// <inherits url="serenity.dropdownlist.html">serenity.dropdownlist</inherits>
    /// <typedef>interface TimePicker extends DropDownList</typedef>
    /// <typedef for="JQuery">serenityTimepicker(): JQuery</typedef>
    /// <typedef for="JQuery">serenityTimepicker(options: any): JQuery</typedef>
    /// <summary>Display a list of times.</summary>
    /// <element>select</element>
    /// <gettingstarted>
    /// <![CDATA[
    /// <select id="timepicker"></select>
    ///
    /// <script>
    ///   $("#timepicker").serenityTimepicker();
    /// </script>
    /// ]]>
    /// </gettingstarted>
    /// <version added="2016.1" updated="2016.1" />

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

    _modeFormat: {
      "12": "{0:hh}:{0:mm} {0:tt}",
      "24": "{0:t}"
    },

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      /// <option>min</option>
      /// <datatype>String|Date</datatype>
      /// <default>"12:00 AM"</default>
      /// <typedef>min: any</typedef>
      /// <summary>Minimum time to display.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the min option specified">
			/// $(".selector").serenityTimepicker({
      ///   interval: "9:00 AM"
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      min: "12:00 AM",

      /// <option>max</option>
      /// <datatype>String|Date</datatype>
      /// <default>"11:30 PM"</default>
      /// <typedef>max: any</typedef>
      /// <summary>Maximum time to display.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the max option specified">
			/// $(".selector").serenityTimepicker({
      ///   interval: "5:00 PM"
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      max: "11:30 PM",

      /// <option>interval</option>
      /// <datatype>Number</datatype>
      /// <default>30</default>
      /// <typedef>interval: number</typedef>
      /// <summary>Number of minutes between each time displayed.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the interval option specified">
			/// $(".selector").serenityTimepicker({
      ///   interval: 60
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      interval: 30,

      /// <option>mode</option>
      /// <datatype>String</datatype>
      /// <default>"12"</default>
      /// <typedef>mode: string</typedef>
      /// <summary>Display the time in 12 or 24 hour clock.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the mode option specified">
			/// $(".selector").serenityTimepicker({
      ///   mode: "24"
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      mode: "12",

      /// <option>date</option>
      /// <datatype>Date</datatype>
      /// <default>null</default>
      /// <typedef>date: Date</typedef>
      /// <summary>Date containing the time to select when the widget is rendered.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the date option specified">
			/// $(".selector").serenityTimepicker({
      ///   date: new Date(new Date().setHours(13, 0, 0))
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      date: null,

      /// <option>text</option>
      /// <datatype>String</datatype>
      /// <default>null</default>
      /// <typedef>text: string</typedef>
      /// <summary>The time to select when the widget is rendered.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the text option specified">
			/// $(".selector").serenityTimepicker({
      ///   text: "09:00 AM"
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      text: null,

      /// <option>height</option>
      /// <datatype>Number</datatype>
      /// <default>250</default>
      /// <typedef>height: number</typedef>
      /// <summary>Height of the dropdown list.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the height option specified">
			/// $(".selector").serenityTimepicker({
      ///   height: 300
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      height: 250,

      /// <option>width</option>
      /// <datatype>Number</datatype>
      /// <default>150</default>
      /// <typedef>width: number</typedef>
      /// <summary>Width of the widget.</summary>
			/// <example for="JavaScript" description="Initialize the timepicker with the width option specified">
			/// $(".selector").serenityTimepicker({
      ///   width: 200
			/// });
			/// </example>
      /// <version added="2016.1" updated="2016.1" />
      width: 150,

      /// <option>valueField</option>
      /// <summary>The time to select when the widget is rendered.</summary>
      /// <version added="2016.1" updated="2016.1" />
      /// <ignore>true</ignore>
      valueField: "value",

      /// <option>textField</option>
      /// <summary>The time to select when the widget is rendered.</summary>
      /// <version added="2016.1" updated="2016.1" />
      /// <ignore>true</ignore>
      textField: "text"
      
      /// <option>dataSource</option>
      /// <ignore>true</ignore>
      
      /// <option>itemTemplate</option>
      /// <ignore>true</ignore>
      
      /// <option>textTemplate</option>
      /// <ignore>true</ignore>
    },

    setDataSource: function() {
			/// <function>setDataSource</function>
      /// <summary>Set the data source.</summary>
      /// <version added="2016.1" updated="2016.1" />
      /// <ignore>true</ignore>

      var that = this;

      var list = Enumerable.From(serenity.time.list(this.options.min, this.options.max, this.options.interval, this.options.mode))
        .Select(function(item) {
          return {
            value: item,
            text: that.options.mode == "12" ? item.replace("00:", "12:") : item
          };
        }).ToArray()

      var ds = new serenity.DataSource({
        data: list
      });

      if (this.options.date !== null) {
        var text = serenity.format(this._modeFormat[this.options.mode], this.options.date);
        text = this.options.mode === "12" ? text.replace("00:", "12:") : text;
        this.options.text = text;
      }

      this._super(ds);
    }
    
    /// <function>dataSource</function>
    /// <summary>Get the data source.</summary>
    /// <version added="2016.1" updated="2016.1" />
    /// <ignore>true</ignore>
  });
})(window.jQuery, window.serenity);


/*
 * Events
 */

/// <event>dataBound</event>
/// <ignore>true</ignore>

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

(function($, serenity) {
  "use strict";

  $.widget("serenity.panel", $.serenity.widget, {
    /// <widget>serenity.panel</widget>
    /// <inherits url="serenity.widget.html">serenity.widget</inherits>
    /// <typedef>interface Panel extends Widget</typedef>
    /// <typedef for="JQuery">serenityPanel(): JQuery</typedef>
    /// <typedef for="JQuery">serenityPanel(options: any): JQuery</typedef>
    /// <summary>The panel widget displays a heading and content that is collapsible.</summary>
    /// <element>div</element>
    /// <gettingstarted>
    /// <![CDATA[
    /// <div id="panel" style="width:250px;">
    ///     <div>Sample Panel</div>
    ///     <div>
    ///         Here is some content.
    ///     </div>
    /// </div>
    ///
    /// <script>
    ///   $("#panel").serenityPanel();
    /// </script>
    /// ]]>
    /// </gettingstarted>
    /// <version added="2016.1" updated="2016.1" />

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

    html: {
      heading: "<div class='sr-panel-heading ui-accordion-header ui-accordion-header-active ui-state-default ui-corner-top'></div>",
      title: "<div class='sr-panel-title'></div>",
      expander: "<span class='sr-panel-expander'></span>",
      body: "<div class='sr-panel-body ui-widget-content ui-corner-bottom'></div>"
    },

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      /// <option>collapsible</option>
      /// <datatype>Boolean</datatype>
      /// <default>false</default>
      /// <typedef>collapsible: boolean</typedef>
      /// <summary>Flag indicating whether the panel is collapsible.</summary>
      /// <example for="JavaScript" description="Initialize the panel with the collapsible option specified">
      /// $(".selector").serenityPanel({
      ///   collapsible: true
      /// });
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      collapsible: false,

      /// <option>collapsed</option>
      /// <datatype>Boolean</datatype>
      /// <default>false</default>
      /// <typedef>collapsed: boolean</typedef>
      /// <summary>Flag indicating whether the panel is initially collapsed. (collapsible must be set to true for this to apply)</summary>
      /// <example for="JavaScript" description="Initialize the panel with the collapsed option specified">
      /// $(".selector").serenityPanel({
      ///   collapsed: true
      /// });
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      collapsed: false,

      /// <option>title</option>
      /// <datatype>String</datatype>
      /// <default>""</default>
      /// <typedef>title: string</typedef>
      /// <summary>Text displayed in the panel title.</summary>
      /// <example for="JavaScript" description="Initialize the panel with the title option specified">
      /// $(".selector").serenityPanel({
      ///   title: "Panel Title"
      /// });
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      title: "",

      /// <option>body</option>
      /// <datatype>String</datatype>
      /// <default>""</default>
      /// <typedef>body: string</typedef>
      /// <summary>HTML to be displayed as the body content.</summary>
      /// <example for="JavaScript" description="Initialize the panel with the body option specified">
      /// <![CDATA[
      /// $(".selector").serenityPanel({
      ///   body: "<span>Panel Contents</span>"
      /// });
      /// ]]>
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      body: "",

      expander: {
        /// <option>expander.collapse</option>
        /// <datatype>String</datatype>
        /// <default>"fa fa-minus-circle"</default>
        /// <summary>CSS Class for the icon that is displayed to collapse the panel.</summary>
        /// <example for="JavaScript" description="Initialize the panel with the expander.collapse option specified">
        /// $(".selector").serenityPanel({
        ///   expander: { collapse: "fa fa-minus-square" }
        /// });
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        collapse: "fa fa-minus-circle",

        /// <option>expander.expand</option>
        /// <datatype>String</datatype>
        /// <default>"fa fa-plus-circle"</default>
        /// <summary>CSS Class for the icon that is displayed to expand the panel.</summary>
        /// <example for="JavaScript" description="Initialize the panel with the expander.expand option specified">
        /// $(".selector").serenityPanel({
        ///   expander: { expand: "fa fa-plus-square" }
        /// });
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        expand: "fa fa-plus-circle"
      },

      /// <option>width</option>
      /// <datatype>String</datatype>
      /// <default>"100%"</default>
      /// <typedef>width: string</typedef>
      /// <summary>Width of the panel.</summary>
      /// <example for="JavaScript" description="Initialize the panel with the width option specified">
      /// $(".selector").serenityPanel({
      ///   width: 500px"
      /// });
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      width: "100%"
    },

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

    _create: function() {
      /// <summary>Constructor for the panel.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this._super();

      this.render();
    },
		
    /***************************************************************************
     *
     * PUBLIC OVERRIDE METHODS
     *
     **************************************************************************/

    render: function() {
      /// <summary>Render the panel.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      this.element.addClass("ui-widget ui-accordion");

      this.element.css("width", this.options.width);

      var divs = this.element.children("div");

      // Add the div that will contain the heading div.
      this.element.prepend(this.html.heading);
      this.widgets.heading = this.element.find(".sr-panel-heading");

      // Were there any div elements defined?
      if (divs.length === 0) {
        // Add the title div element to the heading div.
        this.widgets.heading.append(this.html.title);
        // Set the title.
        this.title(this.options.title);
        // Add the body div.
        this.element.append(this.html.body);
        this.widgets.body = this.element.find(".sr-panel-body");
        // Set the body.
        this.body(this.options.body);
      } else if (divs.length === 2) {
        $(divs[0]).addClass("sr-panel-title").appendTo(this.widgets.heading);
        this.widgets.body = $(divs[1]);
        this.widgets.body.addClass("sr-panel-body ui-widget-content ui-corner-bottom");
      }

      this.widgets.body = this.element.find(".sr-panel-body");

      this.collapsible(this.options.collapsible);

      if (this.options.collapsible && this.options.collapsed) {
        this.toggle(false);
      }

      this.element.on("click.sr-panel", ".sr-panel-heading.sr-panel-collapsible", function() {
        that.toggle.call(that);
      });
    },
		
    /***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/

    toggle: function(expand) {
      /// <function>toggle</function>
      /// <param name="expand" type="Boolean" optional="true">True to expand, false to collapse, or omit to toggle.</param>
      /// <summary>Toggle the visibility of the panel contents.</summary>
			/// <example for="JavaScript" description="Toggle the visibility of the panel contents.">
			/// $(".selector").data("serenityPanel").toggle();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var visible = this.widgets.body.is(":visible");

      if (arguments.length === 0 ||
        (
          // Expand when panel not visible.
          (expand && !visible) ||
          // Collapse when visible.
          (!expand && visible)
        )
      ) {
        if (visible) {
          // Collapse the panel.
          this.widgets.expander.removeClass(this.options.expander.collapse).addClass(this.options.expander.expand);
          this.widgets.heading.addClass("ui-corner-bottom");
          this.widgets.body.hide();
          this._trigger("close");
        } else {
          // Expand the panel.
          this.widgets.expander.removeClass(this.options.expander.expand).addClass(this.options.expander.collapse);
          this.widgets.heading.removeClass("ui-corner-bottom");
          this.widgets.body.show();
          this._trigger("open");
        }
      }

      return this;
    },

    title: function(text) {
      /// <function>title</function>
      /// <param name="text" type="String">The title to be displayed.</param>
      /// <summary>Set the title for the panel.</summary>
			/// <example for="JavaScript" description="Set the panel title.">
			/// $(".selector").data("serenityPanel").title("Panel Title");
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this.widgets.heading.find(".sr-panel-title").text(text);

      return this;
    },

    body: function(content) {
      /// <function>body</function>
      /// <param name="content" type="String">The content to be displayed.</param>
      /// <typedef>content: (text: string) => this</typedef>
      /// <summary>Set the content for the panel body.</summary>
			/// <example for="JavaScript" description="Set the panel contents.">
      /// <![CDATA[
			/// $(".selector").data("serenityPanel").body("<span>Panel Contents</span>");
      /// ]]>
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this.widgets.body.html(content);
    },

    collapsible: function(value) {
      /// <function>collapsible</function>
      /// <summary>Enable the panel body to be collapsible.</summary>
			/// <example for="JavaScript" description="Set the panel to be collapsible.">
			/// $(".selector").data("serenityPanel").collapsible(true);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this.widgets.heading.find(".sr-panel-expander").remove();

      if (value === true || value === "left") {
        this.widgets.heading.prepend(this.html.expander);
        this.widgets.expander = this.widgets.heading.find(".sr-panel-expander");
        this.widgets.expander.addClass("sr-panel-expander-left");
        this.widgets.expander.addClass(this.options.expander.collapse);
        this.widgets.heading.addClass("sr-panel-collapsible");
      } else if (value === "right") {
        this.widgets.heading.append(this.html.expander);
        this.widgets.expander = this.widgets.heading.find(".sr-panel-expander");
        this.widgets.expander.addClass("sr-panel-expander-right");
        this.widgets.expander.addClass(this.options.expander.collapse);
        this.widgets.heading.addClass("sr-panel-collapsible");
      }
    }
  });
})(window.jQuery, window.serenity);


/// <event>open</event>
/// <summary>Triggered when the panel is opened.</summary>
/// <example for="JavaScript" description="Initialize the panel with the open callback specified">
/// $(".selector").serenityPanel({
///   open: function (event, ui) {
///     console.log("open event triggered");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>close</event>
/// <summary>Triggered when the panel is closed.</summary>
/// <example for="JavaScript" description="Initialize the panel with the close callback specified">
/// $(".selector").serenityPanel({
///   close: function (event, ui) {
///     console.log("close event triggered");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />
(function($) {
  "use strict";

  $.widget("serenity.notification", $.serenity.widget, {
    /// <widget>serenity.notification</widget>
    /// <inherits url="serenity.widget.html">serenity.widget</inherits>
    /// <typedef>interface Notification extends Widget</typedef>
    /// <typedef for="JQuery">serenityNotification(): JQuery</typedef>
    /// <typedef for="JQuery">serenityNotification(options: any): JQuery</typedef>
    /// <summary>The notification widget displays an unobstrusive notification to the user.</summary>
    /// <element>div</element>
    /// <gettingstarted>
    /// <![CDATA[
    /// <div id="notification">
    ///   <div>
    ///     Hello from Serenity UI!
    ///   </div>
    /// </div>
    ///
    /// <script>
    ///   var notification = $("#notification").serenityNotification().data("serenityNotification");
    ///   notification.show();
    /// </script>
    /// ]]>
    /// </gettingstarted>
    /// <version added="2016.1" updated="2016.1" />

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

    _container: null,

    html: {
      container: "<div class='sr-notification-container'></div>",
      instance: "<div class='ui-widget ui-widget-content sr-notification-instance' style='display:none;'></div>",
      instanceContainer: "<div class='sr-notification-instance-container'></div>"
    },

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      position: {
        /// <option>position.top</option>
        /// <datatype>Number</datatype>
        /// <default>null</default>
        /// <summary>
        /// The number of pixels from the top of the document to display notifications.
        /// If null, then the notification will appear at the bottom of the document.
        /// </summary>
        /// <example for="JavaScript" description="Initialize the notification with the position.top option specified">
        /// $(".selector").serenityNotification({
        ///  position: {
        ///    top: 10
        ///  }
        /// });
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        top: null,

        /// <option>position.left</option>
        /// <datatype>Number</datatype>
        /// <default>null</default>
        /// <summary>
        /// The number of pixels from the left of the document to display notifications.
        /// If null, then the notification will appear at the right of the document.
        /// </summary>
        /// <example for="JavaScript" description="Initialize the notification with the position.left option specified">
        /// $(".selector").serenityNotification({
        ///  position: {
        ///    left: 10
        ///  }
        /// });
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        left: null,

        /// <option>position.bottom</option>
        /// <datatype>Number</datatype>
        /// <default>20</default>
        /// <summary>
        /// The number of pixels from the bottom of the document to display notifications.
        /// </summary>
        /// <example for="JavaScript" description="Initialize the notification with the position.bottom option specified">
        /// $(".selector").serenityNotification({
        ///  position: {
        ///    bottom: 10
        ///  }
        /// });
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        bottom: 20,

        /// <option>position.right</option>
        /// <datatype>Number</datatype>
        /// <default>20</default>
        /// <summary>
        /// The number of pixels from the right of the document to display notifications.
        /// </summary>
        /// <example for="JavaScript" description="Initialize the notification with the position.right option specified">
        /// $(".selector").serenityNotification({
        ///  position: {
        ///    right: 10
        ///  }
        /// });
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        right: 20
      },

      animation: {
        /// <option>animation.show</option>
        /// <datatype>String</datatype>
        /// <default>"bottom"</default>
        /// <summary>The part of the notification element that is displayed first when showing the notification.</summary>
        /// <example for="JavaScript" description="Initialize the notification with the animation.show option specified">
        /// $(".selector").serenityNotification({
        ///  animation: {
        ///    show: "top"
        ///  }
        /// });
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        show: "bottom",

        /// <option>animation.hide</option>
        /// <datatype>String</datatype>
        /// <default>"top"</default>
        /// <summary>The part of the notification element that is hidden last when hiding the notification.</summary>
        /// <example for="JavaScript" description="Initialize the notification with the animation.hide option specified">
        /// $(".selector").serenityNotification({
        ///  animation: {
        ///    hide: "top"
        ///  }
        /// });
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        hide: "bottom"
      },

      /// <option>cssClass</option>
      /// <datatype>String</datatype>
      /// <default>""</default>
      /// <summary>CSS Classes for the notification element.</summary>
      /// <example for="JavaScript" description="Initialize the notification with the cssClass option specified">
      /// $(".selector").serenityNotification({
      ///  cssClass: "ui-state-active"
      /// });
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      cssClass: "",

      /// <option>hideOnClick</option>
      /// <datatype>Boolean</datatype>
      /// <default>true</default>
      /// <summary>Hide the notification when the user clicks anywhere in the window.</summary>
      /// <example for="JavaScript" description="Initialize the notification with the hideOnClick option specified">
      /// $(".selector").serenityNotification({
      ///  hideOnClick: false
      /// });
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      hideOnClick: true,

      /// <option>duration</option>
      /// <datatype>Number</datatype>
      /// <default>3000</default>
      /// <summary>The number of miliseconds that the notification is displayed.  Set to 0 to disable auto hide.</summary>
      /// <example for="JavaScript" description="Initialize the notification with the duration option specified">
      /// $(".selector").serenityNotification({
      ///  duration: 0
      /// });
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      duration: 3000,

      /// <option>width</option>
      /// <datatype>Number</datatype>
      /// <default>200</default>
      /// <summary>The width of the notification element.</summary>
      /// <example for="JavaScript" description="Initialize the notification with the width option specified">
      /// $(".selector").serenityNotification({
      ///  width: 300
      /// });
      /// </example>
      /// <version added="2016.1" updated="2016.1" />
      width: 200
      
      /// <option>classes</option>
      /// <ignore>true</ignore>
      
      /// <option>disabled</option>
      /// <ignore>true</ignore>
      
      /// <option>hide</option>
      /// <ignore>true</ignore>
      
      /// <option>show</option>
      /// <ignore>true</ignore>
    },

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

    _create: function() {
      /// <summary>Constructor for the notification.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this._super();

      this.render();
    },
		
    /***************************************************************************
     *
     * PUBLIC OVERRIDE METHODS
     *
     **************************************************************************/

    render: function() {
      /// <function>render</function>
      /// <summary>Render the notification.</summary>
			/// <example for="JavaScript" description="Render the notification.">
			/// $(".selector").data("serenityNotification").render();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this.element.hide();

      this.widgets.container = $(this.html.container);
      this.widgets.container.appendTo("body");

      this.widgets.panels = {};

      this._trigger("render");

      return this;
    },
		
    /***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/
		
    show: function(e) {
      /// <function>show</function>
      /// <summary>Show the notification.</summary>
			/// <param name="e" type="JQuery|String">
			/// CSS String selector or JQuery object identifying the DOM element that contains the contents for the notification.
			/// </param>
			/// <example for="JavaScript" description="Show a notification.">
			/// $(".selector").data("serenityNotification").show();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var css = {};
      var that = this;
      var $window = $(window);
      var $el = $(this.element.children()[0]);
			var showNotification = true;

      if (arguments.length > 0) {
				if (typeof e === "boolean") {
					showNotification = e;
				} else {
					$el = e instanceof jQuery ?
						e :
						(typeof e === "string" ?
							$(e) :
							$el);
				}
      }

			if (showNotification) {
				// Create the notification panel element and add it to the container.
				var $panel = $(this.html.instance);
				$panel.append($el.html().trim());
				$panel.css("width", this.options.width + "px").addClass(this.options.cssClass);

				// Create a panel container and add the panel to it.
				var $panelContainer = $(this.html.instanceContainer);
				$panelContainer.append($panel);

				// Append / prepend the panel container to the notification container.
				if (this.options.position.bottom !== null) {
					$panelContainer.prependTo(this.widgets.container);
				} else {
					$panelContainer.appendTo(this.widgets.container);
				}

				// Set the height of the panel container.
				$panelContainer.css("height", $panel.outerHeight() + "px");

				// Create the notification panel and show it.
				var panel = $panel.serenityNotificationpanel({
					show: function(event, ui) {

						that._trigger("show", null, {
							panel: ui.sender
						});
					},
					hide: function(event, ui) {

						that._trigger("hide", null, {
							panel: ui.sender
						});

						// Remove the panel from the container and destroy it. 
						ui.sender.element.remove();
						ui.sender.destroy();

						// Remove the panel from the dictionary of panels.
						delete that.widgets.panels[ui.sender.uuid];

						// If that was the last of the panels, then empty the container.
						if (that.widgets.container.find("div.sr-notification-instance").length === 0) {
							that.widgets.container.empty();

							that._trigger("hide", null, {
								panel: ui.sender
							});
						}
					},
					click: function(event, ui) {

						that._trigger("click", event, {
							panel: ui.sender
						});
					}
				}).data("serenityNotificationpanel");

				// Add the panel to the dictionary of panels.
				this.widgets.panels[panel.uuid] = panel;

				// Position the notification container horizontally.
				if (this.options.position.right !== null) {
					// If the notification is on the right, then calculate distance from the left as:
					// ((window width) plus[+] (how much the horizontal scrollbar has been scrolled))
					//  minus[-] (the width of the container element)
					//  minus[-] (how far from the right edge of the window that the notification should appear).  
					css.left = (($window.width() + $window.scrollLeft()) - 0 -
						$panel.outerWidth() -
						// this.widgets.container.outerWidth() - 
						this.options.position.right) + "px";
				} else if (this.options.position.left !== null) {
					// If the notification is on the left, then calculate distance from the left as:
					// (how much the horizontal scrollbar has been scrolled)
					//  plus[+] (how far from the left edge of the window that the notification should appear).  
					css.left = $window.scrollLeft() + this.options.position.left + "px";
				}

				// Position the notification container vertically.
				if (this.options.position.bottom !== null) {
					// If the notification is on the bottom, then calculate distance from the top as:
					// ((window height) plus[+] (how much the vertical scrollbar has been scrolled))
					//  minus[-] (the height of the container element)
					// X  minus[-] (the height of the panel element)
					//  minus[-] (how far from the bottom edge of the window that the notification should appear).  
					css.top = (($window.height() + $window.scrollTop()) - 0 -
						this.widgets.container.outerHeight()
						// - $panel.outerHeight() 
						-
						this.options.position.bottom) + "px";
				} else if (this.options.position.top !== null) {
					// If the notification is on the top, then calculate distance from the top as:
					// (how much the vertical scrollbar has been scrolled)
					//  plus[+] (how far from the top edge of the window that the notification should appear).  
					css.top = $window.scrollTop() + this.options.position.top + "px";
				}

				this.widgets.container.css("width", this.options.width + "px").css(css);

				panel.show(this);

				// Return the notification panel.
				return panel;
			}
    },

    hide: function(uuid) {
      /// <function>hide</function>
      /// <param name="uuid" type="string">The UUID of the panel to hide.</param>
      /// <summary>Hide a notification instance.</summary>
			/// <example for="JavaScript" description="Hide a notification.">
      /// var panel = $(".selector").data("serenityNotification").show();
      /// setTimeout(function () {
      ///   $(".selector").data("serenityNotification").hide(panel.uuid); 
      /// }, 500);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      if (typeof uuid === "undefined") {
        this.hideAll();
      } else {
        var panel = this.widgets.panels[uuid];

        if (typeof panel !== "undefined") {
          panel.hide();
        }
      }

      return this;
    },

    hideAll: function() {
      /// <function>hideAll</function>
      /// <summary>Hide all notification instances.</summary>
			/// <example for="JavaScript" description="Hide all the notifications.">
			/// $(".selector").data("serenityNotification").hideAll();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      for (var uuid in this.widgets.panels) {
        var panel = this.widgets.panels[uuid];
        panel.hide();
      }

      return this;
    },

    remove: function(uuid) {
      /// <function>remove</function>
      /// <summary>Remove one or all notification instances.</summary>
			/// <example for="JavaScript" description="Remove a notification.">
      /// var panel = $(".selector").data("serenityNotification").show();
      /// setTimeout(function () {
      ///   $(".selector").data("serenityNotification").remove(panel.uuid); 
      /// }, 500);
			/// </example>
      /// <version added="2017.1" updated="2017.1" />

      if (typeof uuid === "undefined") {
        this.removeAll();
      } else {
        var panel = this.widgets.panels[uuid];

        if (typeof panel !== "undefined") {
          panel.remove();
        }
      }

      return this;
    },

    removeAll: function() {
      /// <function>removeAll</function>
      /// <summary>Removal all notification instances.</summary>
			/// <example for="JavaScript" description="Hide all the notifications.">
			/// $(".selector").data("serenityNotification").removeAll();
			/// </example>
      /// <version added="2017.1" updated="2017.1" />

      for (var uuid in this.widgets.panels) {
        var panel = this.widgets.panels[uuid];
        panel.remove();
      }

      return this;
    }
    
    /// <function>disable</function>
    /// <ignore>true</ignore>
    
    /// <function>enable</function>
    /// <ignore>true</ignore>
  });
})(window.jQuery);

/// <event>render</event>
/// <summary>Triggered when the notification is rendered.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.notification">Instance of the notification.</param>
/// <example for="JavaScript" description="Initialize the notification with the render callback specified">
/// $(".selector").serenityNotification({
///   render: function (event, ui) {
///     console.log("render event triggered");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>show</event>
/// <summary>Triggered when a notification instance is shown.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.notification">Instance of the notification.</param>
/// <example for="JavaScript" description="Initialize the notification with the show callback specified">
/// $(".selector").serenityNotification({
///   show: function (event, ui) {
///     console.log("show event triggered");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>hide</event>
/// <summary>Triggered when a notification instance is hidden.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.notification">Instance of the notification.</param>
/// <example for="JavaScript" description="Initialize the notification with the hide callback specified">
/// $(".selector").serenityNotification({
///   hide: function (event, ui) {
///     console.log("hide event triggered");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>click</event>
/// <summary>Triggered when the hideOnClick option is true and a notification instance is clicked.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.notification">Instance of the notification.</param>
/// <example for="JavaScript" description="Initialize the notification with the click callback specified">
/// $(".selector").serenityNotification({
///   click: function (event, ui) {
///     console.log("click event triggered");
///   }
/// });
/// </example>
/// <version added="2016.1" updated="2016.1" />

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

(function($, serenity) {
  "use strict";

  $.widget("serenity.tree", $.serenity.datawidget, {
    /// <widget>serenity.tree</widget>
    /// <inherits url="serenity.datawidget.html">serenity.datawidget</inherits>
    /// <element>div</element>
    /// <gettingstarted>
    /// <![CDATA[
    /// <div id="tree"></div>
    ///
    /// <script>
    ///    var items = [
    ///        { id: 1, parent: null, text: "My Application", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o", expanded: true },
    ///        { id: 2, parent: 1, text: "css", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 7, parent: 2, text: "index.css", expanded: false, type: "file", imageCss: "fa fa-file-code-o" },
    ///        { id: 3, parent: 1, text: "images", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 8, parent: 3, text: "logo.png", expanded: false, type: "file", imageCss: "fa fa-file-image-o" },
    ///        { id: 9, parent: 3, text: "background.jpg", expanded: false, type: "file", imageCss: "fa fa-file-image-o" },
    ///        { id: 4, parent: 1, text: "js", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 10, parent: 4, text: "app.js", expanded: false, type: "file", imageCss: "fa fa-file-code-o" },
    ///        { id: 11, parent: 4, text: "index.js", expanded: false, type: "file", imageCss: "fa fa-file-code-o" },
    ///        { id: 5, parent: 1, text: "libs", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 12, parent: 5, text: "serenityui", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 13, parent: 12, text: "css", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 15, parent: 13, text: "fonts", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 16, parent: 13, text: "themes", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 14, parent: 12, text: "js", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" },
    ///        { id: 6, parent: 1, text: "index.html", expanded: false, type: "file", imageCss: "fa fa-file-code-o" }
    ///    ];
    /// 
    ///   var tree = $("#tree").serenityTree({
    ///     dataSource: new serenity.DataSource({
    ///         data: items
    ///     })
    /// }).data("serenityTree");
    /// </script>
    /// ]]>
    /// </gettingstarted>
    /// <version added="2016.1" updated="2017.1" />

    /***************************************************************************
     *
     * PRIVATE MEMBER VARIABLES
     *
     **************************************************************************/

    _mode: null,

    html: {
      root: "<ul class='sr-tree-root'></ul>",
      node: Handlebars.compile("<li class='sr-tree-node sr-tree-{{expanded}}' data-uuid='{{uuid}}'><i class='sr-tree-node-arrow {{arrow}}' aria-hidden='true'></i><div class='sr-tree-node-text'><div>{{text}}</div></div></li>", {
        noEscape: true
      }),
      imageCss: "<i class='sr-icon sr-node-icon {{imageCss}}'></i>",
      imageUrl: "",
      children: "<ul class='sr-tree-children'></li>"
    },

    /***************************************************************************
     *
     * OPTIONS
     *
     **************************************************************************/

    options: {
      /// <option>itemFields</option>
      /// <datatype>JSON Object</datatype>
      /// <typedef>eventFields: any</typedef>
      /// <summary>The fields for each item in the dataSource used to display a node.</summary>
      /// <version added="2016.1" updated="2016.1" />
      itemFields: {
        /// <option>itemFields.id</option>
        /// <datatype>String</datatype>
        /// <default>"id"</default>
        /// <summary>The field for each item in the dataSource that is the unique identifier for the node.</summary>
        /// <example for="JavaScript" description="Initialize the tree with the itemFields.id option specified">
        /// <![CDATA[
        /// $(".selector").serenityTree({
        ///   itemFields: {
        ///     id: "nodeId"
        ///   }
        /// });
        /// ]]>
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        id: "id",

        /// <option>itemFields.parent</option>
        /// <datatype>String</datatype>
        /// <default>"parent"</default>
        /// <summary>The field for each item in the dataSource that contains the parent id of the node.  This is required when using a serenity.DataSource</summary>
        /// <example for="JavaScript" description="Initialize the tree with the itemFields.parentId option specified">
        /// <![CDATA[
        /// $(".selector").serenityTree({
        ///   itemFields: {
        ///     id: "parentId"
        ///   }
        /// });
        /// ]]>
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        parent: "parent",

        /// <option>itemFields.text</option>
        /// <datatype>String</datatype>
        /// <default>"text"</default>
        /// <summary>The field for each item in the dataSource that contains the text to be displayed for the node.</summary>
        /// <example for="JavaScript" description="Initialize the tree with the itemFields.text option specified">
        /// <![CDATA[
        /// $(".selector").serenityTree({
        ///   itemFields: {
        ///     text: "nodeText"
        ///   }
        /// });
        /// ]]>
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        text: "text",

        /// <option>itemFields.hasChildren</option>
        /// <datatype>String</datatype>
        /// <default>"hasChildren"</default>
        /// <summary>Flag used in lazy loading to indicate whether the node has child nodes.  If not defined, then it is assumed that there are children.</summary>
        /// <example for="JavaScript" description="Initialize the tree with the itemFields.hasChildren option specified">
        /// <![CDATA[
        /// $(".selector").serenityTree({
        ///   itemFields: {
        ///     hasChildren: "isParentNode"
        ///   }
        /// });
        /// ]]>
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        hasChildren: "hasChildren",

        /// <option>itemFields.expanded</option>
        /// <datatype>Boolean</datatype>
        /// <default>"expanded"</default>
        /// <summary>Flag indicating whether the tree node should default to expanded.</summary>
        /// <example for="JavaScript" description="Initialize the tree with the itemFields.expanded option specified">
        /// <![CDATA[
        /// $(".selector").serenityTree({
        ///   itemFields: {
        ///     expanded: "showChildren"
        ///   }
        /// });
        /// ]]>
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        expanded: "expanded",

        /// <option>itemFields.imageCss</option>
        /// <datatype>String</datatype>
        /// <default>"imageCss"</default>
        /// <summary>CSS Class for the node image.</summary>
        /// <example for="JavaScript" description="Initialize the tree with the itemFields.imageCss option specified">
        /// <![CDATA[
        /// $(".selector").serenityTree({
        ///   itemFields: {
        ///     imageCss: "image"
        ///   }
        /// });
        /// ]]>
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        imageCss: "imageCss",

        /// <option>itemFields.imageCssExpand</option>
        /// <datatype>String</datatype>
        /// <default>"imageCssExpand"</default>
        /// <summary>CSS Class for the node image when expanded.</summary>
        /// <example for="JavaScript" description="Initialize the tree with the itemFields.imageCssExpand option specified">
        /// <![CDATA[
        /// $(".selector").serenityTree({
        ///   itemFields: {
        ///     imageCssExpand: "expandImage"
        ///   }
        /// });
        /// ]]>
        /// </example>
        /// <version added="2016.1" updated="2016.1" />
        imageCssExpand: "imageCssExpand"
      },

      /// <option>textTemplate</option>
      /// <datatype>String|Function|Handlebars Template</datatype>
      /// <default>null</default>
      /// <summary>Template used to display the text for the node.</summary>
        /// <example for="JavaScript" description="Initialize the tree with the textTemplate option specified">
        /// <![CDATA[
        /// $(".selector").serenityTree({
        ///   textTemplate: textTemplate: function (item) {
        ///     return item.type === "folder"
        ///       ? item.text
        ///       : serenity.format("{0} <span style='color:blue;'>({1})</span>", item.text, item.count);
        ///   }
        /// });
        /// ]]>
        /// </example>
      /// <version added="2016.1" updated="2016.1" />
      textTemplate: null
    },

    /***************************************************************************
     *
     * INITIALIZATION
     *
     **************************************************************************/

    _create: function() {
      /// <summary>Constructor for the tree.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this._super();

      this.element.addClass("ui-widget ui-widget-content");
      this.element.append(this.html.root);
      this.widgets.root = this.element.find(".sr-tree-root");

      this.setDataSource(this.options.dataSource);

      this._createEvents();
    },

    /***************************************************************************
     *
     * EVENT HANDLERS
     *
     **************************************************************************/

    _onDataSourceChange: function(e) {
      /// <summary>Override to handle a change in the data source.</summary>
      /// <version added="2016.1" updated="2016.1" />

      if (e.action === "add") {
        var itemFields = this.options.itemFields;
        var parentItem = this.dataSource().get(function(item) {
          return item[itemFields.id] === e.item[itemFields.parent];
        });
        var parentNode = this.itemNode(parentItem);
        var childrenContainer = parentNode.children(".sr-tree-children");
        childrenContainer.children(".sr-tree-node-loading").remove();
        var node = this._addNodeElement(childrenContainer, e.item);
        node.append(this.html.children);
      } else if (e.action === "remove") {
        this.itemNode(e.item).remove();
      }
    },

    _onClickNodeArrow: function(e) {
      /// <summary>Handle click on the node arrow element to expand / collapse the node.</summary>
      /// <version added="2016.1" updated="2016.1" />

      // Get the li element.
      var $node = $(e.currentTarget).parent();

      if ($node.hasClass("sr-tree-expand")) {
        // The tree node is expanded; collapse it.
        this.collapseNode($node);
      } else {
        // The tree node is collapsed; expand it.
        this.expandNode($node);
      }
    },

    _onClickNodeText: function(e) {
      /// <summary>Handle click on the node text to select the node.</summary>
      /// <version added="2016.1" updated="2016.1" />

      // Remove the active state from all the node (text)s.
      this.element.find(".ui-state-active").removeClass("ui-state-active");

      var $nodeText = $(e.currentTarget);
      var $node = $nodeText.closest("li.sr-tree-node");

      this.selectNode($node);
    },

		/***************************************************************************
     *
     * PROTECTED METHODS
     *
     **************************************************************************/

    _createEvents: function() {
      /// <summary>Subscribe to events and create event handlers.</summary>
      /// <version added="2016.1" updated="2016.1" />

      // Add arrow click event.
      this.element.on("click", ".sr-tree-node-arrow", $.proxy(this._onClickNodeArrow, this));

      // Add text click event.
      this.element.on("click", ".sr-tree-node-text", $.proxy(this._onClickNodeText, this));
    },

    _addNodeElement: function(childrenContainer, childItem) {
      /// <summary>Add an item as a node in the tree.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var itemFields = this.options.itemFields;

      // Should the node be expanded on initialization.
      var expanded = childItem[this.options.itemFields.expanded] === true;

      // Does the node have children.
      var hasChildren = this._mode === "flat"
        // The childItem has children
        ?
        (this.dataSource().view().Where(function(e) {
          return e[itemFields.parent] === childItem[itemFields.id];
        }).Count() > 0) :
        $.isArray(childItem.children);

      // Get the node text.
      var text = this.options.textTemplate === null ?
        childItem[itemFields.text] :
        (typeof this.options.textTemplate === "function" ?
          this.options.textTemplate(childItem) :
          Handlebars.compile(this.options.textTemplate, {
            noEscape: true
          })(childItem));

      // Create the node html.
      var html = this.html.node({
        uuid: childItem.UUID,
        expanded: (expanded ? "expand" : "collapse"),
        arrow: (hasChildren ? (expanded ? "ui-icon ui-icon-triangle-1-se" : "ui-icon ui-icon-triangle-1-e") : ""),
        text: text
      });

      // Add the html to the child node (li)
      var $childNode = $(html);

      // If imageCss has been provided for the node, then display the expanded or collapsed image for the node.
      if (expanded) {
        if (typeof childItem[this.options.itemFields.imageCssExpand] === "string") {
          $childNode.find(".sr-tree-node-text").prepend(this.html.imageCss.replace("{{imageCss}}", childItem[this.options.itemFields.imageCssExpand]));
        }
      } else if (typeof childItem[this.options.itemFields.imageCss] === "string") {
        $childNode.find(".sr-tree-node-text").prepend(this.html.imageCss.replace("{{imageCss}}", childItem[this.options.itemFields.imageCss]));
      }

      // Add the child node to the parent node.
      childrenContainer.append($childNode);

      return $childNode;
    },

    _addNodeElements: function(childrenContainer, items) {
      /// <summary>Add the items as nodes to the parent node.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;
      var itemFields = this.options.itemFields;

      items.ForEach(function(childItem) {
        // Add the node to the parent "children".
        var $childNode = that._addNodeElement(childrenContainer, childItem);

        if (that._mode === "flat") {
          // Search the data source for any "children" of the child node.
          var children = that.dataSource().view().Where(function(e) {
            return e[itemFields.parent] === childItem[itemFields.id];
          });
          // Add the "children" to the child node. (Called even if there are no children so that the "children ul" is added for future children).
          that._addChildNodes($childNode, children);
        } else if ($.isArray(childItem[itemFields.children])) {
          // Mode is 
          that._addChildNodes($childNode, Enumerable.From(childItem[itemFields.children]));
        }
      });
    },

    _rootNodes: function(items) {
      /// <summary>Replace the root nodes in the tree with the items passed in.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this.widgets.root.empty();

      this._addRootNodes(items);
    },

    _addRootNodes: function(items) {
      /// <summary>Add the items as root nodes in the tree.</summary>
      /// <version added="2016.1" updated="2016.1" />

      this._addNodeElements(this.widgets.root, items);
    },

    _addChildNodes: function(parentNode, children) {
      /// <summary>Add the items as nodes to the parent node.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var $children = parentNode.children(".sr-tree-children");

      if ($children.length === 0) {
        parentNode.append(this.html.children);
        $children = parentNode.children(".sr-tree-children");
      }

      this._addNodeElements($children, children);
    },

    _expandNode: function(node) {
      /// <summary>Expand the node.</summary>
      /// <version added="2016.1" updated="2016.1" />

      var item = null;
      var $arrow = node.children(".sr-tree-node-arrow");

      // The tree node is collapsed; expand it.
      node.removeClass("sr-tree-collapse")
        .addClass("sr-tree-expand");
      $arrow.removeClass("ui-icon-triangle-1-e")
        .addClass("ui-icon-triangle-1-se");

      // Get the node icon.
      var nodeIcon = node.children(".sr-tree-node-text").children(".sr-node-icon");

      if (nodeIcon.length > 0) {
        item = this.nodeItem(node);

        // If there is an imageCss field, then set the node image.
        if (typeof item[this.options.itemFields.imageCssExpand] === "string") {
          nodeIcon.attr("class", serenity.format("sr-icon sr-node-icon {0}", item[this.options.itemFields.imageCssExpand]));
        }
      }

      return item;
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
			/// <example for="JavaScript" description="Set the DataSource for the tree.">
			/// $(".selector").data("serenityTree").setDataSource(new serenity.DataSource({
      ///   data: [
      ///     { id: 1, parent: null, text: "My Application", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o", expanded: true },
      ///     { id: 2, parent: 1, text: "css", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" }
      ///   ]
      /// }));
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      this._super(ds);

      this.render();
    },

    render: function() {
      /// <function>render</function>
      /// <summary>Render the widget.</summary>
			/// <example for="JavaScript" description="Render the kanban.">
			/// $(".selector").data("serenityTree").render();
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      if (this._dataSourceValid()) {
        var itemFields = this.options.itemFields;
        var rootItems = null;

        // Determine the mode for finding items in the dataSource.
        this._mode = "flat";

        if (this._mode === "flat") {
          // Get all the items from the dataSource that do not have a parent.
          rootItems = this.dataSource().view().Where(function(e) {
            return typeof e[itemFields.parent] === "undefined" || e[itemFields.parent] === null;
          });
        }

        this._rootNodes(rootItems);

        this._trigger("dataBound");
      }
    },
		
    /***************************************************************************
     *
     * PUBLIC METHODS
     *
     **************************************************************************/

    nodeItem: function(node) {
      /// <function>nodeItem</function>
      /// <summary>Get the item for the node.</summary>
      /// <param name="node" type="JQuery">A node in the tree.</param>
			/// <example for="JavaScript" description="Get the item for the first node in the tree.">
			/// var item = $(".selector").data("serenityTree").nodeItem($(".sr-tree-node:first"));
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var uuid = node.attr("data-uuid");
      var item = this.dataSource().view().Where(function(e) {
        return e.UUID === uuid;
      }).FirstOrDefault();

      return item;
    },

    itemNode: function(item) {
      /// <function>itemNode</function>
      /// <summary>Get the node for the item.</summary>
      /// <param name="item" type="serenity.Model">An item from the tree's DataSource.</param>
      /// <summary>Get the item for the node.</summary>
			/// <example for="JavaScript" description="Get the node in the tree for an item in the tree's DataSource.">
      /// var dataSource = $(".selector").data("serenityTree").dataSource();
			/// var node = $(".selector").data("serenityTree").itemNode(dataSource.data()[0]);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      return this.element.find(serenity.format("li[data-uuid='{0}']", item.UUID));
    },

    expandNode: function(node) {
      /// <function>expandNode</function>
      /// <summary>Expand the node.</summary>
      /// <param name="node" type="JQuery">A node in the tree.</param>
			/// <example for="JavaScript" description="Expand the first node in the tree.">
			/// $(".selector").data("serenityTree").expandNode($(".sr-tree-node:first"));
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var that = this;

      // Expand the node.
      var item = this._expandNode(node);

      // Trigger the expand event.
      this._trigger("expand", null, {
        node: node
      });
    },

    collapseNode: function(node) {
      /// <function>collapseNode</function>
      /// <summary>Collapse the node.</summary>
      /// <param name="node" type="JQuery">A node in the tree.</param>
			/// <example for="JavaScript" description="Collapse the first node in the tree.">
			/// $(".selector").data("serenityTree").collapseNode($(".sr-tree-node:first"));
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var $arrow = node.children(".sr-tree-node-arrow");

      // The tree node is expanded; collapse it.
      node.removeClass("sr-tree-expand")
        .addClass("sr-tree-collapse");
      $arrow.removeClass("ui-icon-triangle-1-se")
        .addClass("ui-icon-triangle-1-e");

      // Get the node icon.
      var nodeIcon = node.children(".sr-tree-node-text").children(".sr-node-icon");

      if (nodeIcon.length > 0) {
        var item = this.nodeItem(node);

        // If there is an imageCss field, then set the node image.
        if (typeof item[this.options.itemFields.imageCss] === "string") {
          nodeIcon.attr("class", serenity.format("sr-icon sr-node-icon {0}", item[this.options.itemFields.imageCss]));
        }
      }

      // Trigger the collapse event.
      this._trigger("collapse", null, {
        node: node
      });
    },

    toggleNode: function(node, expand) {
      /// <function>toggleNode</function>
      /// <param name="node" type="jQuery">The node to expand or collapse.</param>
      /// <param name="expand" type="Boolean">Flag indicating whether the node should be expanded or not.</param>
      /// <summary>Expand or collapse the node.</summary>
			/// <example for="JavaScript" description="Expand the first node in the tree.">
			/// $(".selector").data("serenityTree").toggleNode($(".sr-tree-node:first"), true);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      if (expand) {
        this.expandNode(node);
      } else {
        this.collapseNode(node);
      }
    },

    selectNode: function(node) {
      /// <function>selectNode</function>
      /// <param name="node" type="jQuery">The node to select.</param>
      /// <summary>Select the node.</summary>
			/// <example for="JavaScript" description="Select the first node in the tree.">
			/// $(".selector").data("serenityTree").selectNode($(".sr-tree-node:first"), true);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      // Remove the active state from all the node (text)s.
      this.element.find(".ui-state-active").removeClass("ui-state-active");

      // var $nodeText = $(e.currentTarget);
      // var $node = $nodeText.closest("li.sr-tree-node");

      var $nodeText = node.children(".sr-tree-node-text");

      // Add the active state to the node (text).
      $nodeText.addClass("ui-state-active");

      this._trigger("select", null, {
        node: node
      });
    },

    add: function(items) {
      /// <function>add</function>
      /// <summary>Add items to the DataSource of the tree.</summary>
			/// <example for="JavaScript" description="Select the first node in the tree.">
			/// $(".selector").data("serenityTree").add([
      ///   { id: 7, parent: 2, text: "index.css", expanded: false, type: "file", imageCss: "fa fa-file-code-o" },
      ///   { id: 3, parent: 1, text: "images", expanded: false, type: "folder", imageCss: "fa fa-folder-o", imageCssExpand: "fa fa-folder-open-o" }
      /// ]);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      if ($.isArray(items)) {
        for (var idx = 0; idx < items.length; idx++) {
          this.dataSource().add(items[idx]);
        }
      } else if (typeof items === "object") {
        this.dataSource().add(items);
      }

      return this;
    },

    remove: function(items) {
      /// <function>remove</function>
      /// <param name="items" type="Array|Object">The object(s) to remove.</param>
      /// <summary>Remove items from the tree. This will also remove the items and it's descendants from the underlying DataSource as well.</summary>
			/// <example for="JavaScript" description="Remove the root item (thus removing all items) from the tree.">
      /// var dataSource = $(".selector").data("serenityTree").dataSource();
			/// $(".selector").data("serenityTree").remove(dataSource.data()[0]);
			/// </example>
      /// <version added="2017.1" updated="2017.1" />

      var dataSource = this.dataSource();
      var itemFields = this.options.itemFields;

      var removeChildren = function(parentItem) {
        var children = dataSource.get(function(item) {
          return item[itemFields.parent] == parentItem[itemFields.id];
        });
        Enumerable.From(children).ForEach(function(child) {
          removeChildren(child);
          dataSource.remove(child);
        });
      }

      if ($.isArray(items)) {
        for (var idx = 0; idx < items.length; idx++) {
          // Remove child items from the data source.
          removeChildren(items[idx]);
          // Remove the current item from the data source.
          dataSource.remove(items[idx]);
          // Remove the current item from the tree.
          this.itemNode(item).remove();
        }
      } else if (typeof items === "object") {
        // Remove child items from the data source.
        removeChildren(items);
        // Remove the current item from the data source.
        dataSource.remove(items);
        // Remove the current item from the tree.
        this.itemNode(items).remove();
      }

      return this;
    },

    findByText: function(text) {
      /// <function>findByText</function>
      /// <param name="text" type="String">The text of the node to find.</param>
      /// <summary>Find a node by the node's text.</summary>
			/// <example for="JavaScript" description="Get the node for the item with the text of 'Item'.">
			/// var node = $(".selector").data("serenityTree").findByText("Item");
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      var result = this.dataSource().get(function(e) {
        return e.text === text;
      });

      if ($.isArray(result)) {
        result = result[0];
      }

      return this.findByUuid(result.UUID);
    },

    findByUuid: function(uuid) {
      /// <function>findByUuid</function>
      /// <param name="uuid" type="String">The UUID of the node to find.</param>
      /// <summary>Find a node by the node's UUID.</summary>
			/// <example for="JavaScript" description="Remove the root item (thus removing all items) from the tree.">
      /// var dataSource = $(".selector").data("serenityTree").dataSource();
			/// var node = $(".selector").data("serenityTree").findByUuid(dataSource.data()[0].UUID);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      return this.element.find(serenity.format("li[data-uuid='{0}']", uuid));
    },

    parent: function(node) {
      /// <function>parent</function>
      /// <param name="node" type="jQuery">A tree node.</param>
      /// <summary>Return the parent of the tree node.</summary>
			/// <example for="JavaScript" description="Get the parent of the last node rendered in the tree.">
      /// var data = $(".selector").data("serenityTree").dataSource().data();
			/// var node = $(".selector").data("serenityTree").parent(data[data.length - 1]);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      return node.parent().closest("li.sr-tree-node");
    },

    expandTo: function(node) {
      /// <function>expandTo</function>
      /// <param name="node" type="jQuery">A tree node.</param>
      /// <summary>Expand the ancestor nodes to show the tree node.</summary>
			/// <example for="JavaScript" description="Expand all nodes to show the last item rendered in the tree.">
      /// var tree = $(".selector").data("serenityTree");
      /// var data = tree.dataSource().data();
      /// var lastNode = tree.itemNode(data[data.length - 1]);
			/// tree.expandTo(lastNode);
			/// </example>
      /// <version added="2016.1" updated="2016.1" />

      if (node.is(":visible") === false) {
        var parent = this.parent(node);
        this._expandNode(parent);
        this.expandTo(parent);
      }
    }
  });
})(window.jQuery, window.serenity);


/*
 * Events
 */

/// <event>dataBound</event>
/// <summary>Triggered when the tree is bound to the DataSource.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.Tree">Tree widget.</param>
/// <example for="JavaScript" description="Subscribe to the select event.">
/// var tree = $("#tree").serenityTree({
///   dataSource: new serenity.DataSource({ data: items }),
///   dataBound: function (event, ui) {
///     console.log(ui.sender);
///   }
/// }).data("serenityTree");
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>select</event>
/// <summary>Triggered when a node is selected.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.Tree">Tree widget.</param>
/// <param name="ui.node" type="jQuery">Node that was selected.</param>
/// <example for="JavaScript" description="Subscribe to the select event.">
/// var tree = $("#tree").serenityTree({
///   dataSource: new serenity.DataSource({ data: items }),
///   select: function (event, ui) {
///     console.log(ui.node);
///   }
/// }).data("serenityTree");
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>expand</event>
/// <summary>Triggered when a node is expanded.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.Tree">Tree widget.</param>
/// <param name="ui.node" type="jQuery">Node that was expanded.</param>
/// <example for="JavaScript" description="Subscribe to the expand event.">
/// var tree = $("#tree").serenityTree({
///   dataSource: new serenity.DataSource({ data: items }),
///   expand: function (event, ui) {
///     console.log(ui.node);
///   }
/// }).data("serenityTree");
/// </example>
/// <version added="2016.1" updated="2016.1" />

/// <event>collapse</event>
/// <summary>Triggered when a node is collapsed.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <param name="ui.sender" type="serenity.Tree">Tree widget.</param>
/// <param name="ui.node" type="jQuery">Node that was collapsed.</param>
/// <example for="JavaScript" description="Subscribe to the collapse event.">
/// var tree = $("#tree").serenityTree({
///   dataSource: new serenity.DataSource({ data: items }),
///   collapse: function (event, ui) {
///     console.log(ui.node);
///   }
/// }).data("serenityTree");
/// </example>
/// <version added="2016.1" updated="2016.1" />