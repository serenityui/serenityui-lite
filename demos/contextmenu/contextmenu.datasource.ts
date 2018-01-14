/// <reference path="../../src/ts/serenityui.d.ts"/>

$(function () {
    var menuItems = [
        { text: "New", icon: "ui-icon-document" },
        { divider: true },
        { text: "Open", icon: "ui-icon-folder-open" },
        { divider: true },
        { text: "Preview" },
        { text: "Save", icon: "ui-icon-disk" },
        { text: "Delete", icon: "ui-icon-trash", disabled: true },
        { text: "Close", icon: "ui-icon-close" },
        { divider: true }
    ];

    var contextmenu: serenity.Contextmenu = $("#contextmenu").serenityContextmenu({
        dataSource: new serenity.DataSource({ data: menuItems }),
        target: "#target",
        select: function (event, ui) {
            $("#results").append(serenity.format("<div>{0}</div>", ui.item.text()));
        }
    }).data("serenityContextmenu");

    // Add another menu item to the dataSource.
    contextmenu.dataSource().add({ text: "Properties (added after initialization)", icon: "fa fa-info" });
});
