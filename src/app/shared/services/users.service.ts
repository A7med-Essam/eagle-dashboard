import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private _ApiService: ApiService) {}

  getAdmins(): Observable<any> {
    return this._ApiService.postReq("admins", "");
  }

  updateAdmin(user): Observable<any> {
    return this._ApiService.postReq("updateAdmin", user);
  }

  deleteAdmin(user): Observable<any> {
    return this._ApiService.postReq("deleteAdmin", user);
  }

  createAdmin(user): Observable<any> {
    return this._ApiService.postReq("adminRegister", user);
  }

  createSuperAdmin(user): Observable<any> {
    let headers = new HttpHeaders({ secretKey: "123456" });
    return this._ApiService.postReqWithHeader("register", user, headers);
  }

  updateSuperAdmin(user): Observable<any> {
    let headers = new HttpHeaders({ secretKey: "123456" });
    return this._ApiService.postReqWithHeader("updateAdmin", user, headers);
  }

  getPermissions(): Observable<any> {
    return this._ApiService.postReq("permissions", "");
  }
}
