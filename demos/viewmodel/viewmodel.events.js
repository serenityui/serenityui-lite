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
        function Employee(firstName, lastName) {
            var _this = _super.call(this) || this;
            _this.firstName = null;
            _this.lastName = null;
            _this.initializeValues({ firstName: firstName, lastName: lastName });
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
            return _super.call(this) || this;
        }
        EmployeeViewModel.prototype.resetName = function () {
            this.employee.rollback();
            this.trigger("change");
        };
        return EmployeeViewModel;
    }(serenity.ViewModel));
    var employeeViewModel = new EmployeeViewModel();
    employeeViewModel.employee = new Employee("Anthony", "Nelson");
    employeeViewModel.attach();
});
//# sourceMappingURL=viewmodel.events.js.map