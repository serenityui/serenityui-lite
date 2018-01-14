/// <reference path="../../src/ts/serenityui.d.ts"/>

$(() => {
  class Employee extends serenity.Model {
    firstName: string = null;
    lastName: string = null;

    constructor(firstName: string, lastName: string) {
      super();

      this.initializeValues({firstName: firstName, lastName: lastName });
    }
    
    get fullName(): string {
      return serenity.format("{0} {1}", this.firstName, this.lastName);
    }
  }
    
  class EmployeeViewModel extends serenity.ViewModel {
    employee: Employee;
    
    constructor() {
      super();
    }
    
    resetName(): void {
      this.employee.rollback();
      this.trigger("change");
    }
  }
  
  let employeeViewModel = new EmployeeViewModel();
  
  employeeViewModel.employee = new Employee("Anthony", "Nelson");
  
  employeeViewModel.attach();
})
