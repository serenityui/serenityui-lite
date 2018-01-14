/// <reference path="../../src/ts/serenityui.d.ts"/>
$(function () {
    function printValue(value) {
        $("#results").append(serenity.format("<div>Selected value: {0}</div>", value));
    }
    // Set the font size to 1.5em.
    $("#fontRating").serenityRating({
        font: {
            size: "1.5em"
        },
        change: function (event, args) {
            printValue(args.value.toString());
        }
    }).data("serenityRating");
    // Set a font code and initial value.
    $("#fontCodeRating").serenityRating({
        font: {
            code: 10022,
            size: "1.5em"
        },
        value: 2,
        change: function (event, args) {
            printValue(args.value.toString());
        }
    }).data("serenityRating");
    // Set a font char and initial value.
    $("#fontCharRating").serenityRating({
        font: {
            char: "@",
            size: "1.5em"
        },
        value: 2,
        change: function (event, args) {
            printValue(args.value.toString());
        }
    }).data("serenityRating");
    // Define icons instead of font with a count of 10 and step of 1.
    $("#iconRating").serenityRating({
        mode: "icon",
        count: 10,
        step: 1,
        icon: {
            width: 16,
            height: 16,
            availableClass: "rating-icon available-star",
            selectedClass: "rating-icon selected-star",
            highlightClass: "rating-icon highlight-star"
        },
        change: function (event, args) {
            printValue(args.value.toString());
        }
    }).data("serenityRating");
    // Define icons instead of font with a count of 10 and step of 1.
    $("#readonlyRating").serenityRating({
        mode: "icon",
        readonly: true,
        icon: {
            width: 16,
            height: 16,
            availableClass: "rating-icon available-star",
            selectedClass: "rating-icon selected-star",
            highlightClass: "rating-icon highlight-star"
        },
        change: function (event, args) {
            printValue(args.value.toString());
        }
    }).data("serenityRating");
});
//# sourceMappingURL=rating.basic.js.map