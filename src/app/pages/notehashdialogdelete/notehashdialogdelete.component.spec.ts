import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotehashdialogdeleteComponent } from './notehashdialogdelete.component';

describe('NotehashdialogdeleteComponent', () => {
  let component: NotehashdialogdeleteComponent;
  let fixture: ComponentFixture<NotehashdialogdeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotehashdialogdeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotehashdialogdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
