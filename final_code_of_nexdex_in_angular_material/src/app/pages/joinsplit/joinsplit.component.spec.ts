import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinsplitComponent } from './joinsplit.component';

describe('NotehashComponent', () => {
  let component: JoinsplitComponent;
  let fixture: ComponentFixture<JoinsplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinsplitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinsplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
