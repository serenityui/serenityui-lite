/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
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
                width: "100px",
                hidden: true
            }, {
                title: "Years of Service",
                field: "service",
                width: "100px"
            }],
        height: "500px"
    }).data("serenityTable");
    var $checkboxes = $("#columnVisibility input");
    $checkboxes.checkboxradio({ icon: false });
    $checkboxes.on("click", function (event) {
        var $checkbox = $(event.target);
        var field = $checkbox.attr("data-field");
        if ($checkbox.is(":checked")) {
            table.showColumn(field);
        }
        else {
            table.hideColumn(field);
        }
    });
});
//# sourceMappingURL=table.columnvisibility.js.map