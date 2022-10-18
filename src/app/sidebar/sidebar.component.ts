import { Component, OnInit } from "@angular/core";
import { GuardService } from "app/shared/services/guard.service";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "nc-icon nc-bank",
    class: "",
  },
  {
    path: "/accounting",
    title: "Accounting",
    icon: "nc-icon nc-money-coins",
    class: "",
  },
  { path: "/users", title: "Users", icon: "nc-icon nc-single-02", class: "" },
  { path: "/leads", title: "leads", icon: "nc-icon nc-diamond", class: "" },
  {
    path: "/cars",
    title: "car settings",
    icon: "nc-icon nc-delivery-fast",
    class: "",
  },

  // {
  //   path: "/notifications",
  //   title: "Notifications",
  //   icon: "nc-bell-55",
  //   class: "",
  // },
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   icon: "nc-caps-small",
  //   class: "",
  // },
  {
    path: "/operations",
    title: "Operations",
    icon: "nc-icon nc-atom",
    class: "",
  },
  {
    path: "/insurances",
    title: "Insurance",
    icon: "nc-icon nc-caps-small",
    class: "",
  },
  {
    path: "/policy",
    title: "Policies",
    icon: "nc-icon nc-single-copy-04",
    class: "",
  },

  {
    path: "/employees",
    title: "employees",
    icon: "fa-solid fa-id-card",
    class: "",
  },
  {
    path: "/customers",
    title: "customers",
    icon: "fa-solid fa-user-tie",
    class: "",
  },
  {
    path: "/car-owners",
    title: "car-owners",
    icon: "fa-solid fa-people-group",
    class: "",
  },
  {
    path: "/our-cars",
    title: "our-cars",
    icon: "fa-solid fa-car-side",
    class: "",
  },
  {
    path: "/sales-report",
    title: "sales-report",
    icon: "fa-solid fa-clipboard-list",
    class: "",
  },
  {
    path: "/operation-report",
    title: "operation-report",
    icon: "fa-solid fa-clipboard-list",
    class: "",
  },
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
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.isSuperAdmin = this._GuardService.isSuperAdmin();
    if (this.isSuperAdmin) {
      this.hasLeadRead = true;
    } else {
      this.hasLeadRead = this._GuardService.hasLeadsPermission_Read();
    }
  }
}
