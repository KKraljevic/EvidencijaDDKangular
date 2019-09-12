import { Component, OnInit, TemplateRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { DonorService } from 'src/app/services/donor.service';
import { User } from 'src/app/model/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Role } from 'src/app/model/role';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  donors: User[] = [];

  activeTab: number = 0;
  totalPages: number;
  currentPage: number = 0;

  searchForm: FormGroup;
  submitted: boolean = false;

  notFoundMsg: string;
  loaded: boolean = false;

  modalRef: BsModalRef;
  msg: string;
  deleted: boolean = false;

  form: FormGroup;
  roles = [
    { id: 1, name: 'Član' },
    { id: 2, name: 'Menadžer' },
    { id: 3, name: 'Administrator' }
  ];

  constructor(private donorService: DonorService, private modalService: BsModalService, private fb: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      search: ['', [Validators.maxLength(30)]]
    });

    this.form = this.fb.group({
      roles: new FormArray([])
    });

    this.loadDonors(0);
    this.addCheckboxes();
    console.log(this.form.controls['roles']);
  }

  private addCheckboxes() {
    this.roles.map((o, i) => {
      const control = new FormControl(); // if first item set to true, else false
      (this.form.controls.roles as FormArray).push(control);
    });
  }

  submit() {
    const selectedRolesIds = this.form.value.roles
      .map((v, i) => v ? this.roles[i].id : null)
      .filter(v => v !== null);
    console.log(selectedRolesIds);
    return selectedRolesIds;
  }

  formatBloodType(bt: string) {
    if (bt.endsWith('POS')) {
      return bt.replace('POS', '+')
    }
    else {
      return bt.replace('NEG', '-');
    }
  }

  formatRoles(roles: Role[]) {
    if (roles.length > 0) {
      let rolesArray = '';
      for (let i = 0; i < roles.length; i++) {
        rolesArray += this.roles[roles[i].id - 1].name + ',';
      }
      return rolesArray;
    }
    else {
      return "/";
    }
  }

  loadDonors(page: number) {

    this.searchForm.get('search').setValue('');

    this.loaded = false;

    this.donorService.getUsers(page).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Korisnici nisu pronađeni!";
      }
      this.donors = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.loaded = true;
    });
  }

  searchItems() {

    this.submitted = true;

    if (this.searchForm.invalid) {
      return;
    }

    this.loaded = false;

    if (this.searchForm.get('search').value === null || this.searchForm.get('search').value === '') {
      this.loadDonors(0);
    }
    this.donorService.findDonors(this.searchForm.get('search').value, undefined, 0, 0).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Korisnici nisu pronađeni!";
      }
      this.donors = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.loaded = true;
    });
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.msg = "Jeste li sigurni da želite da obrišete ovog korisnika?";
    this.deleted = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  openEditModal(template: TemplateRef<any>, userRoles: Role[]) {
    this.msg = "Izaberite nova odobrenja:";
    if (userRoles != undefined || userRoles != null) {
      userRoles.map((r, i) => (this.form.get('roles') as FormArray).controls[r.id - 1].setValue(true));
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });

  }

  confirmEdit(user: User) {
    console.log(user);
    let newRoles = this.submit();
    user.roles = [];
    for (let i = 0; i < newRoles.length; i++) {
      let role = new Role();
      role.id = newRoles[i];
      user.roles.push(role);
    }
    console.log(user);
    this.donorService.updateDonor(user).subscribe(data => {
      console.log('Update resp:' + data);
      this.loaded = true;
      this.donors.map((u) => { if (u.id === (<User>data).id) { u = <User>data; } });
    },
      error => {
        alert(error.error.message);
      });
    this.ok();
  }

  confirmDelete(id: number): void {
    /*this.itemService.deleteItem(id).toPromise().then(resp => {
      console.log("deleted");
      this.deleteConfirmed.emit(true);
      this.modalRef.hide(),
      error => this.modalRef.setClass('is-invalid');
    }
    );*/
    this.donorService.deleteDonor(id).toPromise().then(resp => {
      console.log("deleted");
      // this.donors.map((u, i) => { if (u.id === id) { this.donors.splice(i, 1);} });
      this.loadDonors(this.currentPage);
      this.modalRef.hide(),
        error => this.modalRef.setClass('is-invalid');
    }
    );

    this.msg = "Successfully deleted!";
    this.deleted = true;
  }
  ok() {
    this.modalRef.hide();
  }
  decline(): void {
    this.modalRef.hide();
  }


}
