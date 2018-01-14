/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
  function printSelected(previouseDataItem: Employee, dataItem: Employee) {
    $("#results").append(serenity.format("<div>Selected Item was changed from {0} to {1}</div>", previouseDataItem.fullName, dataItem.fullName));
  }

  let dropdownlist: serenity.Dropdownlist = $("#dropdownlist").serenityDropdownlist({
  dataSource: new serenity.DataSource({ data: employees }),
  textField: "fullName",
  valueField: "id",
  height: 250,
  placeholder: {
    value: 0,
    text: "Select an employee...",
    template: Handlebars.compile("<span style='font-style:italic;'>{{text}}</span>")
  },
  change: () => {
    printSelected(dropdownlist.previousDataItem(), dropdownlist.dataItem());
  }
  }).data("serenityDropdownlist");
});
