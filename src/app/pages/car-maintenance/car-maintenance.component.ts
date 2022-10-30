import { CarMaintenanceService } from "app/shared/services/car-maintenance.service";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";
import { CarService } from "app/shared/services/car.service";

@Component({
  selector: "app-car-maintenance",
  templateUrl: "./car-maintenance.component.html",
  styleUrls: ["./car-maintenance.component.scss"],
  providers: [ConfirmationService],
})
export class CarMaintenanceComponent implements OnInit {
  maintenances: any[] = [];
  currentRow: any;
  editModal: boolean = false;
  addModal: boolean = false;
  addBrandModal: boolean = false;
  maintenanceForm: FormGroup = new FormGroup({});
  pagination: any;

  constructor(
    private _CarMaintenanceService: CarMaintenanceService,
    private _ToastrService: ToasterService,
    private _FormBuilder: FormBuilder,
    private _CarService: CarService,
    private _ConfirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getMaintenance();
    this.getCar();
    this.setMaintenanceForm();
  }

  getMaintenance(page = 1) {
    this._CarMaintenanceService.getMaintenances(page).subscribe({
      next: (res) => {
        this.maintenances = res.data.data;
        this.pagination = res.data;
      },
    });
  }

  // Pagination
  loadPage(page: number) {
    this.getMaintenance(page);
  }

  setMaintenanceForm(data?: any) {
    this.maintenanceForm = this._FormBuilder.group({
      name: new FormControl(data?.name),
      mobile: new FormControl(data?.mobile),
      address: new FormControl(data?.address),
    });
  }

  // Delete
  deleteMaintenance(id: number) {
    this._CarMaintenanceService.deleteMaintenances(id).subscribe({
      next: (res) => {
        this.getMaintenance();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Confirmation
  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteMaintenance(id);
      },
    });
  }

  displayUpdateModal(data) {
    this.currentRow = data;
    this.editModal = true;
    this.setMaintenanceForm(data);
  }

  displayAddModal() {
    this.addModal = true;
    this.maintenanceForm.reset();
  }

  addMaintenance(data) {
    this._CarMaintenanceService.addMaintenances(data.value).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.addModal = false;
        this.getMaintenance();
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  editMaintenance(data) {
    this.maintenanceForm.addControl(
      "maintenance_center_id",
      new FormControl(this.currentRow.id, [Validators.required])
    );
    this._CarMaintenanceService.updateMaintenances(data.value).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.editModal = false;
        this.getMaintenance();
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  displayBrandModal(row) {
    this.currentRow = row;
    this.addBrandModal = true;
  }

  cars: any[] = [];
  getCar() {
    this._CarService.getCarName().subscribe({
      next: (res) => (this.cars = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addBrandForMaintenanceCenter(car) {
    const brand = {
      maintenance_center_id: this.currentRow.id,
      car_name_id: car.value,
    };
    this._CarMaintenanceService.addBrandForMaintenanceCenter(brand).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.getMaintenance();
        this.addBrandModal = false;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }
}
