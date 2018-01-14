/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
$(function () {
    var table = null;
    var employeesDS = new serenity.DataSource({
        data: employees,
        filter: [{ field: "title", operator: "contains", value: "Software" }]
    });
    var employeeTemplate = Handlebars.compile($("#employeeDetailsTemplate").html(), { noEscape: true });
    var router = new serenity.Router({ root: "/" });
    // Define the "home" route.
    router.add("/", function () {
        // Hide all the pages.
        $(".demo-page").hide();
        // Show the home page.
        $("#home").show();
    });
    // Define the "list" route.
    router.add("/list", function () {
        // Hide all the pages.
        $(".demo-page").hide();
        // If the table widget hasn't been initialized yet.
        if (table === null) {
            // Initialize the table widget.
            table = $("#employeesList").serenityTable({
                dataSource: employeesDS,
                columns: [{
                        title: "",
                        field: "id",
                        template: Handlebars.compile("<button class='demo-view-item ui-button' data-id='{{id}}'>Details</button>", { noEscape: true }),
                        width: "75px"
                    }, {
                        title: "Name",
                        field: "fullName",
                        width: "175px"
                    }, {
                        title: "Title",
                        field: "title",
                        width: "350px"
                    }],
                height: "140px"
            }).data("serenityTable");
        }
        $("#list").show();
    });
    // Define the employee details route.
    router.add("details/:id", function (params) {
        // Hide all the pages.
        $(".demo-page").hide();
        // Get the employee for the id that was passed into the route.
        var employee = employeesDS.view().Where(function (e) { return e.id == params.id; }).First();
        // Render the employee details.
        $("#employeeDetails").html(employeeTemplate(employee));
        // Show the employee details page.
        $("#details").show();
    });
    // Start the router.
    router.start();
    $("#showListPage").on("click", function () {
        router.navigate("/list");
    });
    $("#employeesList").on("click", ".demo-view-item", function (event) {
        var itemId = $(event.target).attr("data-id");
        router.navigate(serenity.format("/details/{0}", itemId));
    });
});
//# sourceMappingURL=router.basic.js.map