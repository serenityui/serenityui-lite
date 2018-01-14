/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="tree.items.ts"/>

$(() => {
    $("#tree").serenityTree({
        dataSource: new serenity.DataSource({
            data: items
        })
    });
});
