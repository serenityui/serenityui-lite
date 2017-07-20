/**
 * Serenity UI v2017.1.170720 (https://www.serenityui.com)
 */
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
