$(function () {
  var Employee =  serenity.Model.extend({
    firstName: null,
    lastName: null,

    constructor: function (firstName, lastName) {
      serenity.Model.call(this);

      this.initializeValues({firstName: firstName, lastName: lastName });
    },
    
    fullName: {
      get: function() {
        return serenity.format("{0} {1}", this.firstName, this.lastName);
      }
    }
  });
    
  var EmployeeViewModel = serenity.ViewModel.extend({
    employee: null,
    
    resetName: function () {
      this.employee.rollback();
      this.trigger("change");
    }
  });
  
  var employeeViewModel = new EmployeeViewModel();
  
  employeeViewModel.employee = new Employee("Anthony", "Nelson");
  
  employeeViewModel.attach();
})
