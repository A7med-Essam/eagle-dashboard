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
  selectedRow: any;
  cars: any[] = [];

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
    this.getMaintenanceKilometer();
    this.getMaintenanceType();
  }

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("Show2") Show2: any;
  @ViewChild("Show3") Show3: any;
  @ViewChild("Show4") Show4: any;

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

  backDetailsBtn2() {
    this._SharedService.fadeOut(this.Show2.nativeElement);
    this.fadeInTable();
  }

  backDetailsBtn3() {
    this._SharedService.fadeOut(this.Show3.nativeElement);
    this.fadeInTable();
  }

  backDetailsBtn4() {
    this._SharedService.fadeOut(this.Show4.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show2.nativeElement);
    }, 800);
  }

  fadeInTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

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

  displayBrands() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show2.nativeElement);
    }, 800);
  }

  displaySettings() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show3.nativeElement);
    }, 800);
  }

  displayBrandCarMaintenance() {
    this._SharedService.fadeOut(this.Show2.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show4.nativeElement);
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
        // this.selectedRow.brands.push(res.data);
        this.selectedRow.brands = res.data.brands;
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
          // this.selectedRow.brands = this.selectedRow.brands.filter((data) => {
          //   data.car.id == carId;
          // });

          let brandsAfterDelete = [];
          this.selectedRow.brands.forEach((e) => {
            if (e.car.id != carId) {
              brandsAfterDelete.push(e);
            }
          });
          this.selectedRow.brands = brandsAfterDelete;
          this.addBrandModal = false;
        },
        error: (err) => {
          this._ToastrService.setToaster(err.error.message, "error", "danger");
        },
      });
  }

  // *******************************************************
  // kilometer maintenance

  maintenanceKilometer: any[] = [];
  getMaintenanceKilometer() {
    this._CarMaintenanceService.getMaintenanceKilometer().subscribe({
      next: (res) => {
        this.maintenanceKilometer = res.data;
      },
    });
  }

  createMaintenanceKilometer(kilometer) {
    this._CarMaintenanceService
      .createMaintenanceKilometer(kilometer)
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.maintenanceKilometer.push(res.data);
          this.createKilometerModal = false;
        },
      });
  }

  deleteMaintenanceKilometer(id) {
    this._CarMaintenanceService.deleteMaintenanceKilometer(id).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.maintenanceKilometer = this.maintenanceKilometer.filter(
          (data) => data.id != id
        );
      },
    });
  }
  // *******************************************************
  // maintenance type
  maintenanceType: any[] = [];
  getMaintenanceType() {
    this._CarMaintenanceService.getMaintenanceType().subscribe({
      next: (res) => {
        this.maintenanceType = res.data;
      },
    });
  }

  createMaintenanceType(type) {
    this._CarMaintenanceService
      .createMaintenanceType({ type_ar: type, type: type })
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.maintenanceType.push(res.data);
          this.createTypeModal = false;
        },
      });
  }

  deleteMaintenanceType(id) {
    this._CarMaintenanceService.deleteMaintenanceType(id).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.maintenanceType = this.maintenanceType.filter(
          (data) => data.id != id
        );
      },
    });
  }
  // *******************************************************
  createKilometerModal: boolean = false;
  createTypeModal: boolean = false;
  createCarMaintenanceModal: boolean = false;
  updateCarMaintenanceModal: boolean = false;
  // *******************************************************
  CarMaintenance: any[] = [];
  getCarMaintenance(carId) {
    this._CarMaintenanceService.getCarMaintenance(carId).subscribe({
      next: (res) => {
        this.CarMaintenance = res.data;
        this.setPropertiesToCarMaintenance();
      },
    });
  }

  setPropertiesToCarMaintenance() {
    this.CarMaintenance.map((c) => {
      [c.kilometer] = this.maintenanceKilometer.filter(
        (meter) => meter.id == c.maintenance_kilometer_id
      );
      [c.type] = this.maintenanceType.filter(
        (type) => type.id == c.maintenance_type_id
      );
      [c.car] = this.cars.filter((car) => car.id == c.car_name_id);
    });
  }

  createCarMaintenance(type, kilometer) {
    const CAR_MAINTENANCE = {
      car_name_id: this.CarMaintenance[0].car_name_id,
      maintenance_type_id: type,
      maintenance_kilometer_id: kilometer,
    };
    this._CarMaintenanceService
      .createCarMaintenance(CAR_MAINTENANCE)
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.CarMaintenance.push(res.data);
          this.setPropertiesToCarMaintenance();
          this.createCarMaintenanceModal = false;
        },
      });
  }

  updateCarMaintenance(type, kilometer) {
    const CAR_MAINTENANCE = {
      car_name_maintenance_id: this.updateCar_name_maintenance_id,
      maintenance_type_id: type,
      maintenance_kilometer_id: kilometer,
    };
    this._CarMaintenanceService
      .updateCarMaintenance(CAR_MAINTENANCE)
      .subscribe({
        next: (res) => {
          this.CarMaintenance.map((e) => {
            if (e.id == res.data.id) {
              Object.assign(e, res.data);
            }
          });
          this.setPropertiesToCarMaintenance();
          this._ToastrService.setToaster(res.message, "success", "success");
          this.updateCarMaintenanceModal = false;
        },
      });
  }

  deleteCarMaintenance(id) {
    this._CarMaintenanceService.deleteCarMaintenance(id).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.CarMaintenance = this.CarMaintenance.filter(
          (data) => data.id != id
        );
      },
    });
  }

  updateMaintenance_type_id = 0;
  updateMaintenance_kilometer_id = 0;
  updateCar_name_maintenance_id = 0;
  displayUpdateCarMaintenanceModal(car) {
    this.updateCarMaintenanceModal = true;
    this.updateMaintenance_type_id = car.maintenance_type_id;
    this.updateMaintenance_kilometer_id = car.maintenance_kilometer_id;
    this.updateCar_name_maintenance_id = car.id;
  }
}
