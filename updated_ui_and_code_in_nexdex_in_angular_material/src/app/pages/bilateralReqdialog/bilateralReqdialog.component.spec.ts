import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotespendingdialogComponent } from '../notespendingdialog/notespendingdialog.component';

describe('NotespendingdialogComponent', () => {
  let component: NotespendingdialogComponent;
  let fixture: ComponentFixture<NotespendingdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotespendingdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotespendingdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
