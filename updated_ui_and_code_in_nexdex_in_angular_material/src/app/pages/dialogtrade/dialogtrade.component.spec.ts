import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogtradeComponent } from './dialogtrade.component';

describe('DialogtradeComponent', () => {
  let component: DialogtradeComponent;
  let fixture: ComponentFixture<DialogtradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogtradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogtradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
