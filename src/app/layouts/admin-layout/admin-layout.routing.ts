import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { CarsComponent } from "../../pages/cars/cars.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { LeadsComponent } from "../../pages/leads/leads.component";
import { CommingSoonComponent } from "../comming-soon/comming-soon.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "users", component: UserComponent },
  { path: "leads", component: LeadsComponent },
  { path: "cars", component: CarsComponent },

  { path: "accounting", component: CommingSoonComponent },
  { path: "policy", component: CommingSoonComponent },
  { path: "operations", component: CommingSoonComponent },
  { path: "insurances", component: CommingSoonComponent },
];
