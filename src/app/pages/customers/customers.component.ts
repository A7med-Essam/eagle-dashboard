import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CustomerService } from "app/shared/services/customer.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
  providers: [ConfirmationService],
})
export class CustomersComponent implements OnInit {
  pagination: any;
  customers: any[] = [];
  filterModal: boolean = false;
  selectedRow: any;
  currentEditRow: any;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;

  customerForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _CustomerService: CustomerService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _ConfirmationService: ConfirmationService,
    private _FormBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getCustomers();
    this.setCustomerForm();
    this.setFilterForm();
  }

  // Curd Settings
  getCustomers(page = 1) {
    this._CustomerService.getCustomers(page).subscribe({
      next: (res) => {
        this.customers = res.data.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getById(id: any) {
    [this.selectedRow] = this.customers.filter((c) => c.id == id);
    let files;
    this._CustomerService.getFilesById(id).subscribe({
      next(res) {
        files = res.data;
      },
      complete: () => {
        this.selectedRow.files = files;
      },
    });
    this.displayDetails();
  }

  createRow(form: any) {
    this._CustomerService.createCustomers(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getCustomers();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInCustomerTable();
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
    this.customerForm.addControl(
      "cid",
      new FormControl(this.currentEditRow.id, Validators.required)
    );
    this._CustomerService.updateCustomers(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          // this.getCustomers();
          this.customers.map((e) => {
            if (e.id == res.data.id) {
              Object.assign(e, res.data);
            }
          });
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.EditForm.nativeElement);
          this.fadeInCustomerTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteRow(id: any) {
    this._CustomerService.deleteCustomers(id).subscribe({
      next: (res) => {
        // this.getCustomers();
        this.customers = this.customers.filter((data) => data.id != id);
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
  setCustomerForm(customer?: any) {
    this.customerForm = this._FormBuilder.group({
      name: new FormControl(customer?.name, [Validators.required]),
      mobile: new FormControl(customer?.mobile, [Validators.required]),
      address: new FormControl(customer?.address, [Validators.required]),
      nid: new FormControl(customer?.nid, [Validators.required]),
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
    this.fadeInCustomerTable();
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.CreateForm.nativeElement);
    this.fadeInCustomerTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.EditForm.nativeElement);
    this.fadeInCustomerTable();
  }

  fadeInCustomerTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  // display animation
  displayCreateForm() {
    this.setCustomerForm();
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.CreateForm.nativeElement);
    }, 800);
  }

  displayEditForm(customer: any) {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.EditForm.nativeElement);
    }, 800);
    this.setCustomerForm(customer);
    this.currentEditRow = customer;
  }

  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  // Filter
  filter(form: any) {
    this._CustomerService.filterCustomers(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.customers = res.data.data;
        this.pagination = res.data;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  resetFilter() {
    this.setFilterForm();
    this.getCustomers();
  }

  // Pagination
  loadPage(page: number) {
    this.getCustomers(page);
  }

  // Export
  export() {
    this._CustomerService.exportCustomers().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // ***************************************************************

  // uploadedFiles: any[] = [];
  uploadModal1: boolean = false;
  uploadModal2: boolean = false;

  // uploadNationalID(e: FileUpload, type: string) {
  //   let reader = new FileReader();
  //   reader.readAsDataURL(e._files[0]);
  //   reader.onload = () => {
  //     const currentType = type == "front" ? "national_front" : "national_back";
  //     let currentFile;
  //     this.selectedRow.files.forEach((e) => {
  //       if (e.type == currentType) {
  //         currentFile = e;
  //       }
  //     });
  //     const IMG = {
  //       file_id: currentFile.id,
  //       image: reader.result,
  //       type: currentType,
  //     };
  //     this._CustomerService.updateFiles(IMG).subscribe({
  //       next: (res) => {
  //         this.uploadModal1 = false;
  //         this.uploadModal2 = false;
  //         this._ToastrService.setToaster(res.message, "success", "success");
  //         this.selectedRow.files = [res.data];
  //         e._files = null;
  //       },
  //     });
  //   };
  // }

  // uploadBackID(e: HTMLInputElement) {
  //   let reader = new FileReader();
  //   reader.readAsDataURL(e.files[0]);
  //   reader.onload = () => {
  //     // this.selectedRow.national_back_image = reader.result;
  //     // this.selectedRow.customer_id = this.selectedRow.id;
  //     const IMG = {
  //       customer_id: this.selectedRow.id,
  //       files: [reader.result],
  //       type: "national_back",
  //     };
  //     this._CustomerService.uploadFiles(IMG).subscribe({
  //       next: (res) => {
  //         this.uploadModal2 = false;
  //         this.selectedRow = res.data;
  //       },
  //     });
  //   };
  // }

  uploadNationalID(e: FileUpload, type: string) {
    let reader = new FileReader();
    reader.readAsDataURL(e._files[0]);
    reader.onload = () => {
      const currentType =
        type == "national_front" ? "national_front" : "national_back";
      const IMG = {
        customer_id: this.selectedRow.id,
        files: [reader.result],
        type: currentType,
      };
      this._CustomerService.uploadFiles(IMG).subscribe({
        next: (res) => {
          this.uploadModal1 = false;
          this.uploadModal2 = false;
          this._ToastrService.setToaster(res.message, "success", "success");
          // this.selectedRow.files = [res.data];
          // TODO: res must return files and remove line below
          this.getById(this.selectedRow.id);
          e._files = null;
        },
      });
    };
  }

  updateNationalID(e: FileUpload, type: string) {
    let reader = new FileReader();
    reader.readAsDataURL(e._files[0]);
    reader.onload = () => {
      const currentType =
        type == "national_front" ? "national_front" : "national_back";
      let currentFile;
      this.selectedRow.files.forEach((e) => {
        if (e.type == currentType) {
          currentFile = e;
        }
      });
      const IMG = {
        file_id: currentFile.id,
        image: reader.result,
        type: currentType,
      };
      this._CustomerService.updateFiles(IMG).subscribe({
        next: (res) => {
          this.uploadModal1 = false;
          this.uploadModal2 = false;
          this._ToastrService.setToaster(res.message, "success", "success");
          // this.selectedRow.files = [res.data];
          // TODO: res must return files and remove line below
          this.getById(this.selectedRow.id);
          e._files = null;
        },
      });
    };
  }

  updateOrUpload_IMG(e: FileUpload, type: string) {
    if (this.selectedRow.files.length) {
      if (this.selectedRow.files.some((e) => e.type === type)) {
        this.updateNationalID(e, type);
      } else {
        this.uploadNationalID(e, type);
      }
    } else {
      this.uploadNationalID(e, type);
    }
  }
}
