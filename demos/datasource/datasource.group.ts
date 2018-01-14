/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(function () {
    function printResults(text: string) {
        let $el: JQuery = $("#results");
        $el.text(text);
    }

    $("#by").selectmenu({ width: 400 });

    let ds: serenity.DataSource = new serenity.DataSource({ data: employees });

    $("#goButton").button().on("click", function () {
        let by: string = $("#by").val();

        if (by === "age") {
            ds.group({ by: (employee : Employee) => { return Math.floor(employee.age / 10) * 10; } });
        } else if (by === "state and city") {
            ds.group({ by: ["state", "city"] });
        } else {
            ds.group({ by: by });
        }
        
        let results: Array<Employee> = ds.view().ToArray();
        printResults(JSON.stringify(results, null, '  '));
    });
});
