/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="tree.items.ts"/>
$(function () {
    $("#tree").serenityTree({
        dataSource: new serenity.DataSource({
            data: items
        })
    });
});
//# sourceMappingURL=tree.basic.js.map