import { Component, OnInit } from "@angular/core";
import { GuardService } from "app/shared/services/guard.service";
// import { MenuItem } from "primeng/api";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class?: string;
}

export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "nc-icon nc-bank" },
  { path: "/users", title: "Users", icon: "nc-icon nc-single-02" },
  { path: "/leads", title: "leads", icon: "nc-icon nc-diamond" },
  { path: "/operations", title: "Operations", icon: "nc-icon nc-atom" },
  { path: "/employees", title: "employees", icon: "fa-solid fa-id-card" },
  { path: "/customers", title: "customers", icon: "fa-solid fa-user-tie" },
  { path: "/owners", title: "owners", icon: "fa-solid fa-people-group" },
  { path: "/our-cars", title: "our-cars", icon: "fa-solid fa-car-side" },
  {
    path: "/car-price",
    title: "car-price",
    icon: "fa-solid fa-file-invoice-dollar",
  },
  { path: "/cars", title: "car settings", icon: "nc-icon nc-delivery-fast" },
  { path: "/insurances", title: "Insurance", icon: "nc-icon nc-caps-small" },
  { path: "/policy", title: "Policies", icon: "nc-icon nc-single-copy-04" },
  {
    path: "/sales-report",
    title: "sales-report",
    icon: "fa-solid fa-clipboard-list",
  },
  {
    path: "/operation-report",
    title: "operation-report",
    icon: "fa-solid fa-clipboard-list",
  },
  {
    path: "/car-maintenance",
    title: "car-maintenance",
    icon: "fa-solid fa-screwdriver-wrench",
  },
  { path: "/accounting", title: "Accounting", icon: "nc-icon nc-money-coins" },
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  constructor(private _GuardService: GuardService) {}

  isSuperAdmin: boolean = false;
  hasLeadRead: boolean = false;
  hasUserRead: boolean = false;
  hasOperationRead: boolean = false;
  hasEmployeesRead: boolean = false;
  hasCustomersRead: boolean = false;
  hasOwnersRead: boolean = false;
  hasOurCarsRead: boolean = false;
  hasCarPriceRead: boolean = false;
  hasCarSettingRead: boolean = false;
  hasInsuranceRead: boolean = false;
  hasPolicyRead: boolean = false;
  hasSalesReportRead: boolean = false;
  hasOperationReportRead: boolean = false;
  hasCarMaintenanceRead: boolean = false;
  hasAccountingRead: boolean = false;
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.isSuperAdmin = this._GuardService.isSuperAdmin();
    // if (this.isSuperAdmin) {
    // this.hasLeadRead = true;
    // this.hasUserRead = true;
    // } else {
    this.hasLeadRead = this._GuardService.hasLeadsPermission_Read();
    this.hasUserRead = this._GuardService.hasUsersPermission_Read();

    this.hasOperationRead = this._GuardService.hasOperationPermission_Read();
    this.hasEmployeesRead = this._GuardService.hasEmployeesPermission_Read();
    this.hasCustomersRead = this._GuardService.hasCustomersPermission_Read();
    this.hasOwnersRead = this._GuardService.hasOwnersPermission_Read();
    this.hasOurCarsRead = this._GuardService.hasOurCarsPermission_Read();
    this.hasCarPriceRead = this._GuardService.hasCarPricePermission_Read();
    this.hasCarSettingRead = this._GuardService.hasCarSettingsPermission_Read();
    this.hasInsuranceRead = this._GuardService.hasInsurancesPermission_Read();
    this.hasPolicyRead = this._GuardService.hasPolicyPermission_Read();
    this.hasSalesReportRead =
      this._GuardService.hasSalesReportPermission_Read();
    this.hasOperationReportRead =
      this._GuardService.hasOperationReportPermission_Read();
    this.hasCarMaintenanceRead =
      this._GuardService.hasCarMaintenancesPermission_Read();
    this.hasAccountingRead = this._GuardService.hasAccountingPermission_Read();

    // }

    // this.items = [
    //   {
    //     label: "Main",
    //     items: [
    //       {
    //         routerLink: "/dashboard",
    //         label: "dashboard",
    //         icon: "nc-icon nc-bank",
    //       },
    //       {
    //         routerLink: "/users",
    //         label: "users",
    //         icon: "nc-icon nc-single-02",
    //       },
    //       {
    //         routerLink: "/leads",
    //         label: "leads",
    //         icon: "nc-icon nc-diamond",
    //       },
    //     ],
    //   },
    //   {
    //     label: "Main",
    //     items: [
    //       {
    //         routerLink: "/dashboard",
    //         label: "dashboard",
    //         icon: "nc-icon nc-bank",
    //       },
    //       {
    //         routerLink: "/users",
    //         label: "users",
    //         icon: "nc-icon nc-single-02",
    //       },
    //       {
    //         routerLink: "/leads",
    //         label: "leads",
    //         icon: "nc-icon nc-diamond",
    //       },
    //     ],
    //   },
    // ];
  }

  // items: MenuItem[];
}
