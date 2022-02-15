import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaIndependienteComponent } from './busqueda-independiente.component';

describe('BusquedaIndependienteComponent', () => {
  let component: BusquedaIndependienteComponent;
  let fixture: ComponentFixture<BusquedaIndependienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaIndependienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaIndependienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
