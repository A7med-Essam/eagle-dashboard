import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthRoutingModule } from "./auth-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "../login/login.component";
import { ProfileComponent } from "app/pages/profile/profile.component";

@NgModule({
  declarations: [LoginComponent, ProfileComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule],
})
export class AuthModule {}
