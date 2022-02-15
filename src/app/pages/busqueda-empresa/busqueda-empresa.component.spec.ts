import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaEmpresaComponent } from './busqueda-empresa.component';

describe('BusquedaEmpresaComponent', () => {
  let component: BusquedaEmpresaComponent;
  let fixture: ComponentFixture<BusquedaEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
