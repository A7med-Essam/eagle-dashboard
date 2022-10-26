import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { PolicyComponent } from "../../pages/policy/policy.component";
import { OperationsComponent } from "../../pages/operations/operations.component";
import { CarsComponent } from "../../pages/cars/cars.component";
import { InsuranceComponent } from "../../pages/insurance/insurance.component";
import { LeadsComponent } from "../../pages/leads/leads.component";
import { CommingSoonComponent } from "../comming-soon/comming-soon.component";
import { SuperAdminGuard } from "app/core/guards/super-admin.guard";
import { OurCarsComponent } from "app/pages/our-cars/our-cars.component";
import { CarOwnersComponent } from "app/pages/car-owners/car-owners.component";
import { EmployeesComponent } from "app/pages/employees/employees.component";
import { CustomersComponent } from "app/pages/customers/customers.component";
import { PermissionGuard } from "app/core/guards/permission.guard";
import { SalesReportComponent } from "app/pages/sales-report/sales-report.component";
import { CarPriceComponent } from "app/pages/car-price/car-price.component";

export const AdminLayoutRoutes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "users",
    component: UserComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_users"],
    },
  },
  {
    path: "leads",
    component: LeadsComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_leads"],
    },
  },
  {
    path: "cars",
    component: CarsComponent,
  },
  {
    path: "operations",
    component: OperationsComponent,
    canActivate: [SuperAdminGuard],
  },
  {
    path: "policy",
    component: PolicyComponent,
  },
  {
    path: "insurances",
    component: InsuranceComponent,
  },
  {
    path: "our-cars",
    component: OurCarsComponent,
    canActivate: [SuperAdminGuard],
  },
  {
    path: "car-owners",
    component: CarOwnersComponent,
    canActivate: [SuperAdminGuard],
  },
  {
    path: "employees",
    component: EmployeesComponent,
    canActivate: [SuperAdminGuard],
  },
  {
    path: "customers",
    component: CustomersComponent,
    canActivate: [SuperAdminGuard],
  },
  {
    path: "sales-report",
    component: SalesReportComponent,
    canActivate: [SuperAdminGuard],
  },

  {
    path: "accounting",
    component: CommingSoonComponent,
    canActivate: [SuperAdminGuard],
  },
  {
    path: "operation-report",
    component: CommingSoonComponent,
    canActivate: [SuperAdminGuard],
  },
  {
    path: "car-price",
    component: CarPriceComponent,
    canActivate: [SuperAdminGuard],
  },
];
