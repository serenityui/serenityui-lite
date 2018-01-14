/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    Handlebars.registerHelper("toUpperCase", function (str) {
        return str.toUpperCase();
    });
    $("#table").serenityTable({
        dataSource: new serenity.DataSource({ data: employees }),
        columns: [{
                title: "Name",
                field: "fullName",
                width: "200px",
                template: Handlebars.compile("{{toUpperCase fullName}}"),
                styles: "font-weight: bold;"
            }, {
                title: "Title",
                field: "title",
                template: "{{toUpperCase title}}"
            }, {
                title: "Age",
                field: "age",
                width: "100px",
                template: function (dataItem) {
                    return serenity.format("{0} years old", dataItem.age);
                }
            }],
        height: "500px"
    });
});
//# sourceMappingURL=table.template.js.map