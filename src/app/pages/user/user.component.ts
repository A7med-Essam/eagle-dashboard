import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "app/shared/services/auth.service";
import { GuardService } from "app/shared/services/guard.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";
import { ConfirmationService, MenuItem } from "primeng/api";

@Component({
  selector: "user-cmp",
  moduleId: module.id,
  templateUrl: "user.component.html",
  providers: [ConfirmationService],
})
export class UserComponent implements OnInit {
  users: any[] = [];
  superAdmins: any[] = [];
  backUpUsers: any;
  backUpSuperAdmins: any;
  @ViewChild("createForm") createForm;
  @ViewChild("createForm2") createForm2;
  @ViewChild("editForm") editForm;
  @ViewChild("editForm2") editForm2;
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
    private _ToastrService: ToasterService,
    private _AuthService: AuthService,
    private _GuardService: GuardService
  ) {}

  // enableSuperAdmin: boolean = false;
  items: MenuItem[];

  ngOnInit() {
    this.getAdmins();
    this.getSuperAdmins();
    this.setEditForm();
    this.setCreateForm();
    this.getPermissions();
    this.setPermissions();

    this.items = [
      { label: "Home", icon: "pi pi-fw pi-home" },
      { label: "Calendar", icon: "pi pi-fw pi-calendar" },
      { label: "Edit", icon: "pi pi-fw pi-pencil" },
      { label: "Documentation", icon: "pi pi-fw pi-file" },
      { label: "Settings", icon: "pi pi-fw pi-cog" },
    ];
  }

  // Permissions
  read: boolean = true;
  create: boolean = true;
  update: boolean = true;
  delete: boolean = true;
  isSuperAdmin: boolean = false;
  setPermissions() {
    this.read = this._GuardService.hasUsersPermission_Read();
    this.create = this._GuardService.hasUsersPermission_Create();
    this.update = this._GuardService.hasUsersPermission_Update();
    this.delete = this._GuardService.hasUsersPermission_Delete();

    this.isSuperAdmin = this._GuardService.isSuperAdmin();

    // if (this._GuardService.isSuperAdmin()) {
    //   this.read = true;
    //   this.create = true;
    //   this.update = true;
    //   this.delete = true;
    //   this.isSuperAdmin = true;
    // }
  }

  getAdmins() {
    this._UsersService.getAdmins().subscribe((res) => {
      this.users = res.data;
      this.backUpUsers = res.data;
    });
  }

  getSuperAdmins() {
    this._UsersService.getSuperAdmins().subscribe((res) => {
      this.superAdmins = res.data;
      this.backUpSuperAdmins = res.data;
    });
  }

  deleteAdmin(user) {
    this._UsersService.deleteAdmin({ admin_id: user.id }).subscribe({
      next: (res) => {
        this.getAdmins();
        this.getSuperAdmins();
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
          this.setCreateForm();
          this.createAdminForm.reset();
          this.resetPermissions();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  createSuperAdmin(admin) {
    this._UsersService.createSuperAdmin(admin.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getSuperAdmins();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.createForm2.nativeElement);
          this.fadeInUserTable();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getAdminForm() {
    this.setCreateForm();
    this._SharedService.fadeOut(this.userTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.createForm.nativeElement);
    }, 800);
  }

  displaySuperAdminForm() {
    this.setCreateSuperAdminForm();
    this._SharedService.fadeOut(this.userTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.createForm2.nativeElement);
    }, 800);
  }

  updateAdmin(user) {
    if (!user.value.password) this.editUserForm.removeControl("password");
    this._UsersService.updateAdmin(user.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.setCurrentUser(res.data);
          this.getSuperAdmins();
          this.getAdmins();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.editForm.nativeElement);
          this._SharedService.fadeOut(this.editForm2.nativeElement);
          this.fadeInUserTable();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  setCurrentUser(user) {
    if (this._GuardService.user.id == user.id) {
      this._AuthService.saveUser(user);
      this.setPermissions();
    }
  }

  editAdmin(user) {
    this.setEditForm(user);
    this._SharedService.fadeOut(this.userTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.editForm.nativeElement);
    }, 800);
  }

  displayEditSuperAdmin(user) {
    this.setEditSuperAdminForm(user);
    this._SharedService.fadeOut(this.userTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.editForm2.nativeElement);
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
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      password_confirmation: new FormControl(null, [Validators.required]),
      permissions: new FormArray([], [Validators.required]),
    });
  }

  setCreateSuperAdminForm() {
    this.createAdminForm = this._FormBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      password_confirmation: new FormControl(null, [Validators.required]),
    });
  }

  setEditSuperAdminForm(user?) {
    this.editUserForm = this._FormBuilder.group({
      admin_id: new FormControl(user?.id, [Validators.required]),
      email: new FormControl(user?.email),
      name: new FormControl(user?.name),
      password: new FormControl(null),
    });
  }

  getPermissions() {
    this._UsersService.getPermissions().subscribe((res) => {
      this.setPermission(res.data.users, "users");
      this.setPermission(res.data.leads, "leads");
      this.setPermission(res.data.operations, "operations");
      this.setPermission(res.data.employees, "employees");
      this.setPermission(res.data.customers, "customers");
      this.setPermission(res.data.owners, "owners");
      this.setPermission(res.data.ourCars, "ourCars");
      this.setPermission(res.data.carPrices, "carPrices");
      this.setPermission(res.data.carSettings, "carSettings");
      this.setPermission(res.data.insurances, "insurances");
      this.setPermission(res.data.policies, "policies");
      this.setPermission(res.data.salesReports, "salesReports");
      this.setPermission(res.data.operationReports, "operationReports");
      this.setPermission(res.data.carMaintenances, "carMaintenances");
    });
  }

  setPermission(data, permission) {
    data.forEach((e) => {
      this.permissions.push({
        description: e,
        value: `${e}_${permission}`,
        type: permission,
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

  search2(e: HTMLInputElement) {
    setTimeout(() => {
      if (e.value) {
        const val = e.value.toUpperCase();
        this.superAdmins = this.superAdmins.filter((user) => {
          if (user.name.toUpperCase().includes(val)) return user;
        });
      } else {
        this.superAdmins = this.backUpSuperAdmins;
      }
    }, 1);
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.createForm.nativeElement);
    this.fadeInUserTable();
  }

  backCreateBtn2() {
    this._SharedService.fadeOut(this.createForm2.nativeElement);
    this.fadeInUserTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.editForm.nativeElement);
    this.fadeInUserTable();
  }

  backEditBtn2() {
    this._SharedService.fadeOut(this.editForm2.nativeElement);
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
    for (let i = 0; i < currentUser?.my_permissions.length; i++) {
      for (let j = 0; j < PermissionsList.length; j++) {
        if (currentUser?.my_permissions[i] == PermissionsList[j].value) {
          PermissionsList[j].checked = true;
          formArray.push(new FormControl(PermissionsList[j].value));
        }
      }
    }
  }

  resetPermissions() {
    const PermissionsList = this.createForm.nativeElement.querySelectorAll(
      "input[type='checkbox']"
    );

    for (let j = 0; j < PermissionsList.length; j++) {
      PermissionsList[j].checked = false;
    }
  }

  upgradeToSuperAdmin(admin) {
    this._UsersService.promoteAdmin(admin.id).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.getAdmins();
          this.getSuperAdmins();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  downgradeSuperAdmin(admin) {
    this._UsersService.unPromoteAdmin(admin.id).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.getAdmins();
          this.getSuperAdmins();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }
}
