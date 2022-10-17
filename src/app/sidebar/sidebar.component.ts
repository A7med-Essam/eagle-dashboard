import { Component, OnInit } from "@angular/core";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "nc-bank", class: "" },
  { path: "/users", title: "Users", icon: "nc-single-02", class: "" },
  { path: "/leads", title: "leads", icon: "nc-diamond", class: "" },
  { path: "/cars", title: "car settings", icon: "nc-delivery-fast", class: "" },

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
    path: "/accounting",
    title: "Accounting",
    icon: "nc-money-coins",
    class: "",
  },
  {
    path: "/policy",
    title: "Policies",
    icon: "nc-single-copy-04",
    class: "",
  },
  {
    path: "/operations",
    title: "Operations",
    icon: "nc-atom",
    class: "",
  },
  {
    path: "/insurances",
    title: "Insurance Companies",
    icon: "nc-caps-small",
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
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
}
