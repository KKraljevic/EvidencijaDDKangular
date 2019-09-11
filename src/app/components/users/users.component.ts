import { Component, OnInit, TemplateRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DonorService } from 'src/app/services/donor.service';
import { User } from 'src/app/model/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  donors: User[] = [];

  bloodTypes: string[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  selectedBloodType: string;
  sortTypes: string[] = ['Ime', 'Prezime', 'Godine', 'Prebivalište', 'Krvna grupa'];
  selectedSorting: string;
  selectedDirection: string;

  activeTab: number = 0;
  totalPages: number;
  currentPage: number = 0;

  searchForm: FormGroup;
  submitted: boolean = false;

  notFoundMsg: string;
  loaded: boolean = false;
  
  modalRef: BsModalRef;
  msg: string;
  deleted:boolean=false;

  constructor(private donorService: DonorService, private modalService: BsModalService, private fb: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      search: ['', [Validators.maxLength(30)]]
    });

    this.selectedSorting = this.sortTypes[0];
    this.selectedDirection = 'Opadajući';
    this.loadDonors(0, 0);
  }

  formatBloodType(bt: string) {
    if (bt.endsWith('POS')) {
      return bt.replace('POS', '+')
    }
    else {
      return bt.replace('NEG', '-');
    }
  }

  loadDonors(tab: number, page?: number) {
    this.activeTab = (tab !== undefined) ? tab : this.activeTab;
    this.activeTab = this.activeTab > 2 ? 0 : this.activeTab;

    this.searchForm.get('search').setValue('');

    this.loaded = false;

    this.donorService.getDonors(this.activeTab, true, page).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Davaoci nisu pronađeni!";
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
    //this.router.navigate(['/donations/search/', this.searchForm.get('search').value]);

    this.selectedSorting = this.sortTypes[0];
    this.selectedDirection = 'Opadajući';
    this.selectedBloodType = undefined;

    this.loaded = false;

    this.donorService.findDonors(this.searchForm.get('search').value, true, 0, 0).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Donacije nisu pronađene!";
      }
      this.donors = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.activeTab = 0;
      this.loaded = true;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.msg="Are you sure you want to delete this item?";
    this.deleted=false;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(id: number): void {
    /*this.itemService.deleteItem(id).toPromise().then(resp => {
      console.log("deleted");
      this.deleteConfirmed.emit(true);
      this.modalRef.hide(),
      error => this.modalRef.setClass('is-invalid');
    }
    );*/
    this.msg="Successfully deleted!";
    this.deleted=true;
  }
  ok(){
    this.modalRef.hide();
  }
  decline(): void {
    this.modalRef.hide();
  }


}
