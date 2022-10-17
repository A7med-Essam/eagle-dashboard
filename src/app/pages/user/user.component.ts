import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "user-cmp",
  moduleId: module.id,
  templateUrl: "user.component.html",
  providers: [ConfirmationService],
})
export class UserComponent implements OnInit {
  users: any[] = [];
  backUpUsers: any;

  @ViewChild("createForm") createForm;
  @ViewChild("editForm") editForm;
  @ViewChild("userTable") userTable;
  editUserForm: FormGroup = new FormGroup({});
  createAdminForm: FormGroup = new FormGroup({});
  public permissions: Array<any> = [];
  @ViewChild("AssignUsersForm") AssignUsersForm: HTMLFormElement;

  constructor(
    private _UsersService: UsersService,
    private _FormBuilder: FormBuilder,
    private _SharedService: SharedService,
    private _ConfirmationService: ConfirmationService,
    private _ToastrService: ToasterService
  ) {}

  ngOnInit() {
    this.getAdmins();
    this.setEditForm();
    this.setCreateForm();
    this.getPermissions();
  }

  getAdmins() {
    this._UsersService.getAdmins().subscribe((res) => {
      this.users = res.data;
      this.backUpUsers = res.data;
    });
  }

  deleteAdmin(user) {
    this._UsersService.deleteAdmin({ admin_id: user.id }).subscribe({
      next: (res) => {
        this.getAdmins();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  createAdmin(admin) {
    this._UsersService.createAdmin(admin.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getAdmins();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.createForm.nativeElement);
          this.fadeInUserTable();
        }
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getAdminForm() {
    this._SharedService.fadeOut(this.userTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.createForm.nativeElement);
    }, 800);
  }

  updateAdmin(user) {
    if (!user.value.password) this.editUserForm.removeControl("password");
    this._UsersService.updateAdmin(user.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getAdmins();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.editForm.nativeElement);
          this.fadeInUserTable();
        }
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  editAdmin(user) {
    this.setEditForm(user);
    this._SharedService.fadeOut(this.userTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.editForm.nativeElement);
    }, 800);
  }

  setEditForm(user?) {
    this.editUserForm = this._FormBuilder.group({
      admin_id: new FormControl(user?.id, [Validators.required]),
      email: new FormControl(user?.email),
      name: new FormControl(user?.name),
      password: new FormControl(null),
      permissions: new FormArray([]),
    });
  }

  setCreateForm() {
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
          value: `${e}_users`,
          type: "users",
        });
      });
      res.data.leads.forEach((e) => {
        this.permissions.push({
          description: e,
          value: `${e}_leads`,
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

  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteAdmin(id);
      },
    });
  }

  search(e: HTMLInputElement) {
    setTimeout(() => {
      if (e.value) {
        const val = e.value.toUpperCase();
        this.users = this.users.filter((user) => {
          if (user.name.toUpperCase().includes(val)) return user;
        });
      } else {
        this.users = this.backUpUsers;
      }
    }, 1);
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.createForm.nativeElement);
    this.fadeInUserTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.editForm.nativeElement);
    this.fadeInUserTable();
  }

  fadeInUserTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.userTable.nativeElement);
    }, 800);
  }

  getAssignedPermisstions() {
    const PermissionsList = this.editForm.nativeElement.querySelectorAll(
      "input[type='checkbox']"
    );
    const formArray: FormArray = this.editUserForm.get(
      "permissions"
    ) as FormArray;
    const [currentUser] = this.users.filter(
      (u) => u.id == this.editUserForm.value.admin_id
    );
    PermissionsList.forEach((e) => (e.checked = false));
    for (let i = 0; i < currentUser.my_permissions.length; i++) {
      for (let j = 0; j < PermissionsList.length; j++) {
        if (currentUser.my_permissions[i] == PermissionsList[j].value) {
          PermissionsList[j].checked = true;
          formArray.push(new FormControl(PermissionsList[j].value));
        }
      }
    }
  }
}
