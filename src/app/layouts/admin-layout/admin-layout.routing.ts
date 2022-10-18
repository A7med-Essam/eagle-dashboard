import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { OperationsComponent } from "../../pages/operations/operations.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { CarsComponent } from "../../pages/cars/cars.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { LeadsComponent } from "../../pages/leads/leads.component";
import { CommingSoonComponent } from "../comming-soon/comming-soon.component";
import { SuperAdminGuard } from "app/core/guards/super-admin.guard";
import { AuthGuard } from "app/core/guards/auth.guard";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  {
    path: "users",
    component: UserComponent,
    // canActivate: [AuthGuard, SuperAdminGuard],
  },
  { path: "leads", component: LeadsComponent },
  { path: "cars", component: CarsComponent },
  { path: "operations", component: OperationsComponent },

  { path: "policy", component: CommingSoonComponent },
  { path: "insurances", component: CommingSoonComponent },
  { path: "accounting", component: CommingSoonComponent },
];
