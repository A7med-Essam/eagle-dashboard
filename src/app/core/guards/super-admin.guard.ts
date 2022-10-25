import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "app/shared/services/auth.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SuperAdminGuard implements CanActivate {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _ToasterService: ToasterService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let role: string = "";
    this._AuthService.currentUser.subscribe((res: any) => {
      role = res?.role;
    });
    if (role == "super_admin") {
      return true;
    } else {
      this._Router.navigate(["./dashboard"]);
      this._ToasterService.setToaster(
        "You don't have permission to access this page",
        "warning",
        "warning"
      );
      return false;
    }
  }
}
