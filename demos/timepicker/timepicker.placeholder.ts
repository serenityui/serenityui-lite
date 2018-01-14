/// <reference path="../../src/ts/serenityui.d.ts"/>

$(() => {
  function printSelected(previouseDataItem: any, dataItem: any) {
    $("#results").append(serenity.format("<div>Selected Item was changed from {0} to {1}</div>", previouseDataItem.text, dataItem.text));
  }

  let timepicker: serenity.Timepicker = $("#timepicker").serenityTimepicker({
    mode: "24",
    min: new Date(new Date().setHours(9,0)),
    max: "14:00",
    interval: 15,
    placeholder: {
      value: 0,
      text: "Pick a time...",
      template: Handlebars.compile("<span style='font-style:italic;'>{{text}}</span>")
    },
    change: () => {
      printSelected(timepicker.previousDataItem(), timepicker.dataItem());
    }
  }).data("serenityTimepicker");
});
