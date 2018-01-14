/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    function printResults(text) {
        var $el = $("#results");
        $el.text(text);
    }
    $("#by").selectmenu({ width: 400 });
    var ds = new serenity.DataSource({ data: employees });
    $("#goButton").button().on("click", function () {
        var by = $("#by").val();
        if (by === "age") {
            ds.group({ by: function (employee) { return Math.floor(employee.age / 10) * 10; } });
        }
        else if (by === "state and city") {
            ds.group({ by: ["state", "city"] });
        }
        else {
            ds.group({ by: by });
        }
        var results = ds.view().ToArray();
        printResults(JSON.stringify(results, null, '  '));
    });
});
//# sourceMappingURL=datasource.group.js.map