import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { EmployeeService } from "app/shared/services/employee.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.scss"],
  providers: [ConfirmationService],
})
export class EmployeesComponent implements OnInit {
  pagination: any;
  employees: any[] = [];
  jobTitles: any[] = [];
  status: any[] = [];
  religionStatus: any[] = [];
  gender: any[] = [];
  nationalityStatus: any[] = [];
  militaryStatus: any[] = [];
  maritalStatus: any[] = [];
  contractStatus: any[] = [];

  contractModal: boolean = false;
  jobTitleModal: boolean = false;
  maritalModal: boolean = false;
  militaryModal: boolean = false;
  nationalityModal: boolean = false;
  religionModal: boolean = false;

  filterModal: boolean = false;
  selectedRow: any;
  currentEditRow: any;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;
  @ViewChild("Settings") Settings: any;

  employeesForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _EmployeeService: EmployeeService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _ConfirmationService: ConfirmationService,
    private _FormBuilder: FormBuilder
  ) {
    this.gender = [
      { name: "Male", value: "male" },
      { name: "Female", value: "female" },
    ];

    this.status = [
      { name: "Active", value: "ACTIVE" },
      { name: "Deactive", value: "DEACTIVE" },
    ];

    this.uploadTypes = [
      { name: "Passport", value: "passport" },
      { name: "Qualification", value: "qualification" },
      { name: "Military Certification", value: "military" },
      { name: "National Id", value: "national" },
    ];
  }

  ngOnInit() {
    this.getEmployees();
    this.setEmployeesForm();
    this.setFilterForm();
    this.callSettings();
  }

  // Curd Settings
  getEmployees(page = 1) {
    this._EmployeeService.getEmployees(page).subscribe({
      next: (res) => {
        this.employees = res.data.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getById(id: any) {
    [this.selectedRow] = this.employees.filter((emp) => emp.id == id);
    this.displayDetails();
  }

  createRow(form: any) {
    this._EmployeeService.createEmployees(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          // this.getEmployees();
          this.employees.push(res.data);
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInEmployeesTable();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  editRow(form: any) {
    this.employeesForm.addControl(
      "eid",
      new FormControl(this.currentEditRow.id, Validators.required)
    );
    this._EmployeeService.updateEmployees(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          // this.getEmployees();
          this.employees.map((e) => {
            if (e.id == res.data.id) {
              Object.assign(e, res.data);
            }
          });
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.EditForm.nativeElement);
          this.fadeInEmployeesTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteRow(id: any) {
    this._EmployeeService.deleteEmployees(id).subscribe({
      next: (res) => {
        // this.getEmployees();
        this.employees = this.employees.filter((data) => data.id != id);

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
  setEmployeesForm(emp?: any) {
    let date = emp?.dob ? new Date(emp?.dob) : null;
    let joinDate = emp?.join ? new Date(emp?.join) : null;
    let endDate = emp?.end ? new Date(emp?.end) : null;
    this.employeesForm = this._FormBuilder.group({
      name: new FormControl(emp?.name),
      job_title: new FormControl(emp?.job_title),
      mobile: new FormControl(emp?.mobile, [Validators.required]),
      nid: new FormControl(emp?.nid),
      dob: new FormControl(date),
      contract: new FormControl(emp?.contract),
      status: new FormControl(emp?.status),
      join: new FormControl(joinDate),
      annual: new FormControl(emp?.annual),
      end: new FormControl(endDate),
      email: new FormControl(emp?.email),
      passport: new FormControl(emp?.passport),
      religion: new FormControl(emp?.religion),
      gender: new FormControl(emp?.gender),
      nationality: new FormControl(emp?.nationality),
      address: new FormControl(emp?.address),
      military: new FormControl(emp?.military),
      marital: new FormControl(emp?.marital),
      no_kids: new FormControl(emp?.no_kids),
      salary: new FormControl(emp?.salary),
      qualification: new FormControl(emp?.qualification),
      files: new FormControl(null),
      type: new FormControl(null),
    });
  }

  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      name: new FormControl(null),
      job_title: new FormControl(null),
      mobile: new FormControl(null),
      nid: new FormControl(null),
      dob: new FormControl(null),
      contract: new FormControl(null),
      status: new FormControl(null),
      join: new FormControl(null),
      annual: new FormControl(null),
      end: new FormControl(null),
      email: new FormControl(null),
      passport: new FormControl(null),
      religion: new FormControl(null),
      gender: new FormControl(null),
      nationality: new FormControl(null),
      address: new FormControl(null),
      military: new FormControl(null),
      marital: new FormControl(null),
      no_kids: new FormControl(null),
      salary: new FormControl(null),
      qualification: new FormControl(null),
    });
  }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInEmployeesTable();
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.CreateForm.nativeElement);
    this.fadeInEmployeesTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.EditForm.nativeElement);
    this.fadeInEmployeesTable();
  }

  backSettingBtn() {
    this._SharedService.fadeOut(this.Settings.nativeElement);
    this.fadeInEmployeesTable();
  }

  fadeInEmployeesTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  // display animation
  displayCreateForm() {
    this.setEmployeesForm();
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.CreateForm.nativeElement);
    }, 800);
  }

  displayEditForm(emp: any) {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.EditForm.nativeElement);
    }, 800);
    this.setEmployeesForm(emp);
    this.currentEditRow = emp;
  }

  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  displaySettings() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Settings.nativeElement);
    }, 800);
  }

  // Filter
  filter(form: any) {
    this._EmployeeService.filterEmployees(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.employees = res.data.data;
        this.pagination = res.data;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  resetFilter() {
    this.setFilterForm();
    this.getEmployees();
  }

  // Pagination
  loadPage(page: number) {
    this.getEmployees(page);
  }

  // Export
  export() {
    this._EmployeeService.exportEmployees().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Employees Settings

  callSettings() {
    this.getContracts();
    this.getMaritals();
    this.getMilitaries();
    this.getJobTitles();
    this.getNationalities();
    this.getReligions();
  }

  // Show
  getContracts() {
    this._EmployeeService.getContracts().subscribe({
      next: (res) => {
        this.contractStatus = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getJobTitles() {
    this._EmployeeService.getjobTitles().subscribe({
      next: (res) => {
        this.jobTitles = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getMaritals() {
    this._EmployeeService.getMaritals().subscribe({
      next: (res) => {
        this.maritalStatus = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getMilitaries() {
    this._EmployeeService.getMilitaries().subscribe({
      next: (res) => {
        this.militaryStatus = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getNationalities() {
    this._EmployeeService.getNationalities().subscribe({
      next: (res) => {
        this.nationalityStatus = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getReligions() {
    this._EmployeeService.getReligions().subscribe({
      next: (res) => {
        this.religionStatus = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Delete
  deleteContracts(id: number) {
    this._EmployeeService.deleteContracts(id).subscribe({
      next: (res) => {
        // this.getContracts();
        this.contractStatus = this.contractStatus.filter(
          (data) => data.id != id
        );

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteJobTitles(id: number) {
    this._EmployeeService.deletejobTitles(id).subscribe({
      next: (res) => {
        // this.getJobTitles();
        this.jobTitles = this.jobTitles.filter((data) => data.id != id);

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteMaritals(id: number) {
    this._EmployeeService.deleteMaritals(id).subscribe({
      next: (res) => {
        // this.getMaritals();
        this.maritalStatus = this.maritalStatus.filter((data) => data.id != id);

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteMilitaries(id: number) {
    this._EmployeeService.deleteMilitaries(id).subscribe({
      next: (res) => {
        // this.getMilitaries();
        this.militaryStatus = this.militaryStatus.filter(
          (data) => data.id != id
        );

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteNationalities(id: number) {
    this._EmployeeService.deleteNationalities(id).subscribe({
      next: (res) => {
        // this.getNationalities();
        this.nationalityStatus = this.nationalityStatus.filter(
          (data) => data.id != id
        );

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteReligions(id: number) {
    this._EmployeeService.deleteReligions(id).subscribe({
      next: (res) => {
        // this.getReligions();
        this.religionStatus = this.religionStatus.filter(
          (data) => data.id != id
        );

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Create
  addContracts(data: HTMLInputElement) {
    this._EmployeeService.createContracts(data.value).subscribe({
      next: (res) => {
        this.getContracts();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.contractModal = false;
        data.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addJobTitles(data: HTMLInputElement) {
    this._EmployeeService.createjobTitles(data.value).subscribe({
      next: (res) => {
        this.getJobTitles();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.jobTitleModal = false;
        data.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addMaritals(data: HTMLInputElement) {
    this._EmployeeService.createMaritals(data.value).subscribe({
      next: (res) => {
        this.getMaritals();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.maritalModal = false;
        data.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addMilitaries(data: HTMLInputElement) {
    this._EmployeeService.createMilitaries(data.value).subscribe({
      next: (res) => {
        this.getMilitaries();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.militaryModal = false;
        data.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addNationalities(data: HTMLInputElement) {
    this._EmployeeService.createNationalities(data.value).subscribe({
      next: (res) => {
        this.getNationalities();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.nationalityModal = false;
        data.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addReligions(data: HTMLInputElement) {
    this._EmployeeService.createReligions(data.value).subscribe({
      next: (res) => {
        this.getReligions();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.religionModal = false;
        data.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Delete Confirmation
  deleteContractsConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteContracts(id);
      },
    });
  }

  deleteJobTitlesConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteJobTitles(id);
      },
    });
  }

  deleteMaritalsConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteMaritals(id);
      },
    });
  }

  deleteMilitariesConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteMilitaries(id);
      },
    });
  }

  deleteNationalitiesConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteNationalities(id);
      },
    });
  }

  deleteReligionsConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteReligions(id);
      },
    });
  }

  // UPLOAD FILES ************************************
  // ==========================================================================
  // Upload while edit car
  uploadModal1: boolean = false;
  uploadModal2: boolean = false;
  uploadModal3: boolean = false;
  uploadModal4: boolean = false;
  updateImage(imageId, type) {
    let input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    let base64: any = null;
    input.onchange = () => {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if (e.target) {
            base64 = e.target;
          }
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(() => {
          this._EmployeeService
            .updateFiles({
              image: base64?.result,
              file_id: imageId,
              type: type,
            })
            .subscribe({
              next: (res) => {
                if (res.status == 1) {
                  this.uploadModal1 = false;
                  this.uploadModal2 = false;
                  this.selectedRow.files.map((e) => {
                    if (e.id == res.data.id) e.image = res.data.image;
                  });
                }
              },
            });
        }, 1);
      }
    };
    input.click();
  }

  addNewImage(type: string) {
    let input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.click();
    input.onchange = () => {
      if (input.files && input.files[0]) {
        this.uploadDocuments(type, input.files);
      }
    };
  }

  uploadDocuments = async (type, files: FileList) => {
    let base64: any[] = [];
    const FILES = Array.from(files);
    const filePromises = FILES.map((file) => {
      // Return a promise per file
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const response = await base64.push(e.target.result);
            resolve(response);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    const fileInfos = await Promise.all(filePromises);

    setTimeout(() => {
      if (base64.length != 0) {
        // let img;
        // if (type == "document") {
        //   img = { car_files: base64, car_id: this.selectedRow.id };
        // } else {
        //   img = { car_images: base64, car_id: this.selectedRow.id };
        // }
        this._EmployeeService
          .uploadFiles({
            files: base64,
            employee_id: this.selectedRow.id,
            type: type,
          })
          .subscribe({
            next: (res) => {
              this.uploadModal1 = false;
              this.uploadModal2 = false;
              this.uploadModal3 = false;
              this.uploadModal4 = false;
              this.selectedRow.files = res.data.files;
              this._ToastrService.setToaster(
                "Files Uploaded Successfully",
                "info",
                "info"
              );
            },
          });
      } else {
        this._ToastrService.setToaster(
          "Error Occurred While Uploading",
          "warning",
          "warning"
        );
      }
    }, 1);

    // return base64;
  };

  deleteImage(id) {
    this._EmployeeService.deleteFiles(id).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.selectedRow.files.map((img) => {
          if (img.id == id) {
            const index = this.selectedRow.files.indexOf(img);
            this.selectedRow.files.splice(index, 1);
          }
        });
        this.uploadModal1 = false;
        this.uploadModal2 = false;
      },
    });
  }

  // ==========================================================================
  // Upload while create car
  uploadTypes;
  uploadModal: boolean = false;
  uploadedFiles: any[] = [];
  currentUploadedType;
  displayUpload(type) {
    this.currentUploadedType = type;
    this.uploadModal = true;
  }

  uploadImage(event: any, uploadedImage) {
    let images = [];
    event.files.forEach((e) => {
      let reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = () => {
        images.push(reader.result);
        this.employeesForm.patchValue({
          files: images,
          type: this.currentUploadedType,
        });
        this.uploadModal = false;
        uploadedImage.files = [];
      };
    });
    this._ToastrService.setToaster(
      "File Uploaded Successfully",
      "info",
      "info"
    );
  }

  removeImage(removedImage, event) {
    let remainImages: any[] = [];
    event.files.forEach((e) => {
      if (e.name != removedImage.file.name) {
        remainImages.push(e);
      }
    });

    let images = [];
    remainImages.forEach((e) => {
      let reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = () => {
        images.push(reader.result);
        this.employeesForm.patchValue({
          files: null,
        });
      };
    });
  }
}
