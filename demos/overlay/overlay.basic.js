/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    var table = $("#table").serenityTable({
        dataSource: new serenity.DataSource({
            data: employees,
            filter: [{ field: "title", operator: "contains", value: "Software" }]
        }),
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
        height: "200px"
    }).data("serenityTable");
    $("#tableOverlay").on("click", function () {
        serenity.overlay.show({ element: $("#table"), text: "Table overlay for 3 seconds...", cssClass: "srw-table-overlay" });
        setTimeout(function () {
            serenity.overlay.hide({ element: $("#table") });
        }, 3000);
    });
    $("#pageOverlay").on("click", function () {
        serenity.overlay.show({ text: "Page overlay for 3 seconds...", cssClass: "srw-page-overlay" });
        setTimeout(function () {
            serenity.overlay.hide();
        }, 3000);
    });
});
//# sourceMappingURL=overlay.basic.js.map