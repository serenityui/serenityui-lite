/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
    let table = $("#table").serenityTable({
      dataSource: employees,
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
        width: "100px",
        hidden: true
      }, {
        title: "Years of Service",
        field: "service",
        width: "100px"
      }],
      height: "500px"
    }).data("serenityTable");

    let $checkboxes = $("#columnVisibility input");
    
    $checkboxes.checkboxradio({ icon: false });

    $checkboxes.on("click", (event: JQueryEventObject) => {
        let $checkbox = $(event.target);
        let field = $checkbox.attr("data-field");
        if ($checkbox.is(":checked")) {
            table.showColumn(field);
        } else {
            table.hideColumn(field);
        }
    });
});
