import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BilateralComponent } from './bilateral.component';

describe('BilateralComponent', () => {
  let component: BilateralComponent;
  let fixture: ComponentFixture<BilateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BilateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BilateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
