import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";

@Component({
  selector: "user-cmp",
  moduleId: module.id,
  templateUrl: "user.component.html",
})
export class UserComponent implements OnInit {
  users: any[];
  @ViewChild("adminForm") adminForm;
  @ViewChild("userForm") userForm;
  @ViewChild("userTable") userTable;
  editUserForm: FormGroup = new FormGroup({});
  createAdminForm: FormGroup = new FormGroup({});
  public permissions: Array<any> = [];

  constructor(
    private _UsersService: UsersService,
    private _FormBuilder: FormBuilder,
    private _ToastrService: ToasterService
  ) {}

  ngOnInit() {
    this.getAdmins();
    this.setUserForm();
    this.setAdminForm();
    this.getPermissions();
  }

  getAdmins() {
    this._UsersService.getAdmins().subscribe((res) => {
      this.users = res.data;
    });
  }

  deleteAdmin(user) {
    this._UsersService
      .deleteAdmin({ admin_id: user.id })
      .subscribe((res) => this.getAdmins());
  }

  createAdmin(admin) {
    this._UsersService.createAdmin(admin.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getAdmins();
          this._ToastrService.setToaster(res.message, "success", "success");
          this.fadeOut(this.userForm.nativeElement);
          setTimeout(() => {
            this.fadeIn(this.userTable.nativeElement);
          }, 800);
        }
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "warning", "warning"),
    });
  }

  getAdminForm() {
    this.fadeOut(this.userTable.nativeElement);
    setTimeout(() => {
      this.fadeIn(this.adminForm.nativeElement);
    }, 800);
  }

  updateAdmin(user) {
    if (!user.value.password) this.editUserForm.removeControl("password");
    if (!user.value.permissions.length)
      this.editUserForm.removeControl("permissions");
    this._UsersService.updateAdmin(user.value).subscribe((res) => {
      if (res.status == 1) {
        this.getAdmins();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.fadeOut(this.userForm.nativeElement);
        setTimeout(() => {
          this.fadeIn(this.userTable.nativeElement);
        }, 800);
      }
    });
  }

  editAdmin(user) {
    this.setUserForm(user);
    this.fadeOut(this.userTable.nativeElement);
    setTimeout(() => {
      this.fadeIn(this.userForm.nativeElement);
    }, 800);
  }

  fadeIn(e: HTMLElement) {
    e.classList.add("fadeIn");
    e.classList.remove("fadeOut");
    e.classList.remove("d-none");
  }

  fadeOut(e: HTMLElement) {
    e.classList.add("fadeOut");
    e.classList.remove("fadeIn");
    setTimeout(() => {
      e.classList.add("d-none");
    }, 800);
  }

  setUserForm(user?) {
    this.editUserForm = this._FormBuilder.group({
      admin_id: new FormControl(user?.id, [Validators.required]),
      email: new FormControl(user?.email),
      name: new FormControl(user?.name),
      password: new FormControl(null),
      permissions: new FormArray([]),
    });
  }

  setAdminForm() {
    this.createAdminForm = this._FormBuilder.group({
      name: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
      password_confirmation: new FormControl(null),
      permissions: new FormArray([]),
    });
  }

  getPermissions() {
    this._UsersService.getPermissions().subscribe((res) => {
      res.data.users.forEach((e) => {
        this.permissions.push({
          description: e,
          value: `users_${e}`,
          type: "users",
        });
      });
      res.data.leads.forEach((e) => {
        this.permissions.push({
          description: e,
          value: `leads_${e}`,
          type: "leads",
        });
      });
    });
  }

  onCheckChange(event, status: string = "edit") {
    let formArray: FormArray;
    if (status == "edit") {
      formArray = this.editUserForm.get("permissions") as FormArray;
    } else {
      formArray = this.createAdminForm.get("permissions") as FormArray;
    }

    if (event.target.checked)
      formArray.push(new FormControl(event.target.value));
    else {
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}
