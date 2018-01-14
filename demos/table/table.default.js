/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    $("#table").serenityTable({
        dataSource: new serenity.DataSource({
            data: employees,
            trackChanges: false,
            page: {
                current: 1,
                size: 50
            }
        }),
        columns: [{
                title: "Name",
                field: "fullName",
                sortable: true,
                filterable: true
            }, {
                title: "Title",
                field: "title",
                sortable: true,
                filterable: true
            }, {
                title: "City",
                field: "city",
                width: "150px",
                sortable: true,
                filterable: true
            }, {
                title: "State",
                field: "state",
                width: "150px",
                sortable: true,
                filterable: true
            }, {
                title: "Age",
                field: "age",
                width: "100px",
                sortable: true,
                filterable: true
            }],
        height: "400px",
        pageable: true
    });
});
//# sourceMappingURL=table.default.js.map