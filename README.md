# Serenity UI _Lite_
Serenity UI _Lite_ is an open source library built upon the same framework as [Serenity UI](http://serenityui.com), a **free** JavaScript library that extends the jQuery UI framework.

While the [Serenity UI](http://serenityui.com) framework is not open source, it is included with Serenity UI _Lite_ as the foundation for the Serenity UI _Lite_ Classes, Modules and Widgets.

## Getting Started
### Download
[Download](https://github.com/serenityui/serenityui-lite/archive/master.zip) the Serenity UI _Lite_ repository. The repository contains the following folders:
- css - CSS files, fonts and themes for Serenity UI and third party open source libraries.
- js - JavaScript files for Serenity UI and third party open source libraries.

### Add CSS and JavaScript References
To use Serenity UI, copy the css and js folders to your web application.

EXAMPLE

Assuming the Serenity UI _Lite_ css and js folders were copied to your web application root folder.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <!-- Serenity UI CSS for Third Party Open Source Libraries -->
    <link href="css/serenityui-lite-libs.min.css" rel="stylesheet" />
    <!-- Serenity UI Theme -->
    <link href="css/themes/base/serenityui-lite.min.css" rel="stylesheet" />

    <!-- jQuery -->
    <script src="js/jquery.min.js"></script>
    <!-- Serenity UI Lite for Third Party Open Source Libraries -->
    <script src="js/serenityui-lite-libs.min.js"></script>
    <!-- Serenity UI Framework -->
    <script src="js/serenityui-framework.min.js"></script>
    <!-- Serenity UI Lite -->
    <script src="js/serenityui-lite.min.js"></script>
</head>
<body>

</body>
</html>
```



## Serenity UI _Lite_ Features
The following table provides a comparison between Serenity UI _Lite_ and [Serenity UI](http://serenityui.com).

| Feature | Source Code Provided | Serenity UI _Lite_ | Serenity UI |
| :-------- | :-----------: | :----------------: | :-----------: |
| **Framework** |
| serenity functions | :white_circle: | :large_blue_circle: | :large_blue_circle: |
| [Class](http://serenityui.com/Widgets/Documentation/Class) | :white_circle: | :large_blue_circle: | :large_blue_circle: |
| [DataSource](http://serenityui.com/Widgets/Demos/datasource/basic) | :white_circle: | :large_blue_circle: | :large_blue_circle: |
| [DataWidget](http://serenityui.com/Widgets/Documentation/datawidget) | :white_circle: | :large_blue_circle: | :large_blue_circle: |
| [Router](http://serenityui.com/Widgets/Demos/router/basic) | :white_circle: | :large_blue_circle: | :large_blue_circle: |
| [Widget](http://serenityui.com/Widgets/Documentation/widget) | :white_circle: | :large_blue_circle: | :large_blue_circle: |
| **Classes** |
| [Model](http://serenityui.com/Widgets/Demos/model/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Overlay](http://serenityui.com/Widgets/Demos/overlay/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| **Widgets** |
| [Autocomplete](http://serenityui.com/Widgets/Demos/autocomplete/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Chart](http://serenityui.com/Widgets/Demos/chart/barbasic) | :white_circle: | :white_circle: | :large_blue_circle: |
| [Combobox](http://serenityui.com/Widgets/Demos/combobox/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Contextmenu](http://serenityui.com/Widgets/Demos/contextmenu/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Dropdownlist](http://serenityui.com/Widgets/Demos/dropdownlist/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Filtermenu](http://serenityui.com/Widgets/Demos/table/filter) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Intervalselection](http://serenityui.com/Widgets/Demos/intervalselection/basic) | :white_circle: | :white_circle: | :large_blue_circle: |
| [Kanban](http://serenityui.com/Widgets/Demos/kanban/basic) | :white_circle: | :white_circle: | :large_blue_circle: |
| [Notification](http://serenityui.com/Widgets/Demos/notification/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Notificationpanel](http://serenityui.com/Widgets/Demos/notification/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Pagerpanel](http://serenityui.com/Widgets/Demos/table/page) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Panel](http://serenityui.com/Widgets/Demos/panel/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Rating](http://serenityui.com/Widgets/Demos/rating/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Scheduler](http://serenityui.com/Widgets/Demos/scheduler/basic) | :white_circle: | :white_circle: | :large_blue_circle: |
| [Splitter](http://serenityui.com/Widgets/Demos/splitter/basic) | :white_circle: | :white_circle: | :large_blue_circle: |
| [Table](http://serenityui.com/Widgets/Demos/table/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Timepicker](http://serenityui.com/Widgets/Demos/timepicker/basic) | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |
| [Tree](http://serenityui.com/Widgets/Demos/tree/basic) | :white_circle: | :white_circle: | :large_blue_circle: |
| [Tree (_Lite_)](http://serenityui.com/Widgets/Demos/tree/basic) :small_red_triangle: | :large_blue_circle: | :large_blue_circle: | :large_blue_circle: |

:small_red_triangle: - The Serenity UI _Lite_ widget offers the "basic" functionality of the Serenity UI widget.


[//]: https://www.webpagefx.com/tools/emoji-cheat-sheet/
[//]: https://help.github.com/categories/writing-on-github/
[//]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
