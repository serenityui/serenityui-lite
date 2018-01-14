/// <reference path="../../src/ts/serenityui.d.ts"/>
/// <reference path="../js/employees.ts"/>

$(() => {
  class EmployeeListViewModel extends serenity.ViewModel {
    employeeList: serenity.DataSource;
    
    eventList:  serenity.DataSource;

    constructor() {
      super();

      this.employeeList = new serenity.DataSource({
        data: employees,
        trackChanges: false
      });
      
      this.eventList = new serenity.DataSource({
        data: [],
        sort: { field: "id", dir: "desc" }
      });
    }
    
    dataBound(): void {
      this.eventList.add({ id: (this.eventList.data().length + 1), description: "dataBound" });
    }
    
    select(event: Event, ui: serenity.ListviewItemParams): void {
      this.eventList.add({ id: (this.eventList.data().length + 1), description: serenity.format("select event raised for: {0}", ui.item.fullName) });
    }
    
    modeChange(event: Event, ui: serenity.ListviewModeParams): void {
      this.eventList.add({ id: (this.eventList.data().length + 1), description: serenity.format("modeChange event raised for mode changed to: {0}", ui.mode) });
    }
    
    pageChange(event: Event, ui: serenity.ListviewPageParams): void {
      this.eventList.add({ id: (this.eventList.data().length + 1), description: serenity.format("pageChange event raised for page changed from: {0} to: {1}", ui.page.before, ui.page.current) });
    }
  }
  
  let employeeListViewModel: EmployeeListViewModel = new EmployeeListViewModel();
  
  employeeListViewModel.attach();
});
