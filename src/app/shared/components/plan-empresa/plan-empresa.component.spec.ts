import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEmpresaComponent } from './plan-empresa.component';

describe('PlanEmpresaComponent', () => {
  let component: PlanEmpresaComponent;
  let fixture: ComponentFixture<PlanEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
