/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>
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
    var EmployeeListViewModel = /** @class */ (function (_super) {
        __extends(EmployeeListViewModel, _super);
        function EmployeeListViewModel() {
            var _this = _super.call(this) || this;
            _this.employeeList = new serenity.DataSource({
                data: employees,
                trackChanges: false
            });
            _this.eventList = new serenity.DataSource({
                data: [],
                sort: { field: "id", dir: "desc" }
            });
            return _this;
        }
        EmployeeListViewModel.prototype.dataBound = function () {
            this.eventList.add({ id: (this.eventList.data().length + 1), description: "dataBound" });
        };
        EmployeeListViewModel.prototype.select = function (event, ui) {
            this.eventList.add({ id: (this.eventList.data().length + 1), description: serenity.format("select event raised for: {0}", ui.item.fullName) });
        };
        EmployeeListViewModel.prototype.modeChange = function (event, ui) {
            this.eventList.add({ id: (this.eventList.data().length + 1), description: serenity.format("modeChange event raised for mode changed to: {0}", ui.mode) });
        };
        EmployeeListViewModel.prototype.pageChange = function (event, ui) {
            this.eventList.add({ id: (this.eventList.data().length + 1), description: serenity.format("pageChange event raised for page changed from: {0} to: {1}", ui.page.before, ui.page.current) });
        };
        return EmployeeListViewModel;
    }(serenity.ViewModel));
    var employeeListViewModel = new EmployeeListViewModel();
    employeeListViewModel.attach();
});
//# sourceMappingURL=listview.mvvm.js.map