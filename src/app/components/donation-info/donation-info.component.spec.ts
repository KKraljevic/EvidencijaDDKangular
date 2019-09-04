import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationInfoComponent } from './donation-info.component';

describe('DonationInfoComponent', () => {
  let component: DonationInfoComponent;
  let fixture: ComponentFixture<DonationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
