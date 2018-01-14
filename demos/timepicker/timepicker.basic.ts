/// <reference path="../../src/ts/serenityui.d.ts"/>

$(() => {
    $("#timepicker").serenityTimepicker({
        mode: "24",
        min: new Date(new Date().setHours(9,0)),
        max: "14:00",
        interval: 15,
        date: new Date(new Date().setHours(13,0))
    });
});
