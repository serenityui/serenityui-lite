/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
    let table: serenity.Table = $("#table").serenityTable({
      dataSource: new serenity.DataSource({ 
        data: employees, 
        page: { 
          size: 10, 
          current: 1 
        } ,
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
      pageable: true,
      height: "250px",
      showCalculations: true
    }).data("serenityTable");

    table.dataSource().aggregates([
        { field: "age", calc: "average", scope: "page" }, 
        { field: "age", calc: "count", scope: "page" },
        { field: "age", calc: "max", scope: "page" },
        { field: "age", calc: "min", scope: "page" },
        { field: "age", calc: "sum", scope: "page" }
    ]);
  });
