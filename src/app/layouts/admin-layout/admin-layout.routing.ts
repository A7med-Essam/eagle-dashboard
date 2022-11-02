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
import { CarMaintenanceComponent } from "app/pages/car-maintenance/car-maintenance.component";
import { OperationReportComponent } from "app/pages/operation-report/operation-report.component";

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
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_carSettings"],
    },
  },
  {
    path: "operations",
    component: OperationsComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_operations"],
    },
  },
  {
    path: "policy",
    component: PolicyComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_policies"],
    },
  },
  {
    path: "insurances",
    component: InsuranceComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_insurances"],
    },
  },
  {
    path: "our-cars",
    component: OurCarsComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_ourCars"],
    },
  },
  {
    path: "owners",
    component: CarOwnersComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_owners"],
    },
  },
  {
    path: "employees",
    component: EmployeesComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_employees"],
    },
  },
  {
    path: "customers",
    component: CustomersComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_customers"],
    },
  },
  {
    path: "sales-report",
    component: SalesReportComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_salesReports"],
    },
  },

  {
    path: "accounting",
    component: CommingSoonComponent,
    // canActivate: [PermissionGuard],
    // data: {
    //   permission: ["read_accounting"],
    // },
  },
  {
    path: "operation-report",
    component: OperationReportComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_operationReports"],
    },
  },
  {
    path: "car-price",
    component: CarPriceComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_carPrices"],
    },
  },
  {
    path: "car-maintenance",
    component: CarMaintenanceComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ["read_carMaintenances"],
    },
  },
];
