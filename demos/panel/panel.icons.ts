/// <reference path="../../src/ts/serenityui.d.ts"/>

$(() => {
    $("#panel").serenityPanel({
        collapsible: true,
        expander: {
            collapse: "fa fa-caret-down",
            expand: "fa fa-caret-right"
        }
    });
});
