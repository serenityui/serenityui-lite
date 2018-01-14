/// <reference path="../../src/ts/serenityui.d.ts"/>
$(function () {
    function printEvent(event) {
        $("#results").append(serenity.format("<div>Event: {0}</div>", event));
    }
    $("#cssClass, #animate, #position, #template").selectmenu({ width: 200 });
    var notification = $("#notification").serenityNotification({
        width: 250,
        render: function (event, ui) {
            printEvent("render");
        },
        show: function (event, ui) {
            printEvent("show");
        },
        hide: function (event, ui) {
            printEvent("hide");
        },
        click: function (event, ui) {
            printEvent("click");
        },
        duration: 5000
    }).data("serenityNotification");
    $("#showNotification").button().on("click", function () {
        var cssClass = $("#cssClass").val();
        var animate = $("#animate").val();
        var position = $.extend({ top: null, left: null, bottom: null, right: null }, JSON.parse($("#position").val()));
        var template = $("#template").val();
        if (template === "time") {
            $("div[data-template='time']").html(serenity.format("The current time is: {0}", new Date().toLocaleTimeString()));
        }
        var options = { cssClass: cssClass, position: position, animation: { show: animate, hide: animate } };
        notification._setOptions(options);
        notification.show(serenity.format("div[data-template='{0}']", template));
    });
    $("#hideNotification").button().on("click", function () {
        notification.hideAll();
    });
});
//# sourceMappingURL=notification.templates.js.map