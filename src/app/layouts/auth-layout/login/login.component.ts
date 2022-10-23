import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/shared/services/auth.service";
import { LocalService } from "app/shared/services/local.service";
import { ToasterService } from "app/shared/services/toaster.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  @ViewChild("LoginBtn") LoginBtn: any;

  constructor(
    private _FormBuilder: FormBuilder,
    private _Router: Router,
    private _AuthService: AuthService,
    private _ToastrService: ToasterService,
    private _LocalService: LocalService
  ) {
    if (this._LocalService.getJsonValue("userInfo") != null) {
      this._Router.navigate(["/dashboard"]);
    }
  }

  ngOnInit(): void {
    this.setLoginForm();
  }

  setLoginForm() {
    this.loginForm = this._FormBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit(data: FormGroup) {
    if (data.valid) {
      this.LoginBtn.nativeElement.innerHTML = `Loading <i class="fa-solid fa-circle-notch fa-spin ml-1"></i>`;
      this._AuthService.signIn(data.value).subscribe((res: any) => {
        if (res.status == 1) {
          this._ToastrService.setToaster(res.message, "success", "success");
          this._AuthService.saveUser(res.data);
          location.reload();
          this._Router.navigate(["/dashboard"]);
        } else {
          this._ToastrService.setToaster(res.message, "warning", "danger");
        }
        this.LoginBtn.nativeElement.innerHTML = `LOG IN`;
      });
    }
  }
}
