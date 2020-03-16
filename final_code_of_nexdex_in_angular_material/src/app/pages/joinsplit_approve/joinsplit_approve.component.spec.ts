import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinsplitapproveComponent } from './joinsplit_approve.component';

describe('JoinsplitapproveComponent', () => {
  let component: JoinsplitapproveComponent;
  let fixture: ComponentFixture<JoinsplitapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinsplitapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinsplitapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
