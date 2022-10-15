import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "app/shared/services/auth.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = "";
  // constructor(private _AuthService: AuthService) {
  //   _AuthService.currentUser.subscribe((res: any) => {
  //     res != null ? (this.token = res.token) : (this.token = "");
  //   });
  // }

  constructor(
    private _AuthService: AuthService,
    private _ToastrService: ToasterService,
    private _Router: Router
  ) {
    _AuthService.currentUser.subscribe((res: any) => {
      if (res == null) {
        this.token = "";
      } else {
        this.token = res.token;
        setTimeout(() => {
          this._AuthService.checkToken(this.token).subscribe((res) => {
            if (res.status == 0) {
              this._ToastrService.setToaster(
                "Your old session has been expired",
                "warning",
                "warning"
              ),
                this._AuthService.logOut();
              this._Router.navigate(["../auth/login"]);
            }
          });
        }, 1);
      }
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let HttpHeader;

    HttpHeader = request.clone({
      headers: request.headers
        .set("Accept", ["application/json"])
        .set("Authorization", `Bearer ${this.token}`),
    });
    return next.handle(HttpHeader);
  }
}
