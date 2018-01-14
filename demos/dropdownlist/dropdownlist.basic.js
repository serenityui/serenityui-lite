/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    function printSelected(dataItem) {
        $("#results").append(serenity.format("<div>Selected Item: {0}</div>", dataItem.fullName));
    }
    var dropdownlist = $("#dropdownlist").serenityDropdownlist({
        dataSource: new serenity.DataSource({ data: employees }),
        textField: "fullName",
        valueField: "id",
        height: 250,
        change: function () {
            printSelected(dropdownlist.dataItem());
        }
    }).data("serenityDropdownlist");
});
//# sourceMappingURL=dropdownlist.basic.js.map