import { Injectable } from "@angular/core";
import { LocalService } from "./local.service";

@Injectable({
  providedIn: "root",
})
export class GuardService {
  user;
  constructor(private _LocalService: LocalService) {
    this.getUser();
  }

  getUser() {
    if (this._LocalService.getJsonValue("userInfo") != null) {
      this.user = this._LocalService.getJsonValue("userInfo");
    }
  }

  getPermissionStatus(permission: string) {
    this.getUser();
    let status;
    if (this.user.permissions.length > 0) {
      this.user.permissions.includes(permission)
        ? (status = true)
        : (status = false);
    }
    return status;
  }

  isSuperAdmin() {
    return this.user?.role == "super_admin" ? true : false;
  }

  // Users Permissions
  hasUsersPermission_Read() {
    return this.getPermissionStatus("read_users");
  }

  hasUsersPermission_Create() {
    return this.getPermissionStatus("create_users");
  }

  hasUsersPermission_Update() {
    return this.getPermissionStatus("update_users");
  }

  hasUsersPermission_Delete() {
    return this.getPermissionStatus("delete_users");
  }

  // Leads Permissions
  hasLeadsPermission_Read() {
    return this.getPermissionStatus("read_leads");
  }

  hasLeadsPermission_Create() {
    return this.getPermissionStatus("create_leads");
  }

  hasLeadsPermission_Update() {
    return this.getPermissionStatus("update_leads");
  }

  hasLeadsPermission_Delete() {
    return this.getPermissionStatus("delete_leads");
  }

  hasLeadsPermission_MakeReplay() {
    return this.getPermissionStatus("makeReplay_leads");
  }

  hasLeadsPermission_SeeReplay() {
    return this.getPermissionStatus("seeReplay_leads");
  }
}
