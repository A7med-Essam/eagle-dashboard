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
    if (!this.isSuperAdmin()) {
      if (this.user.permissions.length > 0) {
        this.user.permissions.includes(permission)
          ? (status = true)
          : (status = false);
      }
    } else {
      status = true;
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

  // Operation Permissions
  hasOperationPermission_Read() {
    return this.getPermissionStatus("read_operations");
  }

  // Employees Permissions
  hasEmployeesPermission_Read() {
    return this.getPermissionStatus("read_employees");
  }

  // customers Permissions
  hasCustomersPermission_Read() {
    return this.getPermissionStatus("read_customers");
  }

  // owners Permissions
  hasOwnersPermission_Read() {
    return this.getPermissionStatus("read_owners");
  }

  // OurCars Permissions
  hasOurCarsPermission_Read() {
    return this.getPermissionStatus("read_ourCars");
  }

  // CarPrice Permissions
  hasCarPricePermission_Read() {
    return this.getPermissionStatus("read_carPrices");
  }

  // CarSettings Permissions
  hasCarSettingsPermission_Read() {
    return this.getPermissionStatus("read_carSettings");
  }

  // Insurances Permissions
  hasInsurancesPermission_Read() {
    return this.getPermissionStatus("read_insurances");
  }

  // Policy Permissions
  hasPolicyPermission_Read() {
    return this.getPermissionStatus("read_policies");
  }

  // Sales report Permissions
  hasSalesReportPermission_Read() {
    return this.getPermissionStatus("read_salesReports");
  }

  // Operation Report Permissions
  hasOperationReportPermission_Read() {
    return this.getPermissionStatus("read_operationReports");
  }

  // car maintenance Permissions
  hasCarMaintenancesPermission_Read() {
    return this.getPermissionStatus("read_carMaintenances");
  }

  // Accounting Permissions
  hasAccountingPermission_Read() {
    return this.getPermissionStatus("read_accounting");
  }
}
