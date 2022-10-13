import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { CarsComponent } from "../../pages/cars/cars.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { LeadsComponent } from "../../pages/leads/leads.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    LeadsComponent,
    TypographyComponent,
    IconsComponent,
    CarsComponent,
    NotificationsComponent,
  ],
})
export class AdminLayoutModule {}
