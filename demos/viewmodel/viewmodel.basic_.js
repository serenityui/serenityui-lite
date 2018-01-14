$(function() {
    var Employee = serenity.Model.extend({
      firstName: null,
      lastName: null,
      title: null,
      service: null,

      fullName: {
        get: function () {
          return serenity.format("{0} {1}", this.firstName, this.lastName);
        }
      }
    });

    var EmployeeViewModel = serenity.ViewModel.extend({
      employee: null,
      titles: null,

      constructor: function (options) {

        serenity.ViewModel.call(this, options);

        this.titles = new serenity.DataSource({
          data: [
            { title: "Network Engineer" },
            { title: "Software Engineer" },
            { title: "Project Manager" }
          ]
        });
      }
    });

    var employeeViewModel = new EmployeeViewModel();

    employeeViewModel.employee = new Employee({
      firstName: "Anthony",
      lastName: "Nelson",
      title: "Software Engineer",
      service: 4
    });

    employeeViewModel.employee.bind("change", function () {
      $("#employeeJson").text(JSON.stringify(employeeViewModel.employee.toJSON(), null, '  '));
    });

    $("#employeeJson").text(JSON.stringify(employeeViewModel.employee.toJSON(), null, '  '));

    employeeViewModel.attach($("#view"));
});
