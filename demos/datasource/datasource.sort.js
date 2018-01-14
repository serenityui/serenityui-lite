/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    function printResults(text) {
        var $el = $("#results");
        $el.text(text);
    }
    $("#sort").selectmenu({ width: 300 });
    var ds = new serenity.DataSource({ data: employees });
    $("#goButton").button().on("click", function () {
        var dir = $("#sort").val();
        switch (dir) {
            case "asc":
                ds.sort({ field: "fullName", dir: "asc" });
                break;
            case "desc":
                ds.sort({ field: "fullName", dir: "desc" });
                break;
        }
        var results = ds.view().ToArray();
        printResults(JSON.stringify(results, null, '  '));
    });
});
//# sourceMappingURL=datasource.sort.js.map