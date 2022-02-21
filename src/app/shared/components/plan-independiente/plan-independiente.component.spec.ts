import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanIndependienteComponent } from './plan-independiente.component';

describe('PlanIndependienteComponent', () => {
  let component: PlanIndependienteComponent;
  let fixture: ComponentFixture<PlanIndependienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanIndependienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanIndependienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
