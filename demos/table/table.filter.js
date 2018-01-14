/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    var count = 1;
    var $results = $("#results");
    function showChangeEventInfo(type, before, after) {
        // Display the filter details to the user.
        $results.prepend(serenity.format("<div><p>{0}. Change event is: {1}</p><p>before: {2}</p><p>after: {3}</div>", count++, type, before.length === 0 ? "<i>No Filter</i>" : before, after.length === 0 ? "<i>No Filter</i>" : after));
    }
    $("#table").serenityTable({
        dataSource: new serenity.DataSource({
            data: employees,
            change: function (args) {
                // Concat the filter objects together for before and after the filter occurred.
                var before = Enumerable.From(args.before)
                    .Select("$.field + ' ' + $.operator + ' '  + $.value")
                    .ToString(" and ");
                var after = Enumerable.From(args.value)
                    .Select("$.field + ' ' + $.operator + ' '  + $.value")
                    .ToString(" and ");
                // Display the filter details to the user.
                showChangeEventInfo(args.type, before, after);
            },
            trackChanges: false
        }),
        columns: [{
                title: "Name",
                field: "fullName",
                width: "200px",
                filterable: true
            }, {
                title: "Title",
                field: "title",
                filterable: true
            }, {
                title: "Age",
                field: "age",
                width: "100px",
                filterable: true
            }]
    });
});
//# sourceMappingURL=table.filter.js.map