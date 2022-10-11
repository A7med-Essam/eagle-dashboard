import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "app/shared/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = "";
  constructor(private _AuthService: AuthService) {
    _AuthService.currentUser.subscribe((res: any) => {
      res != null ? (this.token = res.token) : (this.token = "");
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
