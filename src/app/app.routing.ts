import { Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { Error404Component } from "./layouts/error-layout/error404/error404.component";
import { Error500Component } from "./layouts/error-layout/error500/error500.component";

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
    path: "error",
    component: Error500Component,
  },
  {
    path: "**",
    component: Error404Component,
  },
];
