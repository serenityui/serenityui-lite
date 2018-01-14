/// <reference path="../../src/ts/serenityui.d.ts"/>
$(function () {
    $("#panel").serenityPanel({
        collapsible: true,
        open: function () {
            $("#results").append("<div>The open event was triggered");
        },
        close: function () {
            $("#results").append("<div>The close event was triggered");
        }
    });
});
//# sourceMappingURL=panel.collapsible.js.map