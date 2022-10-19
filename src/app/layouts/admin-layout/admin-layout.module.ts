import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { PolicyComponent } from "../../pages/policy/policy.component";
import { OperationsComponent } from "../../pages/operations/operations.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { CarsComponent } from "../../pages/cars/cars.component";
import { InsuranceComponent } from "../../pages/insurance/insurance.component";
import { LeadsComponent } from "../../pages/leads/leads.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { OurCarsComponent } from "app/pages/our-cars/our-cars.component";
import { CarOwnersComponent } from "app/pages/car-owners/car-owners.component";
import { CustomersComponent } from "app/pages/customers/customers.component";
import { EmployeesComponent } from "app/pages/employees/employees.component";

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
    ConfirmDialogModule,
    InputSwitchModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    PolicyComponent,
    LeadsComponent,
    OperationsComponent,
    IconsComponent,
    CarsComponent,
    InsuranceComponent,
    EmployeesComponent,
    CustomersComponent,
    CarOwnersComponent,
    OurCarsComponent,
  ],
})
export class AdminLayoutModule {}
