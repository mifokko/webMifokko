import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasOfertaComponent } from './estadisticas-oferta.component';

describe('EstadisticasOfertaComponent', () => {
  let component: EstadisticasOfertaComponent;
  let fixture: ComponentFixture<EstadisticasOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasOfertaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticasOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
