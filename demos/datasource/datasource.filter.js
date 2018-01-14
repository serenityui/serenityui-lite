/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    function printResults(text) {
        var $el = $("#results");
        $el.text(text);
    }
    $("#filter").selectmenu({ width: 500 });
    var ds = new serenity.DataSource({ data: employees });
    $("#goButton").button().on("click", function () {
        var operator = $("#filter").val();
        switch (operator) {
            case "eq":
                ds.filter({ field: "title", operator: "eq", value: "Junior Quality Assurance Engineer" });
                break;
            case "neq":
                ds.filter({ field: "title", operator: "neq", value: "Junior Quality Assurance Engineer" });
                break;
            case "startswith":
                ds.filter({ field: "fullName", operator: "startswith", value: "John" });
                break;
            case "endswith":
                ds.filter({ field: "fullName", operator: "endswith", value: "Garcia" });
                break;
            case "contains":
                ds.filter({ field: "title", operator: "contains", value: "Director" });
                break;
            case "doesnotcontain":
                ds.filter({ field: "title", operator: "doesnotcontain", value: "Engineer" });
                break;
        }
        var results = ds.view().ToArray();
        printResults(JSON.stringify(results, null, '  '));
    });
});
//# sourceMappingURL=datasource.filter.js.map