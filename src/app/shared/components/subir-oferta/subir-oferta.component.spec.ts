import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirOfertaComponent } from './subir-oferta.component';

describe('SubirOfertaComponent', () => {
  let component: SubirOfertaComponent;
  let fixture: ComponentFixture<SubirOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubirOfertaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
