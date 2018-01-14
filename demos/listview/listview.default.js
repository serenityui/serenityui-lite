/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    var count = 1;
    var $results = $("#results");
    $("#listview").serenityListview({
        dataSource: new serenity.DataSource({
            data: employees,
            trackChanges: false
        }),
        titleField: "fullName",
        selectable: true,
        pageable: true,
        mode: {
            view: "tile",
            selectable: true
        },
        tile: {
            templateSelector: "#tileTemplate"
        },
        list: {
            templateSelector: "#listTemplate"
        },
        height: "400px",
        dataBound: function (event, ui) {
            $results.prepend(serenity.format("<div>{0}. dataBound event raised</div>", count++));
        },
        select: function (event, ui) {
            $results.prepend(serenity.format("<div>{0}. select event raised for: {1}</div>", count++, ui.item.fullName));
        },
        modeChange: function (event, ui) {
            $results.prepend(serenity.format("<div>{0}. modeChange event raised for mode changed to: {1}</div>", count++, ui.mode));
        },
        pageChange: function (event, ui) {
            $results.prepend(serenity.format("<div>{0}. pageChange event raised for page changed from: {1} to: {2}</div>", count++, ui.page.before, ui.page.current));
        }
    });
});
//# sourceMappingURL=listview.default.js.map