/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    function printSelected(previouseDataItem, dataItem) {
        $("#results").append(serenity.format("<div>Selected Item was changed from {0} to {1}</div>", previouseDataItem.fullName, dataItem.fullName));
    }
    var dropdownlist = $("#dropdownlist").serenityDropdownlist({
        dataSource: new serenity.DataSource({ data: employees }),
        textField: "fullName",
        valueField: "id",
        height: 250,
        placeholder: {
            value: 0,
            text: "Select an employee...",
            template: Handlebars.compile("<span style='font-style:italic;'>{{text}}</span>")
        },
        change: function () {
            printSelected(dropdownlist.previousDataItem(), dropdownlist.dataItem());
        }
    }).data("serenityDropdownlist");
});
//# sourceMappingURL=dropdownlist.placeholder.js.map