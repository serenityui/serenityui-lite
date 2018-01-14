$(function () {
    var html =  
        "<div style='margin-bottom:20px;'>" +
            "<select id='themes' style='width:200px;'>" +
            "</select>" +
        "</div>";

    $("body").prepend(html);

    var themes = $("#themes").serenityDropdownlist({
        dataSource: new serenity.DataSource({
            data: [
                { text: "Base", value: "base" },
                { text: "Black Tie", value: "black-tie" },
                { text: "Blitzer", value: "blitzer" },
                { text: "Cupertino", value: "cupertino" },
                { text: "Dark Hive", value: "dark-hive" },
                { text: "Dot Luv", value: "dot-luv" },
                { text: "Eggplant", value: "eggplant" },
                { text: "Excite Bike", value: "excite-bike" },
                { text: "Flick", value: "flick" },
                { text: "Hot Sneaks", value: "hot-sneaks" },
                { text: "Humanity", value: "humanity" },
                { text: "Le Frog", value: "le-frog" },
                { text: "Mint Choc", value: "mint-choc" },
                { text: "Overcast", value: "overcast" },
                { text: "Pepper Grinder", value: "pepper-grinder" },
                { text: "Redmond", value: "redmond" },
                { text: "Smoothness", value: "smoothness" },
                { text: "South Street", value: "south-street" },
                { text: "Start", value: "start" },
                { text: "Sunny", value: "sunny" },
                { text: "Swanky Purse", value: "swanky-purse" },
                { text: "Trontastic", value: "trontastic" },
                { text: "UI Darkness", value: "ui-darkness" },
                { text: "UI Lightness", value: "ui-lightness" },
                { text: "Vader", value: "vader" },
            ]
        }),
        height: 250,
        change: function () {
            var theme = themes.dataItem().value;
            $("#serenityTheme").attr("href", serenity.format("../../css/themes/{0}/serenityui.css", theme));
            if (typeof onThemeChange !== "undefined") onThemeChange(theme);
        }
    }).data("serenityDropdownlist");
})