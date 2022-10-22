import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "app/shared/services/auth.service";
import { GuardService } from "app/shared/services/guard.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PermissionGuard implements CanActivate {
  constructor(
    private _GuardService: GuardService,
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
    // return true;
    let role: string = "";
    this._AuthService.currentUser.subscribe((res: any) => {
      role = res?.role;
    });
    if (role == "super_admin") return true;
    if (this._GuardService.getPermissionStatus(route.data.permission[0]))
      return true;

    this._Router.navigate(["./dashboard"]);
    this._ToasterService.setToaster(
      "You don't have permission to access this page",
      "warning",
      "warning"
    );
    return false;
  }
}
