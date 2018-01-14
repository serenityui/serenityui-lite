/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    $("#table").serenityTable({
        dataSource: new serenity.DataSource({
            data: employees,
            aggregates: [
                { field: "age", calc: "average" },
                { field: "age", calc: "count" },
                { field: "age", calc: "max" },
                { field: "age", calc: "min" },
                { field: "age", calc: "sum" },
                { field: "service", calc: "average" },
                { field: "service", calc: "max" },
                { field: "service", calc: "min" }
            ],
            trackChanges: false
        }),
        columns: [{
                title: "Name",
                field: "fullName",
                width: "200px",
                footerTemplate: "Calculations:",
                footerStyles: "float:left;"
            }, {
                title: "Title",
                field: "title"
            }, {
                title: "Age",
                field: "age",
                width: "100px"
            }, {
                title: "Years of Service",
                field: "service",
                width: "100px",
                footerTemplate: "<span style='color:blue;'>Average: {{average}}</span><br/><span style='color:green;'>Min/Max: {{min}} / {{max}}</span>"
            }],
        height: "500px",
        showCalculations: true
    });
});
//# sourceMappingURL=table.aggregates.js.map