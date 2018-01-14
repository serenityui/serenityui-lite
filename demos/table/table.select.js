/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    var count = 1;
    var $results = $("#results");
    function showSelectEventInfo(items) {
        var selected = Enumerable.From(items).Select("$.fullName").ToString(", ");
        // Display the filter details to the user.
        $results.prepend(serenity.format("<div><p>{0}. Selected employees are: {1}", count++, selected.length === 0 ? "<i>None</i>" : selected));
    }
    var table = $("#table").serenityTable({
        dataSource: employees,
        columns: [{
                title: "Name",
                field: "fullName",
                width: "200px"
            }, {
                title: "Title",
                field: "title"
            }, {
                title: "Age",
                field: "age",
                width: "100px"
            }],
        selectionmode: "singlerow",
        select: function () {
            showSelectEventInfo(table.selectedRowItems());
        }
    }).data("serenityTable");
});
//# sourceMappingURL=table.select.js.map