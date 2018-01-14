/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    function printResults(text) {
        var $el = $("#results");
        $el.text(text);
    }
    var ds = new serenity.DataSource({ data: employees });
    // Modify an employee.
    var employee = ds.get(function (item) { return item.id === 3; });
    employee.set("fullName", "John Adams");
    // Remove an employee.
    ds.remove(ds.get(function (item) { return item.id === 21; }));
    // Add an employee.
    ds.add({ id: 26, fullName: "Joseph Taylor", title: "Customer Support Administrator", age: 56 });
    // Get all the changes.
    var results = ds.pendingChanges();
    printResults(JSON.stringify(results, null, '  '));
});
//# sourceMappingURL=datasource.changes.js.map