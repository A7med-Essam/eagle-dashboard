import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarService } from "app/shared/services/car.service";
import { LeadsService } from "app/shared/services/leads.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";

@Component({
  selector: "leads-cmp",
  moduleId: module.id,
  templateUrl: "leads.component.html",
})
export class LeadsComponent implements OnInit {
  pagination: any;
  leads: any[] = [];
  insurance: any[] = [];
  grade: any[] = [];
  gearType: any[] = [];
  carModel: any[] = [];
  carType: any[] = [];
  carName: any[] = [];
  carColor: any[] = [];
  selectedGrade: any;
  selectedCarModel: any;
  selectedGearType: any;
  selectedInsurance: any;
  currentLead: any;

  @ViewChild("LeadsTable") LeadsTable;
  @ViewChild("ShowLead") ShowLead;
  @ViewChild("AddLeadForm") AddLeadForm;

  createLeadForm: FormGroup = new FormGroup({});

  constructor(
    private _LeadsService: LeadsService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _CarService: CarService,
    private _FormBuilder: FormBuilder
  ) {
    this.insurance = [
      { name: "Yes", value: "YES" },
      { name: "No", value: "NO" },
    ];

    this.gearType = [
      { name: "Automatic", value: "AUTOMATIC" },
      { name: "Normal", value: "NORMAL" },
    ];

    this.grade = [
      { name: "Grade 1", value: "1" },
      { name: "Grade 2", value: "2" },
      { name: "Grade 3", value: "3" },
      { name: "Grade 4", value: "4" },
      { name: "Grade 5", value: "5" },
      { name: "TOP LINE", value: "TOP LINE" },
    ];

    const currentYear = new Date().getFullYear() + 1;
    for (let i = 2015; i <= currentYear; i++) {
      this.carModel.push({ name: `Model ${i}`, value: i });
    }
    this.selectedGrade = this.grade[0];
    this.selectedInsurance = this.insurance[0];
    this.selectedCarModel = this.carModel[0];
    this.selectedGearType = this.gearType[0];
  }

  ngOnInit() {
    this.getAllLeads();
    this.setLeadForm();
    this.getCarName();
    this.getCarColor();
    this.getCarType();
  }

  getAllLeads() {
    this._LeadsService.getLeads().subscribe({
      next: (res) => {
        this.leads = res.data.data;
        this.pagination = res.data;
        // this.pagination.totalPages = Math.ceil(
        //   this.pagination.total / this.pagination.per_page
        // );
      },
    });
  }

  loadPage(page: number) {
    // this.getAllLeads();
    console.log(page);
  }

  getLeadById(id) {
    [this.currentLead] = this.leads.filter((lead) => lead.id == id);
    console.log(this.currentLead);
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.ShowLead.nativeElement);
    }, 800);
  }

  deleteLead(id) {
    this._LeadsService.deleteLeads(id).subscribe({
      next: (res) => {
        this.getAllLeads();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  createLead(form) {
    this._LeadsService.createLeads(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getAllLeads();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.AddLeadForm.nativeElement);
          setTimeout(() => {
            this._SharedService.fadeIn(this.LeadsTable.nativeElement);
          }, 800);
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  setLeadForm() {
    this.createLeadForm = this._FormBuilder.group({
      customer_name: new FormControl(null),
      customer_mobile: new FormControl(null),
      car_name: new FormControl(null),
      car_color: new FormControl(null),
      car_type: new FormControl(null),
      gear_type: new FormControl(null),
      car_model: new FormControl(null),
      grade: new FormControl(null),
      kilometer: new FormControl(null),
      insurance: new FormControl(null),
    });
  }

  getCarName() {
    this._CarService.getCarName().subscribe((res) => {
      res.data.forEach((e) => {
        this.carName.push({ name: e.car_name, value: e.car_name });
      });
    });
  }

  getCarColor() {
    this._CarService.getCarColor().subscribe((res) => {
      res.data.forEach((e) => {
        this.carColor.push({ name: e.car_color, value: e.car_color });
      });
    });
  }

  getCarType() {
    this._CarService.getCarType().subscribe((res) => {
      res.data.forEach((e) => {
        this.carType.push({ name: e.car_type, value: e.car_type });
      });
    });
  }

  addLead() {
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.AddLeadForm.nativeElement);
    }, 800);
  }
}
