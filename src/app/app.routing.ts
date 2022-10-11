import { Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

export const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (x) => x.AdminLayoutModule
          ),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./layouts/auth-layout/auth/auth.module").then(
        (x) => x.AuthModule
      ),
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];
