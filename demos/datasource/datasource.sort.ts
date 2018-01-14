/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
    function printResults(text: string) {
        let $el: JQuery = $("#results");
        $el.text(text);
    }

    $("#sort").selectmenu({ width: 300 });

    let ds: serenity.DataSource = new serenity.DataSource({ data: employees });

    $("#goButton").button().on("click", function () {
        let dir: string = $("#sort").val();

        switch (dir) {
            case "asc":
                ds.sort({ field: "fullName", dir: "asc" });
                break;
            case "desc":
                ds.sort({ field: "fullName", dir: "desc" });
                break;
        }

        let results: Array<Employee> = ds.view().ToArray();
        printResults(JSON.stringify(results, null, '  '));
    });
});
