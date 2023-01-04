import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CarService } from "app/shared/services/car.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "cars-cmp",
  moduleId: module.id,
  templateUrl: "cars.component.html",
  providers: [ConfirmationService],
})
export class CarsComponent implements OnInit {
  carName: any[] = [];
  carSub: any[] = [];
  carColor: any[] = [];
  carType: any[] = [];
  carGrade: any[] = [];
  carInsurance: any[] = [];

  constructor(
    private _ToastrService: ToasterService,
    private _ConfirmationService: ConfirmationService,
    private _SharedService: SharedService,
    private _CarService: CarService
  ) {}
  addCarNameModal: boolean = false;
  addCarSubModal: boolean = false;
  addCarColorModal: boolean = false;
  addCarTypeModal: boolean = false;
  gradeModal: boolean = false;
  insuranceModal: boolean = false;

  ngOnInit() {
    this.getCarName();
    // this.getCarSub();
    // this.getCarColor();
    // this.getCarType();
    // this.getGrade();
    // this.getInsurance();
  }

  // Show
  getCarName() {
    this._CarService.getCarName().subscribe({
      next: (res) => (this.carName = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getCarSub(car_name_id) {
    this._CarService.getCarSub(car_name_id).subscribe({
      next: (res) => (this.carSub = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getCarColor() {
    this._CarService.getCarColor().subscribe({
      next: (res) => (this.carColor = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getCarType() {
    this._CarService.getCarType().subscribe({
      next: (res) => (this.carType = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getGrade() {
    this._CarService.getGrade().subscribe({
      next: (res) => (this.carGrade = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getInsurance() {
    this._CarService.getInsurance().subscribe({
      next: (res) => (this.carInsurance = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Delete

  deleteCarName(id: number) {
    this._CarService.deleteCarName(id).subscribe({
      next: (res) => {
        // this.getCarName();
        this.carName = this.carName.filter((data) => data.id != id);
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteCarSub(id: number) {
    this._CarService.deleteCarSub(id).subscribe({
      next: (res) => {
        this.getCarSub(this.currentSubType);
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteCarColor(id: number) {
    this._CarService.deleteCarColor(id).subscribe({
      next: (res) => {
        // this.getCarColor();
        this.carColor = this.carColor.filter((data) => data.id != id);

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteCarType(id: number) {
    this._CarService.deleteCarType(id).subscribe({
      next: (res) => {
        // this.getCarType();
        this.carType = this.carType.filter((data) => data.id != id);

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteGrade(id: number) {
    this._CarService.deleteGrade(id).subscribe({
      next: (res) => {
        // this.getGrade();
        this.carGrade = this.carGrade.filter((data) => data.id != id);

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteInsurance(id: number) {
    this._CarService.deleteInsurance(id).subscribe({
      next: (res) => {
        // this.getInsurance();
        this.Insurances = this.Insurances.filter((data) => data.id != id);

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Create

  addCarName(car: HTMLInputElement) {
    this._CarService.createCarName(car.value).subscribe({
      next: (res) => {
        this.getCarName();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.addCarNameModal = false;
        car.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addCarSub(sub: HTMLInputElement) {
    this._CarService
      .createCarSub({ car_name_id: this.currentSubType, car_model: sub.value })
      .subscribe({
        next: (res) => {
          this.getCarSub(this.currentSubType);
          this._ToastrService.setToaster(res.message, "success", "success");
          this.addCarSubModal = false;
          sub.value = "";
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  addCarColor(car: HTMLInputElement) {
    this._CarService.createCarColor(car.value).subscribe({
      next: (res) => {
        this.getCarColor();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.addCarColorModal = false;
        car.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addCarType(car: HTMLInputElement) {
    this._CarService.createCarType(car.value).subscribe({
      next: (res) => {
        this.getCarType();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.addCarTypeModal = false;
        car.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addGrade(grade: HTMLInputElement) {
    this._CarService.createGrade(grade.value).subscribe({
      next: (res) => {
        this.getGrade();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.gradeModal = false;
        grade.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addInsurance(status: HTMLInputElement) {
    this._CarService.createInsurance(status.value).subscribe({
      next: (res) => {
        this.getInsurance();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.insuranceModal = false;
        status.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Confirmation
  deleteCarNameConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteCarName(id);
      },
    });
  }

  deleteCarSubConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteCarSub(id);
      },
    });
  }

  deleteCarColorConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteCarColor(id);
      },
    });
  }

  deleteCarTypeConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteCarType(id);
      },
    });
  }

  deleteGradeConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteGrade(id);
      },
    });
  }

  deleteInsuranceConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteInsurance(id);
      },
    });
  }

  // Displays
  @ViewChild("Cars") Cars: any;
  @ViewChild("Colors") Colors: any;
  @ViewChild("Types") Types: any;
  @ViewChild("SubTypes") SubTypes: any;
  @ViewChild("Grades") Grades: any;
  @ViewChild("Insurances") Insurances: any;

  fadeOutAll(){
    this._SharedService.fadeOut(this.Colors.nativeElement);
    this._SharedService.fadeOut(this.Types.nativeElement);
    this._SharedService.fadeOut(this.SubTypes.nativeElement);
    this._SharedService.fadeOut(this.Grades.nativeElement);
    this._SharedService.fadeOut(this.Insurances.nativeElement);
    this._SharedService.fadeOut(this.Cars.nativeElement);
    this._SharedService.fadeOut(this.SourceSubTypesPage.nativeElement);
    this._SharedService.fadeOut(this.SourcePage.nativeElement);
  }

  displayCars() {
    this.getCarName();
    this.fadeOutAll();
    setTimeout(() => {
      this._SharedService.fadeIn(this.Cars.nativeElement);
    }, 800);
  }

  displayColors() {
    this.getCarColor();
    this.fadeOutAll();
    setTimeout(() => {
      this._SharedService.fadeIn(this.Colors.nativeElement);
    }, 800);
  }

  currentSubType: number = 0;
  displaySubTypes(id) {
    this.currentSubType = id;
    this.getCarSub(id);
    this.fadeOutAll();
    setTimeout(() => {
      this._SharedService.fadeIn(this.SubTypes.nativeElement);
    }, 800);
  }

  displayTypes() {
    this.getCarType();
    this.fadeOutAll();
    setTimeout(() => {
      this._SharedService.fadeIn(this.Types.nativeElement);
    }, 800);
  }

  displayInsurances() {
    this.getInsurance();
    this.fadeOutAll();
    setTimeout(() => {
      this._SharedService.fadeIn(this.Insurances.nativeElement);
    }, 800);
  }

  displayGrades() {
    this.getGrade();
    this.fadeOutAll();
    setTimeout(() => {
      this._SharedService.fadeIn(this.Grades.nativeElement);
    }, 800);
  }

  // *******************************************
  @ViewChild("SourcePage") SourcePage: ElementRef<HTMLElement>;
  @ViewChild("SourceSubTypesPage") SourceSubTypesPage: ElementRef<HTMLElement>;
  currentSourceSubTypes: any;

  sources: any[] = [];
  sourceSubTypes: any[] = [];
  sourceModal: boolean = false;
  subSourceModal: boolean = false;

  // Show
  getAllSources() {
    this._CarService.getAllSources().subscribe({
      next: (res) => (this.sources = res.data),
    });
  }

  getSourceSubTypes(id) {
    this._CarService.getSourceSubTypes(id).subscribe({
      next: (res) => (this.sourceSubTypes = res.data),
    });
  }

  // Delete
  deleteSources(id: number) {
    this._CarService.deleteSource(id).subscribe({
      next: (res) => {
        this.sources = this.sources.filter((data) => data.id != id);
        this._ToastrService.setToaster(res.message, "success", "success");
      },
    });
  }

  deleteSubSource(id: number) {
    this._CarService.deleteSubSource(id).subscribe({
      next: (res) => {
        this.sourceSubTypes = this.sourceSubTypes.filter(
          (data) => data.id != id
        );
        this._ToastrService.setToaster(res.message, "success", "success");
      },
    });
  }


  // Create
  createSource(data: HTMLInputElement) {
    this._CarService.createSource(data.value).subscribe({
      next: (res) => {
        this.getAllSources();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.sourceModal = false;
        data.value = "";
      },
    });
  }

  createSubSource(sub_source: HTMLInputElement) {
    this._CarService
      .createSubSource({
        source_id: this.currentSourceSubTypes,
        sub_source: sub_source.value,
      })
      .subscribe({
        next: (res) => {
          this.getSourceSubTypes(this.currentSourceSubTypes);
          this._ToastrService.setToaster(res.message, "success", "success");
          this.subSourceModal = false;
          sub_source.value = "";
        },
      });
  }

  // Confirmation
  deleteSourcesConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteSources(id);
      },
    });
  }

  deleteSubSourceConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteSubSource(id);
      },
    });
  }

  // Displays
  displaySource() {
    this.getAllSources();
    this.fadeOutAll();
    setTimeout(() => {
      this._SharedService.fadeIn(this.SourcePage.nativeElement);
    }, 800);
  }

  displaySourceSubTypes(id) {
    this.currentSourceSubTypes = id;
    this.getSourceSubTypes(id);
    this.fadeOutAll();
    setTimeout(() => {
      this._SharedService.fadeIn(this.SourceSubTypesPage.nativeElement);
    }, 800);
  }

}
