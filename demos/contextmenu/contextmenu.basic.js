/// <reference path="../../src/ts/serenityui.d.ts"/>
$(function () {
    $("#contextmenu").serenityContextmenu({
        target: "#target",
        select: function (event, ui) {
            $("#results").append(serenity.format("<div>{0}</div>", ui.item.text()));
        }
    });
});
//# sourceMappingURL=contextmenu.basic.js.map