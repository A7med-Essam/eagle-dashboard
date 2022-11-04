import { CarMaintenanceService } from "app/shared/services/car-maintenance.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";
import { CarService } from "app/shared/services/car.service";
import { SharedService } from "app/shared/services/shared.service";

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
    private _SharedService: SharedService,
    private _CarService: CarService,
    private _ConfirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getMaintenance();
    this.getCar();
    this.setMaintenanceForm();
  }

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;

  getMaintenance(page = 1) {
    this._CarMaintenanceService.getMaintenances(page).subscribe({
      next: (res) => {
        this.maintenances = res.data.data;
        this.pagination = res.data;
      },
    });
  }

  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInTable();
  }

  fadeInTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  selectedRow: any;
  getById(id: any) {
    [this.selectedRow] = this.maintenances.filter((c) => c.id == id);
    this.displayDetails();
  }

  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  // Pagination
  loadPage(page: number) {
    this.getMaintenance(page);
  }

  setMaintenanceForm(data?: any) {
    this.maintenanceForm = this._FormBuilder.group({
      name: new FormControl(data?.name),
      mobile: new FormControl(data?.mobile),
      phone: new FormControl(data?.phone),
      address: new FormControl(data?.address),
    });
  }

  // Delete
  deleteMaintenance(id: number) {
    this._CarMaintenanceService.deleteMaintenances(id).subscribe({
      next: (res) => {
        // this.getMaintenance();
        this.maintenances = this.maintenances.filter((data) => data.id != id);

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
        // this.getMaintenance();
        this.maintenances.map((e) => {
          if (e.id == res.data.id) {
            Object.assign(e, res.data);
          }
        });
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
      car_name_ids: car.value,
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

  deleteBrand(carId, maintenanceId) {
    const brand = {
      maintenance_center_id: maintenanceId,
      car_name_ids: [carId],
    };
    this._CarMaintenanceService
      .deleteBrandForMaintenanceCenter(brand)
      .subscribe({
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
