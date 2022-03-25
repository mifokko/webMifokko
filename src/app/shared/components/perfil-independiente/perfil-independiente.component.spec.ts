import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilIndependienteComponent } from './perfil-independiente.component';

describe('PerfilIndependienteComponent', () => {
  let component: PerfilIndependienteComponent;
  let fixture: ComponentFixture<PerfilIndependienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilIndependienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilIndependienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
