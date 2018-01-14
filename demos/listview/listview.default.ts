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
    pageable: true,
    mode: {
      view: "tile",
      selectable: true
    },
    tile: {
      templateSelector: "#tileTemplate"
    },
    list: {
      templateSelector: "#listTemplate"
    },
    height: "400px",
    dataBound: (event: Event, ui: serenity.ListviewParams) => {
      $results.prepend(serenity.format("<div>{0}. dataBound event raised</div>", count++));
    },
    select: (event: Event, ui: serenity.ListviewItemParams) => {
      $results.prepend(serenity.format("<div>{0}. select event raised for: {1}</div>", count++, ui.item.fullName));
    },
    modeChange: (event: Event, ui: serenity.ListviewModeParams) => {
      $results.prepend(serenity.format("<div>{0}. modeChange event raised for mode changed to: {1}</div>", count++, ui.mode));
    },
    pageChange: (event: Event, ui: serenity.ListviewPageParams) => {
      $results.prepend(serenity.format("<div>{0}. pageChange event raised for page changed from: {1} to: {2}</div>", count++, ui.page.before, ui.page.current));
    }
  });
});
