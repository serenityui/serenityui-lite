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
        mode: "tile",
        dataBound: function (event, ui) {
            $results.prepend(serenity.format("<div>{0}. dataBound event raised</div>", count++));
        },
        select: function (event, ui) {
            $results.prepend(serenity.format("<div>{0}. select event raised for: {1}</div>", count++, ui.item.fullName));
        }
    });
});
//# sourceMappingURL=listview.basic.js.map