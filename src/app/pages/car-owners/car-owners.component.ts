import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarOwnerService } from "app/shared/services/car-owner.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: "app-car-owners",
  templateUrl: "./car-owners.component.html",
  styleUrls: ["./car-owners.component.scss"],
  providers: [ConfirmationService],
})
export class CarOwnersComponent implements OnInit {
  pagination: any;
  cars: any[] = [];
  filterModal: boolean = false;
  selectedRow: any;
  currentEditRow: any;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;

  carsForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _CarOwnerService: CarOwnerService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _ConfirmationService: ConfirmationService,
    private _FormBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getCars();
    this.setCarsForm();
    this.setFilterForm();
  }

  // Curd Settings
  getCars(page = 1) {
    this._CarOwnerService.getOwners(page).subscribe({
      next: (res) => {
        this.cars = res.data.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getById(id: any) {
    [this.selectedRow] = this.cars.filter((car) => car.id == id);
    this.displayDetails();
  }

  @ViewChild("uploadedImage1") uploadedImage1: any;
  @ViewChild("uploadedImage2") uploadedImage2: any;

  createRow(form: any) {
    this._CarOwnerService.createOwners(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getCars();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInCarsTable();
          this.resetUploadedFiles();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  resetUploadedFiles() {
    this.uploadedImage1.clear();
    this.uploadedImage2.clear();
  }

  editRow(form: any) {
    this.carsForm.addControl(
      "cid",
      new FormControl(this.currentEditRow.id, Validators.required)
    );
    this._CarOwnerService.updateOwners(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getCars();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.EditForm.nativeElement);
          this.fadeInCarsTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteRow(id: any) {
    this._CarOwnerService.deleteOwners(id).subscribe({
      next: (res) => {
        this.getCars();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteRow(id);
      },
    });
  }

  // Set Reactive Forms
  setCarsForm(car?: any) {
    this.carsForm = this._FormBuilder.group({
      name: new FormControl(car?.name, [Validators.required]),
      mobile: new FormControl(car?.mobile, [Validators.required]),
      address: new FormControl(car?.address, [Validators.required]),
      nid: new FormControl(car?.nid, [Validators.required]),
      national_front_image: new FormControl(null),
      national_back_image: new FormControl(null),
    });
  }

  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      name: new FormControl(null),
      mobile: new FormControl(null),
      address: new FormControl(null),
      nid: new FormControl(null),
    });
  }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInCarsTable();
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.CreateForm.nativeElement);
    this.fadeInCarsTable();
    // this.resetUploadedFiles();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.EditForm.nativeElement);
    this.fadeInCarsTable();
    // this.resetUploadedFiles();
  }

  fadeInCarsTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  // display animation
  displayCreateForm() {
    this.setCarsForm();
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.CreateForm.nativeElement);
    }, 800);
  }

  displayEditForm(car: any) {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.EditForm.nativeElement);
    }, 800);
    this.setCarsForm(car);
    this.currentEditRow = car;
  }

  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  // Filter
  filter(form: any) {
    this._CarOwnerService.filterOwners(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.cars = res.data.data;
        this.pagination = res.data;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  resetFilter() {
    this.getCars();
  }

  // Pagination
  loadPage(page: number) {
    this.getCars(page);
  }

  // Export
  export() {
    this._CarOwnerService.exportOwners().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  uploadImage(event: any, status: string) {
    let reader = new FileReader();
    reader.readAsDataURL(event.files[0]);
    reader.onload = () => {
      if (status == "front") {
        this.carsForm.patchValue({
          national_front_image: reader.result,
        });
      } else if (status == "back") {
        this.carsForm.patchValue({
          national_back_image: reader.result,
        });
      }
      this._ToastrService.setToaster(
        " File Uploaded Successfully",
        "info",
        "info"
      );
    };
  }
  uploadedFiles: any[] = [];

  removeImage(status: string) {
    if (status == "front") {
      this.carsForm.patchValue({
        national_front_image: null,
      });
    } else if (status == "back") {
      this.carsForm.patchValue({
        national_back_image: null,
      });
    }
  }

  uploadModal1: boolean = false;
  uploadModal2: boolean = false;

  uploadFrontID(e: FileUpload) {
    let reader = new FileReader();
    reader.readAsDataURL(e._files[0]);
    reader.onload = () => {
      this.selectedRow.national_front_image = reader.result;
      this._CarOwnerService.createOwners(this.selectedRow).subscribe({
        next: (res) => {
          this.uploadModal1 = false;
          this.selectedRow = res.data;
          e._files = null;
        },
      });
    };
  }

  uploadBackID(e: HTMLInputElement) {
    let reader = new FileReader();
    reader.readAsDataURL(e.files[0]);
    reader.onload = () => {
      this.selectedRow.national_back_image = reader.result;
      this._CarOwnerService.createOwners(this.selectedRow).subscribe({
        next: (res) => {
          this.uploadModal2 = false;
          this.selectedRow = res.data;
        },
      });
    };
  }
}
