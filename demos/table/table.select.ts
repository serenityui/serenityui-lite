/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
  let count: number = 1;
  let $results: JQuery = $("#results");

  function showSelectEventInfo(items: Array<any>): void {
    let selected: string = Enumerable.From(items).Select("$.fullName").ToString(", ");

    // Display the filter details to the user.
    $results.prepend(serenity.format("<div><p>{0}. Selected employees are: {1}", 
      count++,
      selected.length === 0 ? "<i>None</i>" : selected));
  }

  let table: serenity.Table = $("#table").serenityTable({
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
      width: "100px"
    }],
    selectionmode: "singlerow",
    select: () => {
        showSelectEventInfo(table.selectedRowItems());
    }
  }).data("serenityTable");
});
