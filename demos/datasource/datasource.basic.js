/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    function printResults(text) {
        var $el = $("#results");
        $el.text(text);
    }
    // Create a DataSource from the array of employees.
    var ds = new serenity.DataSource({ data: employees });
    // Filter the employees where the full name contains "John" and the title starts with "Senior".
    ds.filter([{ field: "fullName", operator: "contains", value: "John" }, { field: "title", operator: "startswith", value: "Senior" }]);
    // Sort by age in ascending order.
    ds.sort({ field: "age", dir: "asc" });
    // Get a view of the data with the filter and sort applied.
    var results = ds.view().ToArray();
    printResults(JSON.stringify(results, null, '  '));
});
//# sourceMappingURL=datasource.basic.js.map