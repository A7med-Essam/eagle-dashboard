import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { PolicyComponent } from "../../pages/policy/policy.component";
import { OperationsComponent } from "../../pages/operations/operations.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { CarsComponent } from "../../pages/cars/cars.component";
import { InsuranceComponent } from "../../pages/insurance/insurance.component";
import { LeadsComponent } from "../../pages/leads/leads.component";
import { CommingSoonComponent } from "../comming-soon/comming-soon.component";
import { SuperAdminGuard } from "app/core/guards/super-admin.guard";
import { AuthGuard } from "app/core/guards/auth.guard";
import { OurCarsComponent } from "app/pages/our-cars/our-cars.component";
import { CarOwnersComponent } from "app/pages/car-owners/car-owners.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "users", component: UserComponent, canActivate: [SuperAdminGuard] },
  { path: "leads", component: LeadsComponent },
  { path: "cars", component: CarsComponent },
  { path: "operations", component: OperationsComponent },
  { path: "policy", component: PolicyComponent },
  { path: "insurances", component: InsuranceComponent },
  { path: "our-cars", component: OurCarsComponent },
  { path: "car-owners", component: CarOwnersComponent },

  { path: "accounting", component: CommingSoonComponent },
  { path: "employees", component: CommingSoonComponent },
  { path: "customers", component: CommingSoonComponent },
  { path: "sales-report", component: CommingSoonComponent },
  { path: "operation-report", component: CommingSoonComponent },
];
