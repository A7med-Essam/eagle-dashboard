import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from "./sidebar/sidebar.module";
import { FooterModule } from "./shared/footer/footer.module";
import { NavbarModule } from "./shared/navbar/navbar.module";
import { FixedPluginModule } from "./shared/fixedplugin/fixedplugin.module";

import { AppComponent } from "./app.component";
import { AppRoutes } from "./app.routing";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./core/interceptor/http.interceptor";
import { Error404Component } from "./layouts/error-layout/error404/error404.component";
import { Error500Component } from "./layouts/error-layout/error500/error500.component";
import { CommingSoonComponent } from "./layouts/comming-soon/comming-soon.component";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ngxUiLoaderConfig } from "./shared/models/ngxUiLoaderConfig";

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    Error404Component,
    Error500Component,
    CommingSoonComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true,
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    SidebarModule,
    HttpClientModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
