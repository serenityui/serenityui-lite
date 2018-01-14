/// <reference path="../../src/ts/serenityui.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
$(function () {
    var Employee = /** @class */ (function (_super) {
        __extends(Employee, _super);
        function Employee(params) {
            var _this = _super.call(this, params) || this;
            _this.firstName = params.firstName;
            _this.lastName = params.lastName;
            _this.title = params.title;
            _this.service = params.service;
            return _this;
        }
        Object.defineProperty(Employee.prototype, "fullName", {
            get: function () {
                return serenity.format("{0} {1}", this.firstName, this.lastName);
            },
            enumerable: true,
            configurable: true
        });
        return Employee;
    }(serenity.Model));
    var EmployeeViewModel = /** @class */ (function (_super) {
        __extends(EmployeeViewModel, _super);
        function EmployeeViewModel() {
            var _this = _super.call(this) || this;
            _this.titles = new serenity.DataSource({
                data: [
                    { title: "Network Engineer" },
                    { title: "Software Engineer" },
                    { title: "Project Manager" }
                ]
            });
            return _this;
        }
        return EmployeeViewModel;
    }(serenity.ViewModel));
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
//# sourceMappingURL=viewmodel.basic.js.map