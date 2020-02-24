import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotehashdialogComponent } from './notehashdialog.component';

describe('NotehashdialogComponent', () => {
  let component: NotehashdialogComponent;
  let fixture: ComponentFixture<NotehashdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotehashdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotehashdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
