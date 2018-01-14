/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
  let count: number = 1;
  let $results: JQuery = $("#results");

  $("#listview").serenityListview({
    dataSource: new serenity.DataSource({
      data: employees,
      trackChanges: false
    }),
    titleField: "fullName",
    selectable: true,
    mode: "tile",
    dataBound: (event: Event, ui) => {
      $results.prepend(serenity.format("<div>{0}. dataBound event raised</div>", count++));
    },
    select: (event: Event, ui) => {
      $results.prepend(serenity.format("<div>{0}. select event raised for: {1}</div>", count++, ui.item.fullName));
    }
  });
});
