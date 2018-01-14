/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    $("#table").serenityTable({
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
        height: "500px"
    });
});
//# sourceMappingURL=table.basic.js.map