import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetkeysComponent } from './getkeys.component';

describe('GetkeysComponent', () => {
  let component: GetkeysComponent;
  let fixture: ComponentFixture<GetkeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetkeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetkeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
