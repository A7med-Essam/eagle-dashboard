import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LeadsService {
  constructor(private _ApiService: ApiService) {}

  getLeads(): Observable<any> {
    return this._ApiService.postReq("leads", "");
  }

  getLeadsById(lead_id): Observable<any> {
    return this._ApiService.postReq("leads/show", lead_id);
  }

  createLeads(lead): Observable<any> {
    return this._ApiService.postReq("leads/create", lead);
  }

  updateLeads(lead): Observable<any> {
    return this._ApiService.postReq("leads/update", lead);
  }

  deleteLeads(lead_id): Observable<any> {
    return this._ApiService.postReq("leads/delete", { lead_id: lead_id });
  }

  replayLeads(replay): Observable<any> {
    return this._ApiService.postReq("leads/replay", replay);
  }

  assignAdminsByLeadsId(Admins): Observable<any> {
    return this._ApiService.postReq("leads/assign", Admins);
  }

  getRepliesByLeadsId(lead_id): Observable<any> {
    return this._ApiService.postReq("leads/replies", lead_id);
  }
}
