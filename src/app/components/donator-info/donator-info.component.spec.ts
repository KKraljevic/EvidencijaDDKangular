import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonatorInfoComponent } from './donator-info.component';

describe('DonatorInfoComponent', () => {
  let component: DonatorInfoComponent;
  let fixture: ComponentFixture<DonatorInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonatorInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
