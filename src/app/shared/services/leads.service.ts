import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LeadsService {
  constructor(private _ApiService: ApiService) {}

  getLeads(page = 1): Observable<any> {
    return this._ApiService.postReq(`leads?page=${page}`, "");
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

  filterLeads(filter): Observable<any> {
    return this._ApiService.postReq("leads", filter);
  }

  exportLeads() {
    return this._ApiService.postReq("lead/exportLeads", "");
  }
}
