import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InsuranceAndPolicyService {
  constructor(private _ApiService: ApiService) {}

  getInsuranceCompanies(): Observable<any> {
    return this._ApiService.postReq(`getInsuranceCompanies`, "");
  }

  addInsuranceCompanies(insuraceInfo): Observable<any> {
    return this._ApiService.postReq(`addInsuranceCompanies`, insuraceInfo);
  }

  editInsuranceCompanies(insuraceInfo): Observable<any> {
    return this._ApiService.postReq(`updateInsuranceCompanies`, insuraceInfo);
  }

  addPolicyToInsuranceCompany(policy): Observable<any> {
    return this._ApiService.postReq(`addCompanyPolicy`, policy);
  }

  addClientInsuranceCompany(insuraceInfo): Observable<any> {
    return this._ApiService.postReq(`addClientCompany`, insuraceInfo);
  }

  getClientInsuranceCompany(): Observable<any> {
    return this._ApiService.postReq(`allClientCompany`, "");
  }

  // policies
  getPolicies(): Observable<any> {
    return this._ApiService.postReq(`policies`, "");
  }

  addPolicy(policy): Observable<any> {
    return this._ApiService.postReq(`addPolicy`, policy);
  }

  updatePolicy(policy): Observable<any> {
    return this._ApiService.postReq(`updatePolicy`, policy);
  }

  deletePolicy(policy_id): Observable<any> {
    return this._ApiService.postReq(`deletePolicy`, { policy_id: policy_id });
  }
}
