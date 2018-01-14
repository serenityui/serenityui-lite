/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    var count = 1;
    var $results = $("#results");
    $("#table").serenityTable({
        dataSource: new serenity.DataSource({
            data: employees,
            page: {
                size: 10,
                current: 1
            },
            change: function (args) {
                // Concat the page objects together for before and after the filter occurred.
                var before = serenity.format("page: {0}, size: {1}", args.before.current, args.before.size);
                var after = serenity.format("page: {0}, size: {1}", args.value.current, args.value.size);
                // Display the page details to the user.
                $results.prepend(serenity.format("<div><p>{0}. Change event is: {1}</p><p>before: {2}</p><p>after: {3}</div>", count++, args.type, before, after));
            },
            trackChanges: false
        }),
        columns: [{
                title: "Name",
                field: "fullName",
                width: "200px"
            }, {
                title: "Title",
                field: "title"
            }, {
                title: "Age",
                field: "age",
                width: "100px"
            }],
        pageable: {
            pagesizes: [5, 10, 15, 20, 25]
        }
    });
});
//# sourceMappingURL=table.page.js.map