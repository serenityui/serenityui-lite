/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(function () {
    function printSelected(fullName : string) {
        $("#results").append(serenity.format("<div>Selected Item: {0}</div>", fullName));
    }

    var combobox = $("#combobox").serenityCombobox({
        dataSource: new serenity.DataSource({ data: employees }),
        textField: "fullName",
        valueField: "id",
        change: function () {
                    
            // Get the dataItem that was selected.
            var dataItem : Employee = combobox.dataItem();

            // If a dataItem was selected, get the fullName from it.
            // Otherwise, use the text from the input element.
            var text : string = typeof dataItem === "object"
                ? dataItem.fullName
                : combobox.element.val();
            printSelected(text);
        }
    }).data("serenityCombobox");
});
