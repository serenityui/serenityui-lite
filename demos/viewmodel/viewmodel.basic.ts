/// <reference path="../../src/ts/serenityui.d.ts"/>

$(() => {
    interface EmployeeParams {
      firstName: string;
      lastName: string;
      title: string;
      service: number;
    }
  
    class Employee extends serenity.Model implements EmployeeParams {
      firstName: string;
      lastName: string;
      title: string;
      service: number;

      constructor(params?: EmployeeParams) {
        super(params);

        this.firstName = params.firstName;
        this.lastName = params.lastName;
        this.title = params.title;
        this.service = params.service;
      }
      
      get fullName(): string {
        return serenity.format("{0} {1}", this.firstName, this.lastName);
      }
    }

    class EmployeeViewModel extends serenity.ViewModel {
      employee: Employee;
      titles: serenity.DataSource;

      constructor() {
        super();

        this.titles = new serenity.DataSource({
          data: [
            { title: "Network Engineer" },
            { title: "Software Engineer" },
            { title: "Project Manager" }
          ]
        });
      }
    }

    var employeeViewModel = new EmployeeViewModel();

    employeeViewModel.employee = new Employee({
      firstName: "Anthony",
      lastName: "Nelson",
      title: "Software Engineer",
      service: 4
    });

    employeeViewModel.employee.bind("change", () => {
      $("#employeeJson").text(JSON.stringify(employeeViewModel.employee.toJSON(), null, '  '));
    });

    $("#employeeJson").text(JSON.stringify(employeeViewModel.employee.toJSON(), null, '  '));

    employeeViewModel.attach($("#view"));
})
