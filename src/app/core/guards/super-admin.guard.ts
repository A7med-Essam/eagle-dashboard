import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "app/shared/services/auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SuperAdminGuard implements CanActivate {
  constructor(private _AuthService: AuthService, private _Router: Router) {}
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
      role = res.role;
    });
    if (role == "super_admin") {
      return true;
    } else {
      this._Router.navigate(["/auth/login"]);
      return false;
    }
  }
}
