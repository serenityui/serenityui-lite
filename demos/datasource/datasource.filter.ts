/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
    function printResults(text : string) {
        let $el: JQuery = $("#results");
        $el.text(text);
    }

    $("#filter").selectmenu({ width: 500 });

    let ds: serenity.DataSource = new serenity.DataSource({ data: employees });

    $("#goButton").button().on("click", function () {
        let operator: string = $("#filter").val();

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

        let results: Array<Employee> = ds.view().ToArray();
        printResults(JSON.stringify(results, null, '  '));
    });
});
