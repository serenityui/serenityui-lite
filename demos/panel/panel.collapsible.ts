/// <reference path="../../src/ts/serenityui.d.ts"/>

$(() => {
    $("#panel").serenityPanel({
        collapsible: true,
        open: () => {
            $("#results").append("<div>The open event was triggered");
        },
        close: () => {
            $("#results").append("<div>The close event was triggered");
        }
    });
});
