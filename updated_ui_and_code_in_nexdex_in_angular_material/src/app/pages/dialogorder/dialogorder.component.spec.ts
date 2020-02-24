import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogorderComponent } from './dialogorder.component';

describe('DialogorderComponent', () => {
  let component: DialogorderComponent;
  let fixture: ComponentFixture<DialogorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
