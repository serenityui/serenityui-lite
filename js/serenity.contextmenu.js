/**
 * Serenity UI v2017.1.170720 (https://www.serenityui.com)
 */
(function ($, serenity) {
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

        options: {
            /// <option>dataSource</option>
            /// <datatype>serenity.DataSource</datatype>
            /// <default>null</default>
            /// <typedef>dataSource: serenity.DataSource</typedef>
            /// <summary>Items to be displayed in the contextmenu.</summary>
            /// <version added="2016.1" updated="2016.1" />
            dataSource: null,

            /// <option>target</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>target: string</typedef>
            /// <summary>CSS Selector for the target elements.</summary>
            /// <version added="2016.1" updated="2016.1" />
            target: null,

            /// <option>child</option>
            /// <datatype>String</datatype>
            /// <default>null</default>
            /// <typedef>child: string</typedef>
            /// <summary>CSS Selector to filter the children of the target elements.</summary>
            /// <version added="2016.1" updated="2016.1" />
            child: null
        },

        html: {
            item: Handlebars.compile("<li {{cssClass}}><div>{{text}}</div></li>", { noEscape: true }),
            itemIcon: Handlebars.compile("<li {{cssClass}}><div><span class='{{icon}}'></span>{{text}}</div></li>", { noEscape: true }),
            divider: "<div class='ui-menu-divider ui-widget-content'></div>"
        },

        _create: function () {
            /// <summary>Constructor for the contextmenu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            var that = this;

            this._super();

            this.element.attr("style", "display:inline-block;position:absolute;");
            this.element.hide();
            this.element.appendTo("body");

            this.target(this.options.target, this.options.child);

            $("body").on("click.contextmenu", function () {
                that.element.hide("blind", null, 200);
            });

            this.setDataSource(this.options.dataSource);
        },

        _onDataSourceChange: function () {
            /// <summary>When a change is made to the DataSource, refresh the list.</summary>
            /// <version added="2016.1" updated="2016.1" />

            this.refresh();
        },

        _onContextMenu: function (e) {
            /// <summary>Handle the contextmenu event on the target elements.</summary>
            /// <version added="2016.1" updated="2016.1" />

            // this._current = $(e.currentTarget);
            
            e.preventDefault();
            // this.element.css({ top: e.pageY, left: e.pageX });
            // this.element.show("blind", null, 200);
            
            this.open($(e.currentTarget), e.pageY, e.pageX);
        },

        setDataSource: function (ds) {
            /// <function>setDataSource</function>
            /// <typedef>setDataSource: (ds: serenity.DataSource) => void</typedef>
            /// <summary>Set the data source.</summary>
            /// <param name="ds" type="serenity.DataSource">Contains the items to be displayed in the contextmenu.</param>
            /// <version added="2016.1" updated="2016.1" />

            this._super(ds);

            this.refresh();
        },
        
        open: function (target, top, left) {
            /// <function>open</function>
            /// <typedef>open: () => void</typedef>
            /// <summary>Open the context menu.</summary>
            /// <version added="2017.1" updated="2017.1" />
            
            this._current = target;

            // Trigger the beforeOpen event.
            this._trigger("beforeOpen", null, { target: target });

            this.element.css({ top: top, left: left });
            this.element.show("blind", null, 200);

            return this;
        },

        refresh: function () {
            /// <function>refresh</function>
            /// <typedef>refresh: () => void</typedef>
            /// <summary>Parses the original element and re-renders the menu.</summary>
            /// <version added="2016.1" updated="2016.1" />

            if (this._dataSourceValid()) {
                var view = this._dataSource.view();
                var that = this;
                var item = null;

                this.element.empty();

                view.ForEach(function (dataItem, index) {
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

                this._trigger("load");
            } else {
                this._super();
            }
        },

        select: function( event ) {
            /// <summary>Override the select function to add the "target" to the ui object.</summary>
            /// <version added="2016.1" updated="2016.1" />

            // BEGIN: Copied from menu.js source code.
            this.active = this.active || $(event.target).closest(".ui-menu-item");
            var ui = { item: this.active };
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
        
        target: function (targetSelector, childSelector) {
            /// <function>target</function>
            /// <typedef>target: (targetSelector: string, childSelector: string) => void</typedef>
            /// <param name="targetSelector" type="String">CSS Selector for the target elements.</param>
            /// <param name="childSelector" type="String" optional="true">CSS Selector to filter the children of the target elements.</param>
            /// <summary>Set the target for the context menu.</summary>
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

/// <event>load</event>
/// <summary>Triggered when the menu has been populated from the DataSource.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <version added="2016.1" updated="2016.1" />

/// <event>beforeOpen</event>
/// <summary>Triggered before the context menu is opened.</summary>
/// <param name="event" type="jQuery.Event">A jQuery.Event object.</param>
/// <version added="2017.1" updated="2017.1" />
