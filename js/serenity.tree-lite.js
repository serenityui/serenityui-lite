/**
 * Serenity UI v2017.4.180113 (https://serenityui.com)
 */
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