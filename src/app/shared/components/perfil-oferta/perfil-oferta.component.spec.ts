import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilOfertaComponent } from './perfil-oferta.component';

describe('PerfilOfertaComponent', () => {
  let component: PerfilOfertaComponent;
  let fixture: ComponentFixture<PerfilOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilOfertaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
