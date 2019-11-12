import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotehashComponent } from './notehash.component';

describe('NotehashComponent', () => {
  let component: NotehashComponent;
  let fixture: ComponentFixture<NotehashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotehashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotehashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
