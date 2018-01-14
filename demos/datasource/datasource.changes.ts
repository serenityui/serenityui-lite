/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
    function printResults(text: string) {
        let $el = $("#results");
        $el.text(text);
    }

    let ds: serenity.DataSource = new serenity.DataSource({ data: employees });

    // Modify an employee.
    let employee: Employee = ds.get((item: Employee) => { return item.id === 3; }) as Employee;
    (employee as serenity.Model).set("fullName", "John Adams");

    // Remove an employee.
    ds.remove(ds.get((item: Employee) => { return item.id === 21; }));

    // Add an employee.
    ds.add({ id: 26, fullName: "Joseph Taylor", title: "Customer Support Administrator", age: 56 });

    // Get all the changes.
    var results: Object = ds.pendingChanges();

    printResults(JSON.stringify(results, null, '  '));
});
