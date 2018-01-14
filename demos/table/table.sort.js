/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    var count = 1;
    var $results = $("#results");
    $("#table").serenityTable({
        dataSource: new serenity.DataSource({
            data: employees,
            change: function (args) {
                // Concat the sort objects together for before and after the sort occurred.
                var before = Enumerable.From(args.before).Where("$.dir.length > 0").Select("$.field + ' sorted ' + $.dir").ToString(" and ");
                var after = Enumerable.From(args.value).Where("$.dir.length > 0").Select("$.field + ' sorted ' + $.dir").ToString(" and ");
                // Display the sort details to the user.
                $results.prepend(serenity.format("<div><p>{0}. Change event is: {1}</p><p>before: {2}</p><p>after: {3}</div>", count++, args.type, before, after));
            },
            trackChanges: false
        }),
        columns: [{
                title: "Name",
                field: "fullName",
                width: "200px",
                sortable: true
            }, {
                title: "Title",
                field: "title",
                sortable: true
            }, {
                title: "Age",
                field: "age",
                width: "100px",
                sortable: true
            }]
    });
});
//# sourceMappingURL=table.sort.js.map