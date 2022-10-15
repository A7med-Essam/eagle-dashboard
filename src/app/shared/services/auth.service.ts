import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "app/core/services/api.service";
import { BehaviorSubject, Observable } from "rxjs";
import { LocalService } from "./local.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private _Router: Router,
    private _LocalService: LocalService,
    private _ApiService: ApiService
  ) {
    if (this._LocalService.getJsonValue("userInfo") != null) {
      this.currentUser.next(this._LocalService.getJsonValue("userInfo"));
    }
  }

  // signUp(signUpData:any): Observable<any> {
  //   return this._ApiService.postReq('register',signUpData)
  // }

  registerAdmin(signUpData: any): Observable<any> {
    return this._ApiService.postReq("adminRegister", signUpData);
  }

  signIn(signInData: any): Observable<any> {
    return this._ApiService.postReq("login", signInData);
  }

  saveUser(user: any) {
    let userData: any = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: user.access_token,
      image: user.image,
      role: user.my_role,
      permissions: user.my_permissions,
    };
    this._LocalService.setJsonValue("userInfo", userData);
    this.currentUser.next(userData);
  }

  logOut() {
    this.currentUser.next(null);
    this._LocalService.removeItem("userInfo");
    this._Router.navigate(["./auth/login"]);
  }

  // resetPassword_profile(password:any): Observable<any>{
  //   return this._ApiService.postReq('resetPassword',password)
  // }

  // sendResetMail(email:string): Observable<any>{
  //   return this._ApiService.postReq('sendResetMail',{email:email})
  // }

  // resetPassword(newPassword:any): Observable<any>{
  //   return this._ApiService.postReq('getResetMail',newPassword);
  // }

  checkToken(token: string): Observable<any> {
    return this._ApiService.postReq("checkToken", { token: token });
  }
}
