import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinsplitTransferComponent } from './joinsplit_transfer.component';

describe('JoinsplitTransferComponent', () => {
  let component: JoinsplitTransferComponent;
  let fixture: ComponentFixture<JoinsplitTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinsplitTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinsplitTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
