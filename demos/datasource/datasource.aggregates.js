/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    function printResults(text) {
        var $el = $("#results");
        $el.text(text);
    }
    $("#scope").selectmenu({ width: 350 });
    var ds = new serenity.DataSource({ data: employees });
    $("#goButton").button().on("click", function () {
        var scope = $("#scope").val();
        $("pre.code-example").hide();
        $("#code-" + scope).show();
        if (scope === "view") {
            ds.aggregates([
                { field: "age", calc: "average" },
                { field: "age", calc: "count" },
                { field: "age", calc: "max" },
                { field: "age", calc: "min" },
                { field: "age", calc: "sum" }
            ]);
            ds.removePage();
        }
        else {
            ds.aggregates([
                { field: "age", calc: "average", scope: "page" },
                { field: "age", calc: "count", scope: "page" },
                { field: "age", calc: "max", scope: "page" },
                { field: "age", calc: "min", scope: "page" },
                { field: "age", calc: "sum", scope: "page" }
            ]);
            if (scope === "page5") {
                ds.changePage(1, 5);
            }
            else {
                ds.changePage(1, 10);
            }
        }
        printResults(JSON.stringify(ds.calculations(), null, '  '));
    });
});
//# sourceMappingURL=datasource.aggregates.js.map